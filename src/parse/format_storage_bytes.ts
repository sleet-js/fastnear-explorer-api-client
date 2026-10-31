// ========================================
// FORMAT_STORAGE_BYTES
// a storage size as a readable size.
//
//   format_storage_bytes(0)          ->  "0 B"
//   format_storage_bytes(2263199)    ->  "2.2 MB"
//
// the same shape the fastnear explorer shows.
// ========================================

const KILOBYTE = 1024;
const MEGABYTE = 1024 * 1024;

export function format_storage_bytes(bytes: number): string {
  if (bytes < KILOBYTE) return `${bytes} B`;
  if (bytes < MEGABYTE) return `${(bytes / KILOBYTE).toFixed(1)} KB`;
  return `${(bytes / MEGABYTE).toFixed(1)} MB`;
}
// ========================================
// copyright 2026 by sleet.near
