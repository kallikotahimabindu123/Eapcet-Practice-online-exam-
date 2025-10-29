/*
  # Fix user registration policies

  1. Security Updates
    - Drop existing conflicting policies
    - Add proper INSERT policy for user registration
    - Ensure users can register without authentication issues

  2. Changes
    - Remove duplicate INSERT policies
    - Add single comprehensive INSERT policy for registration
    - Maintain existing SELECT and UPDATE policies
*/

-- Drop existing INSERT policies that might be conflicting
DROP POLICY IF EXISTS "Allow user profile creation during signup" ON users;
DROP POLICY IF EXISTS "Users can insert own profile during registration" ON users;

-- Create a single, clear INSERT policy for registration
CREATE POLICY "Enable user registration"
  ON users
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Ensure authenticated users can still insert their own data
CREATE POLICY "Authenticated users can insert own data"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);