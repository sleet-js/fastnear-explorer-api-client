// ========================================
// IS_PRINTABLE_TEXT
// is this text human-readable?
//
// printable means the ascii range, plus tab, newline and carriage
// return. anything else is a control character, which means the
// payload is binary and should be shown as hex rather than as text.
//
// this is what decides between a utf-8 view and a hex view.
// ========================================

const PRINTABLE = /^[\x20-\x7e\t\n\r]*$/;

export function is_printable_text(text: string): boolean {
  return PRINTABLE.test(text);
}
// ========================================
// copyright 2026 by sleet.near
