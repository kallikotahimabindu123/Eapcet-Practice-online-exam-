import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

// Minimal types to avoid import errors if your types file differs
type UserProfile = any;
type RegisterData = {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  date_of_birth?: string;
  address?: string;
  role?: string;
  photo?: File | null;
};

type AuthContextType = {
  user: UserProfile | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// Example helper to add near top of file:
const readUserMeta = (u: any) => {
  // some SDKs return user_metadata, some code uses raw_user_meta_data
  return (u && ((u.raw_user_meta_data as any) ?? (u.user_metadata as any) ?? {})) as Record<string, any>;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('AuthProvider: init start');
    let mounted = true;

    const cleanupAndFinish = () => {
      if (mounted) {
        setIsLoading(false);
        console.log('AuthProvider: init finished, isLoading=false');
      }
    };

    // watchdog: ensure we never stay loading forever
    const watchdog = setTimeout(() => {
      if (mounted && isLoading) {
        console.warn('AuthProvider: init watchdog triggered — forcing isLoading=false');
        setIsLoading(false);
      }
  }, 20000);

    (async () => {
      if (!isSupabaseConfigured) {
        console.error('AuthProvider: supabase not configured, aborting init');
        // Surface a clear UI-visible error and stop the init path so other code doesn't call the SDK
        if (mounted) {
          setError('Supabase not configured: set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY and restart the dev server.');
          setIsLoading(false);
        }
        return;
      }
      try {
        // guard against supabase hanging by adding a small timeout
        const getSessionPromise = supabase.auth.getSession();
        // allow a slightly longer timeout during init in case network is slow
        const sessionResult = await Promise.race([
          getSessionPromise,
    new Promise((_res, rej) => setTimeout(() => rej(new Error('getSession timeout (network too slow). Check your network or increase timeout in AuthProvider.')), 20000)),
        ]) as any;

        const session = sessionResult?.data?.session;
        console.log('AuthProvider: getSession result', session);
        if (!mounted) return;

        if (session) {
          setToken(session.access_token ?? null);
          try {
            await fetchUserProfile(session.user.id);
          } catch (e) {
            console.warn('AuthProvider: fetchUserProfile during init failed', e);
          }
        } else {
          // no session -> ensure local state cleared
          setUser(null);
          setToken(null);
        }
      } catch (e) {
        console.error('AuthProvider: init getSession error', e);
      } finally {
        // always unset loading for init path
        cleanupAndFinish();
        clearTimeout(watchdog);
      }
    })();

    // subscribe to auth changes
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        console.log('AuthProvider: onAuthStateChange', _event, session);
        try {
          if (session) {
            // set token immediately
            setToken(session.access_token ?? null);

            // set a minimal user immediately so UI can react quickly while
            // a full profile fetch runs in the background
            const sessionUser = (session as any)?.user;
            if (sessionUser) {
              const meta = readUserMeta(sessionUser);
              const immediateFallback = {
                id: sessionUser.id,
                email: sessionUser.email,
                role: meta?.role ?? 'student',
                name: meta?.name ?? null,
              } as any;
              setUser(immediateFallback);
            }

            // fetch full profile but don't block the handler's quick response
            try {
              await fetchUserProfile((session as any).user.id);
            } catch (e) {
              console.warn('AuthProvider: background fetchUserProfile failed', e);
            }
          } else {
            setUser(null);
            setToken(null);
          }
        } catch (e) {
          console.error('AuthProvider: onAuthStateChange handler error', e);
        } finally {
          setIsLoading(false);
        }
      })();
    });

    return () => {
      mounted = false;
      try {
        data?.subscription?.unsubscribe?.();
      } catch (e) {
        console.warn('Failed to unsubscribe auth listener', e);
      }
      clearTimeout(watchdog);
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
      if (error) {
        console.warn('fetchUserProfile supabase error', error);
        setUser(null);
        return null;
      }
      setUser(data);
      return data;
    } catch (e) {
      console.error('fetchUserProfile exception', e);
      setUser(null);
      return null;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const cleanEmail = email.trim();
      console.log('AuthContext: login attempt', { cleanEmail });
      if (!isSupabaseConfigured) {
        const msg = 'Supabase API key or URL missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY and restart the dev server.';
        setError(msg);
        console.error('AuthContext: login aborted - supabase not configured');
        return false;
      }

      // guard sign-in with a timeout so the UI doesn't hang forever
      // Use a direct signIn call (no retry wrapper) to avoid masking SDK behaviour.
      // The SDK may update auth state via onAuthStateChange; we log the full response for debugging.
      const signInResp = await supabase.auth.signInWithPassword({ email: cleanEmail, password }) as any;
      const { data, error } = signInResp;
      console.log('AuthContext: signInWithPassword response', { data, error, signInResp });
      if (error) {
        // Map common low-level error texts to clearer guidance
        const msgLow = (error?.message || '').toString().toLowerCase();
        if (msgLow.includes('no api key') || msgLow.includes('invalid api key') || msgLow.includes('apikey')) {
          setError('Supabase API key invalid or missing. Set VITE_SUPABASE_ANON_KEY in your environment and restart the dev server.');
        } else {
          setError(error.message || 'Login failed');
        }
        return false;
      }
      const userData = data?.user;
      const session = data?.session;
      // If Supabase returned a user but no session, likely email confirmation required
      if (userData && !session) {
        const msg = 'Your account exists but is not signed in — please confirm your email before signing in.';
        setError(msg);
        return false;
      }
      if (userData && session) {
        setToken(session.access_token);

        // immediate minimal user so UI can proceed
        const meta = readUserMeta(userData);
        const immediateFallback = {
          id: userData.id,
          email: userData.email,
          role: meta?.role ?? 'student',
          name: meta?.name ?? null,
        } as any;
        setUser(immediateFallback);

        // fetch full profile in background
        fetchUserProfile(userData.id).catch((bgErr) => {
          console.warn('Background fetchUserProfile failed', bgErr);
        });

        return true;
      }
      return false;
    } catch (e) {
      console.error('AuthContext: login exception', e);
      setError((e as any)?.message ?? 'Login failed');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const withTimeout = <T,>(p: Promise<T>, ms = 20000): Promise<T> =>
    Promise.race<T>([
      p as Promise<T>,
      new Promise<T>((_, rej) => setTimeout(() => rej(new Error('Request timed out (slow network). Try again or increase timeout.')), ms)),
    ]);

  // Retry helper: retries async function on error with exponential backoff
  const retryWithBackoff = async <T,>(fn: () => Promise<T>, attempts = 3, baseDelay = 1000): Promise<T> => {
    let lastErr: any = null;
    for (let i = 0; i < attempts; i++) {
      try {
        return await fn();
      } catch (e) {
        lastErr = e;
        const delay = baseDelay * Math.pow(2, i);
        console.warn(`retryWithBackoff: attempt ${i + 1} failed, retrying in ${delay}ms`, e);
        // small delay before retrying
        // eslint-disable-next-line no-await-in-loop
        await new Promise((res) => setTimeout(res, delay));
      }
    }
    throw lastErr;
  };

  const register = async (payload: RegisterData): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    try {
      // create auth user (await this)
      console.log('AuthContext: register attempt', { email: payload.email });
      const signUpCall = async () => {
        return await supabase.auth.signUp({
          email: payload.email,
          password: payload.password,
          options: { data: { name: payload.name ?? null, role: payload.role ?? 'student' } }
        }) as any;
      };

      // retry signUp up to 3 times; each attempt allowed 60s
      const { data: authData, error: authError } = await retryWithBackoff(() => withTimeout(signUpCall(), 60000), 3, 1000);

      console.log('AuthContext: signUp response', { authData, authError });

      if (authError) {
        const msg = (authError as any)?.message ?? JSON.stringify(authError);
        let userMessage = msg || 'Registration failed';
        if ((authError as any)?.code === 'user_already_exists' || msg.toLowerCase().includes('already')) {
          userMessage = 'Email already registered. Try signing in or use "Forgot password".';
        } else if (msg.toLowerCase().includes('no api key') || msg.toLowerCase().includes('apikey')) {
          userMessage = 'Supabase API key missing or invalid. Check VITE_SUPABASE_ANON_KEY and restart dev server.';
        }
        setError(userMessage);
        return { success: false, message: userMessage };
      }

      // if signup returned a session, use it to set local auth state immediately
      const returnedUser = (authData as any)?.user;
      const returnedSession = (authData as any)?.session;
      if (returnedSession) {
        setToken(returnedSession.access_token ?? null);
      }
      if (returnedUser) {
        const meta = readUserMeta(returnedUser);
        setUser({
          id: returnedUser.id,
          email: returnedUser.email,
          role: meta?.role ?? payload.role ?? 'student',
          name: meta?.name ?? payload.name ?? null,
        } as any);
        // background fetch to replace minimal user with profile row
        fetchUserProfile(returnedUser.id).catch((e) => console.warn('Background: fetchUserProfile failed', e));
      }

      // Build profile object
      const profile = {
        id: (authData as any)?.user?.id,
        email: payload.email,
        name: payload.name ?? null,
        phone: payload.phone ?? null,
        date_of_birth: payload.date_of_birth ?? null,
        address: payload.address ?? null,
        role: payload.role ?? 'student',
        photo_url: null as string | null,
      };

      // If signup returned a session, attempt to create the profile row now so the caller sees
      // any problems (otherwise some setups require email confirm and session will be null).
      if (returnedUser && !returnedSession) {
        // No session (likely email confirmation required). Fire-and-forget profile creation
        // and inform caller to confirm email.
        (async () => {
          try {
            if (payload.photo) {
              try {
                const fileExt = payload.photo.name.split('.').pop();
                const fileName = `${profile.id}.${fileExt}`;
                await supabase.storage.from('avatars').upload(fileName, payload.photo, { upsert: true });
                const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
                profile.photo_url = urlData?.publicUrl ?? null;
                console.log('Background: avatar uploaded', profile.photo_url);
              } catch (uploadErr) {
                console.warn('Background: avatar upload failed', uploadErr);
              }
            }

            const { error: profileError } = await supabase.from('users').upsert(profile, { onConflict: 'id' });
            if (profileError) {
              console.warn('Background: profile upsert error', profileError);
            } else {
              console.log('Background: profile upserted for', profile.id);
            }
          } catch (bgErr) {
            console.error('Background registration task failed', bgErr);
          }
        })();

        // Inform the caller that they must confirm their email before full activation
        const infoMsg = 'Registration almost complete. Please check your email and confirm your account to activate it.';
        setError(infoMsg);
        return { success: true, message: infoMsg };
      }

      // If we have a session, attempt to upload avatar and upsert profile now and report any errors
      if (returnedUser && returnedSession) {
        try {
          if (payload.photo) {
            try {
              const fileExt = payload.photo.name.split('.').pop();
              const fileName = `${profile.id}.${fileExt}`;
              await supabase.storage.from('avatars').upload(fileName, payload.photo, { upsert: true });
              const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName);
              profile.photo_url = urlData?.publicUrl ?? null;
              console.log('Avatar uploaded', profile.photo_url);
            } catch (uploadErr) {
              console.warn('Avatar upload failed', uploadErr);
            }
          }

          const { error: profileError } = await supabase.from('users').upsert(profile, { onConflict: 'id' });
          if (profileError) {
            console.warn('Profile upsert error', profileError);
            const msg = 'Account created but profile record could not be created: ' + (profileError.message ?? String(profileError));
            setError(msg);
            // return success (user exists in auth) but include the profile error message
            return { success: true, message: msg };
          }

          console.log('Profile upserted for', profile.id);
        } catch (bgErr) {
          console.error('Synchronous registration task failed', bgErr);
          const msg = 'Account created but an internal error occurred while creating the profile.';
          setError(msg);
          return { success: true, message: msg };
        }
      }

      // Populate local context quickly (attempt fetch but don't block return)
      fetchUserProfile(profile.id).catch((e) => console.warn('Background: fetchUserProfile failed', e));

      // return success immediately so UI is responsive
      return { success: true };
    } catch (err: any) {
      console.error('Registration failed (exception):', err);
      const message = err?.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error('AuthContext signOut error', e);
    } finally {
      setUser(null);
      setToken(null);
      setError(null);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};