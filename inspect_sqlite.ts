import Database from "better-sqlite3";
import path from "path";

async function inspectSqlite() {
  try {
    const dbPath = path.resolve(process.cwd(), "dev.db");
    console.log(`Inspecting SQLite at: ${dbPath}`);
    const db = new Database(dbPath);
    
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log("Tables found:", tables.map(t => t.name).join(", "));
    
    for (const table of tables) {
      if (table.name.toLowerCase().includes("blog") || table.name.toLowerCase().includes("post")) {
        const count = db.prepare(`SELECT COUNT(*) as count FROM ${table.name}`).get();
        console.log(`Table '${table.name}' has ${count.count} rows.`);
        if (count.count > 0) {
            const sample = db.prepare(`SELECT * FROM ${table.name} LIMIT 1`).get();
            console.log(`  Sample Title: ${sample.title || sample.name || "N/A"}`);
        }
      }
    }
    
    db.close();
  } catch (error) {
    console.error("SQLite inspection failed:", error);
  }
}

inspectSqlite();
