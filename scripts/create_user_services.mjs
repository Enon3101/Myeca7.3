import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../dev.db');
console.log('Opening database at:', dbPath);

const db = new Database(dbPath);

try {
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL,
      service_type TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'active',
      metadata TEXT,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
      updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
    );
  `);
  console.log('Table user_services created successfully.');
} catch (err) {
  console.error('Error creating table:', err);
} finally {
  db.close();
}
