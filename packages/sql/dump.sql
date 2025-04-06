-- Create a dedicated database
CREATE DATABASE dsqr_website;

-- Connect to the new database
\c dsqr_website

-- Create your table in the new database
CREATE TABLE email_subscribers (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  active BOOLEAN DEFAULT TRUE
);

-- Add an index
CREATE INDEX idx_email_subscribers_email ON email_subscribers(email);

-- test
-- INSERT INTO email_subscribers (email) VALUES ('example@email.com');
-- SELECT * FROM email_subscribers;