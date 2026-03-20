import Database from "better-sqlite3";
import path from "path";

async function inspectSqlite() {
  try {
    const dbPath = path.resolve(process.cwd(), "dev.db");
    const db = new Database(dbPath);
    
    const tables = ["blog_posts", "categories", "daily_updates"];
    for (const table of tables) {
      if (db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name=?").get(table)) {
        const count = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get();
        console.log(`Table '${table}' has ${count.count} rows.`);
      } else {
        console.log(`Table '${table}' NOT FOUND.`);
      }
    }
    db.close();
  } catch (error) {
    console.error("SQLite inspection failed:", error);
  }
}

inspectSqlite();
