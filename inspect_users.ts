import Database from 'better-sqlite3';

async function inspect() {
  const db = new Database('dev.db');
  
  try {
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log("Tables in dev.db:", tables.map((t: any) => t.name));
    
    if (tables.some((t: any) => t.name === 'users')) {
      const users = db.prepare("SELECT * FROM users").all();
      console.log(`Found ${users.length} users in 'users' table.`);
      console.log("Sample Users:", JSON.stringify(users.slice(0, 3), null, 2));
      
      const roles = db.prepare("SELECT role, COUNT(*) as count FROM users GROUP BY role").all();
      console.log("User Roles:", roles);
    } else {
      console.log("No 'users' table found in dev.db");
    }
  } catch (error) {
    console.error("Inspection failed:", error);
  } finally {
    db.close();
  }
}

inspect();
