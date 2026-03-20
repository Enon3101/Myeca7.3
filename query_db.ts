import Database from 'better-sqlite3';

const db = new Database('./dev.db');

const users = db.prepare('SELECT id, first_name FROM users').all();
const categories = db.prepare('SELECT id, name FROM categories').all();
const posts = db.prepare('SELECT id, title, slug FROM blog_posts').all();

console.log(JSON.stringify({ users, categories, posts }, null, 2));
