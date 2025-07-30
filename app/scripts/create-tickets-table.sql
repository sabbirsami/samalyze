-- Drop table if exists (for clean setup)
DROP TABLE IF EXISTS tickets;

-- Create tickets table in Supabase
CREATE TABLE IF NOT EXISTS tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'resolved')),
  sentiment TEXT CHECK (sentiment IN ('positive', 'negative', 'neutral')),
  intent TEXT CHECK (intent IN ('question', 'complaint', 'compliment', 'other')),
  ai_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tickets_email ON tickets(email);

-- Insert some sample data for testing
INSERT INTO tickets (email, subject, message, status, sentiment, intent, ai_response) VALUES
('test@example.com', 'Login Issue', 'I cannot log into my account', 'resolved', 'negative', 'complaint', 'Thank you for contacting us. Please try resetting your password using the forgot password link.'),
('user@example.com', 'Great Service', 'Your support team is amazing!', 'resolved', 'positive', 'compliment', 'Thank you so much for your kind words! We really appreciate your feedback.');

-- Enable Row Level Security (optional, for multi-tenant setup)
-- ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
