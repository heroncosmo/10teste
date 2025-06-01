-- Add whatsapp column to profiles table
BEGIN;

-- Add the whatsapp column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'profiles'
        AND column_name = 'whatsapp'
    ) THEN
        ALTER TABLE profiles ADD COLUMN whatsapp TEXT;
    END IF;
END $$;

-- Update schema cache for this change
SELECT schema_cache.refresh('public');

COMMIT; 