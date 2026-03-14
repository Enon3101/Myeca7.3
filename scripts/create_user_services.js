const sqlite3 = require('better-sqlite3');
const db = new sqlite3('dev.db');

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
