-- =====================================================
-- Storage Policies for Verification Documents
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any (to avoid conflicts)
DROP POLICY IF EXISTS "Users can upload own verification docs" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own verification docs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view all verification docs" ON storage.objects;

-- Policy 1: Users can upload their own verification documents
CREATE POLICY "Users can upload own verification docs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'verification-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Users can view their own documents
CREATE POLICY "Users can view own verification docs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'verification-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 3: Admins can view all documents
CREATE POLICY "Admins can view all verification docs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'verification-documents' AND
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND user_type IN ('admin', 'superadmin')
  )
);

-- Policy 4: Admins can delete documents if needed
CREATE POLICY "Admins can delete verification docs"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'verification-documents' AND
  EXISTS (
    SELECT 1 FROM users 
    WHERE id = auth.uid() 
    AND user_type IN ('admin', 'superadmin')
  )
);

-- Verify policies are created
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'objects' 
AND policyname LIKE '%verification%';

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Storage policies created successfully!';
  RAISE NOTICE '📁 Bucket: verification-documents';
  RAISE NOTICE '🔒 Security: RLS enabled';
  RAISE NOTICE '✅ Users can upload/view own files';
  RAISE NOTICE '✅ Admins can view all files';
END $$;
