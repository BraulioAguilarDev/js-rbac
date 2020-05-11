class RbacError extends Error {
  constructor(message: any) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;

    Error.captureStackTrace(this, this.constructor);
  }
}
export class FirebaseError extends RbacError { }
export class BadRequest extends RbacError { }
export class VaultError extends RbacError { }
