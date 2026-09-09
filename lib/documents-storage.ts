// Shared helpers for the admin Documents feature's Supabase Storage bucket.
//
// The `documents` bucket is private (flipped from public after the security
// review — see SECURITY_FIXES.md item 12). `documents.file_url` still stores
// a "public-style" URL string generated at upload time via
// supabase.storage.from('documents').getPublicUrl(path) — that's kept
// unchanged deliberately: it's a convenient, stable way to encode the
// bucket-relative path, even though the URL itself is no longer directly
// fetchable now that the bucket is private. Anywhere the actual file
// content is needed, extract the path with this helper and request a fresh
// signed URL — never fetch `file_url` directly.

export const DOCUMENTS_BUCKET = 'documents'

/**
 * Extracts the bucket-relative storage path from a stored file_url value,
 * e.g. "https://xxx.supabase.co/storage/v1/object/public/documents/uploads/123.pdf"
 * -> "uploads/123.pdf"
 */
export function extractDocumentStoragePath(fileUrl: string): string | null {
  const marker = `/${DOCUMENTS_BUCKET}/`
  const idx = fileUrl.indexOf(marker)
  if (idx === -1) return null
  return fileUrl.slice(idx + marker.length)
}
