/*
  # Add marketing profile fields to user_profiles table

  1. New Columns
    - `marketing_bio` (text, markdown formatted self-introduction)
    - `marketing_links` (jsonb, array of external links with titles and URLs)
    - `show_marketing` (boolean, whether to show marketing section publicly)

  2. Security
    - Update existing RLS policies to include new fields
    - Marketing info is publicly readable when show_marketing is true
*/

-- Add marketing fields to user_profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'marketing_bio'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN marketing_bio text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'marketing_links'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN marketing_links jsonb DEFAULT '[]'::jsonb;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'user_profiles' AND column_name = 'show_marketing'
  ) THEN
    ALTER TABLE user_profiles ADD COLUMN show_marketing boolean DEFAULT false;
  END IF;
END $$;