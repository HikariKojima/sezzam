// for information about these interfaces
import type { Customers, Session } from "$lib/server/db/schema";

declare global {
  namespace App {
    interface Locals {
      user: Customers | null;
      session: Session | null;
    }
  }
}

export {};
