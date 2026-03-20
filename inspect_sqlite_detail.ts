import Database from "better-sqlite3";
import path from "path";

async function inspectSqliteDetail() {
  try {
    const dbPath = path.resolve(process.cwd(), "dev.db");
    const db = new Database(dbPath);
    
    console.log("--- blog_posts details ---");
    const posts = db.prepare("SELECT * FROM blog_posts").all();
    console.log(JSON.stringify(posts, null, 2));

    console.log("--- categories details ---");
    const categories = db.prepare("SELECT * FROM categories").all();
    console.log(JSON.stringify(categories, null, 2));

    db.close();
  } catch (error) {
    console.error("SQLite detail inspection failed:", error);
  }
}

inspectSqliteDetail();
