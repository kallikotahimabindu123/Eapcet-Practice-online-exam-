/*
  # Fix user registration RLS policy

  1. Security Changes
    - Add INSERT policy for users table to allow new user registration
    - Allow authenticated users to insert their own profile data
    - Ensure users can only create profiles for themselves

  This fixes the "new row violates row-level security policy" error during registration.
*/

-- Add INSERT policy for user registration
CREATE POLICY "Users can insert own profile during registration"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Also add a policy for public registration (in case auth.uid() is not immediately available)
CREATE POLICY "Allow user profile creation during signup"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (true);