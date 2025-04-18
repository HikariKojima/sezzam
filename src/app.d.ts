// for information about these interfaces
declare global {
  namespace App {
    interface Locals {
      user: import("./routes/api/auth").SessionValidationResult["user"];
      session: import("./routes/api/auth").SessionValidationResult["session"];
    }
  }
}

export {};
