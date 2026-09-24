export function assertMigrationsAllowed(environment = process.env.NODE_ENV): void {
  if (environment === "production") {
    throw new Error("Les migrations de base sont interdites en production");
  }
}
