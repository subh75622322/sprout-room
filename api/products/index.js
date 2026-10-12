import initSqlJs from 'sql.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../server/data.db');

let db = null;
let SQL = null;

async function getDb() {
  if (db) return db;
  
  SQL = await initSqlJs();
  
  if (fs.existsSync(dbPath)) {
    const filebuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(filebuffer);
  }
  
  return db;
}

function queryToObjects(db, query) {
  try {
    const results = db.exec(query);
    if (!results || !results.length) return [];
    
    const columns = results[0].columns;
    const values = results[0].values;
    
    return values.map(row => {
      const obj = {};
      columns.forEach((col, idx) => {
        obj[col] = row[idx];
      });
      return obj;
    });
  } catch (err) {
    console.error('Query error:', err);
    return [];
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const database = await getDb();
    const { category, q, sort, featured } = req.query;
    
    let sql = `
      SELECT p.* FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;

    if (featured === '1') {
      sql += ' AND p.featured = 1';
    }

    if (category && category !== 'All') {
      sql += ` AND c.name = '${category.replace(/'/g, "''")}'`;
    }

    if (q) {
      const searchTerm = q.replace(/'/g, "''");
      sql += ` AND (p.name LIKE '%${searchTerm}%' OR p.latin LIKE '%${searchTerm}%' OR p.description LIKE '%${searchTerm}%')`;
    }

    if (sort === 'price-asc') {
      sql += ' ORDER BY p.price ASC';
    } else if (sort === 'price-desc') {
      sql += ' ORDER BY p.price DESC';
    } else if (sort === 'name') {
      sql += ' ORDER BY p.name ASC';
    } else {
      sql += ' ORDER BY p.featured DESC, p.name ASC';
    }

    const rows = queryToObjects(database, sql);
    res.status(200).json(rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}
