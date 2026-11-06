// ========================================
// FASTFS_BYTES_TO_HEX
// the hex of a byte array, for the views that show raw bytes.
//
//   00 09 00 00 00 68 65 6c 6c 6f
//
// - one space between the bytes
// - a line break every 16 bytes, so a long payload is readable and a
//   reader can count the offset
// - the lines are NOT indented — the offset is on the line, so an
//   indent would make the offset wrong
//
// THE LINE BREAK IS PART OF THE FORMAT, NOT A CSS CONCERN.
//
// a css `word-break: break-all` breaks at arbitrary characters and
// lands mid-byte, so the bytes on a line would not line up with the
// offset. the breaks go in the string.
//
// this is the FastFS hex. the plain `bytes_to_hex` has no line
// breaks — that one is a one-line view of a decoded argument.
// ========================================

// the bytes per line.
const FASTFS_HEX_BYTES_PER_LINE = 16;

export function fastfs_bytes_to_hex_fun(bytes: Uint8Array): string {
  if (bytes.length === 0) return "";

  const lines: string[] = [];

  for (let start = 0; start < bytes.length; start += FASTFS_HEX_BYTES_PER_LINE) {
    const end = Math.min(start + FASTFS_HEX_BYTES_PER_LINE, bytes.length);
    const parts: string[] = [];
    for (let index = start; index < end; index++) {
      parts.push((bytes[index] ?? 0).toString(16).padStart(2, "0"));
    }
    lines.push(parts.join(" "));
  }

  return lines.join("\n");
}
// ========================================
// copyright 2026 by sleet.near
