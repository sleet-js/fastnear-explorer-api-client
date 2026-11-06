// ========================================
// FASTFS_FILE_URL
// where a FastFS file is served from.
//
//   https://{predecessor}.fastfs.io/{receiver}/{relative_path}
//
//   fastfs://{predecessor}/{receiver}/{relative_path}
//
// `predecessor` is the account that SIGNED the transaction, not the
// receiver. it is the receipt's predecessor. the receiver is ANY
// account — `fastfs.near` is the convention and the namespace
// everyone uses, and there is no contract on it.
//
// the path is joined with a single slash and no encoding: a FastFS
// path is a path, and the file is served under the same name it was
// uploaded with.
// ========================================

export function fastfs_file_url_fun(
  predecessor: string,
  receiver: string,
  relative_path: string,
): string {
  return `https://${predecessor}.fastfs.io/${receiver}/${relative_path}`;
}

export function fastfs_file_uri_fun(
  predecessor: string,
  receiver: string,
  relative_path: string,
): string {
  return `fastfs://${predecessor}/${receiver}/${relative_path}`;
}
// ========================================
// copyright 2026 by sleet.near
