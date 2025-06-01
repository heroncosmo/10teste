-- Drop tables if they exist to ensure clean creation
DROP TABLE IF EXISTS unlocked_leads;
DROP TABLE IF EXISTS user_credits;
DROP FUNCTION IF EXISTS use_credit_transaction;

-- Create user_credits table
CREATE TABLE user_credits (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  credits_total INTEGER NOT NULL DEFAULT 10,
  credits_used INTEGER NOT NULL DEFAULT 0,
  plan_type VARCHAR(20) NOT NULL DEFAULT 'free',
  plan_started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  plan_expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create unlocked_leads table
CREATE TABLE unlocked_leads (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id VARCHAR(255) NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT unique_user_lead UNIQUE (user_id, lead_id)
);

-- Create a stored procedure for using credits in a transaction
CREATE FUNCTION use_credit_transaction(p_user_id UUID, p_lead_id VARCHAR) 
RETURNS VOID AS $$
BEGIN
  -- First check if this lead is already unlocked
  IF EXISTS (SELECT 1 FROM unlocked_leads WHERE user_id = p_user_id AND lead_id = p_lead_id) THEN
    RETURN; -- Lead already unlocked, no need to use credits
  END IF;
  
  -- Check if user has available credits
  IF EXISTS (
    SELECT 1 FROM user_credits 
    WHERE user_id = p_user_id 
    AND credits_used < credits_total
    AND (plan_expires_at IS NULL OR plan_expires_at > NOW())
  ) THEN
    -- Use a credit
    UPDATE user_credits 
    SET 
      credits_used = credits_used + 1,
      updated_at = NOW()
    WHERE user_id = p_user_id;
    
    -- Record the unlocked lead
    INSERT INTO unlocked_leads (user_id, lead_id, unlocked_at)
    VALUES (p_user_id, p_lead_id, NOW());
  ELSE
    RAISE EXCEPTION 'User does not have available credits';
  END IF;
END;
$$ LANGUAGE plpgsql; 