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
  USING (auth.role() = 'authenticated');

-- Storage Policies for 'documents' bucket
-- Note: These need to be run in the SQL editor to apply to storage.objects
-- However, Supabase Storage RLS is often managed in the UI. 
-- Here is the SQL if you want to run it:

/*
-- Allow authenticated users to upload files to 'documents' bucket
CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'documents');

-- Allow authenticated users to update/delete their files
CREATE POLICY "Allow authenticated management"
ON storage.objects FOR ALL
TO authenticated 
USING (bucket_id = 'documents');

-- Allow public to read files (if bucket is public)
CREATE POLICY "Allow public read"
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'documents');
*/

-- Create trigger for updated_at
CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Instructions for Storage Bucket:
-- 1. Go to Supabase Storage
-- 2. Create a new bucket named 'documents'
-- 3. Set it to 'Public' if you want public access, or keep it private and use signed URLs (public is easier for this use case)
