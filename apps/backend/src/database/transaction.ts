import { Database, db } from ".";

export function runTransaction<T>(callback: (tx: Database) => Promise<T>) {
  return db.transaction(async (tx) => {
    return await callback(tx);
  });
}
