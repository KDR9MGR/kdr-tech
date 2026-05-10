-- Migration 012: Create documents table for storing Claude-generated assets and other files
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_type TEXT,
  size INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policies (admin only)
CREATE POLICY "Admin full access on documents"
  ON documents
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create trigger for updated_at
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Instructions for Storage Bucket:
-- 1. Go to Supabase Storage
-- 2. Create a new bucket named 'documents'
-- 3. Set it to 'Public' if you want public access, or keep it private and use signed URLs (public is easier for this use case)
