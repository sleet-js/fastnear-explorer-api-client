// ========================================
// ERROR_KIND
// the kinds of failure the protocol can report for an action.
//
// each is a single-key object, matching the api's encoding of the
// error kind. the payload inside is not uniform — some carry a
// message, some carry nothing.
// ========================================

export type ERROR_KIND =
  | { FunctionCallError: { ExecutionError: string; index: number } }
  | { AccountAlreadyExists: Record<string, never> }
  | { AccountDoesNotExist: Record<string, never> }
  | { CreateAccountNotAllowed: Record<string, never> }
  | { DeleteAccountDoesNotExist: Record<string, never> }
  | { DeleteKeyDoesNotExist: Record<string, never> }
  | { AddKeyAlreadyExists: Record<string, never> }
  | { AddKeyDoesNotExist: Record<string, never> }
  | { LackBalanceForState: Record<string, never> }
  | { InsufficientStake: Record<string, never> }
  | { DelegateActionInvalidNonce: Record<string, never> }
  | { DelegateActionInvalidSignature: Record<string, never> }
  | { DelegateActionUnauthorized: Record<string, never> }
  | { InvalidSignerId: Record<string, never> }
  | { InvalidAccessKeyError: Record<string, never> }
  | { InvalidNonce: Record<string, never> }
  | { NotEnoughBalance: Record<string, never> }
  | { UnknownAccount: Record<string, never> }
  | { UnknownAction: Record<string, never> }
  | { UnknownContract: Record<string, never> }
  | { OtherError: Record<string, unknown> };
// ========================================
// copyright 2026 by sleet.near
