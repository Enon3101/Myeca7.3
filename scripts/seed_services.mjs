import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../dev.db');
const db = new Database(dbPath);

try {
  // Try to find a user to assign the service to
  const user = db.prepare('SELECT id FROM users LIMIT 1').get();
  
  if (user) {
    db.prepare(`
      INSERT INTO user_services (user_id, service_type, status, metadata)
      VALUES (?, ?, ?, ?)
    `).run(user.id, 'ITR', 'active', JSON.stringify({ ay: '2025-26' }));
    
    console.log('Sample ITR service seeded for user:', user.id);
  } else {
    console.log('No users found to seed services for.');
  }
} catch (err) {
  console.error('Error seeding data:', err);
} finally {
  db.close();
}
