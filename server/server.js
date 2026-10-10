import express from 'express';
import initSqlJs from 'sql.js';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
let db = null;
let SQL = null;
const dbPath = path.join(__dirname, 'data.db');

// Load or initialize database
async function initializeDatabase() {
  SQL = await initSqlJs();
  
  let filebuffer = null;
  if (fs.existsSync(dbPath)) {
    filebuffer = fs.readFileSync(dbPath);
  }

  if (filebuffer) {
    db = new SQL.Database(filebuffer);
    console.log('Database loaded from file');
  } else {
    db = new SQL.Database();
    console.log('Creating new database...');
    
    // Create tables
    db.run(`
      CREATE TABLE categories (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL UNIQUE
      )
    `);

    db.run(`
      CREATE TABLE products (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        latin TEXT,
        category_id INTEGER,
        price REAL NOT NULL,
        description TEXT,
        light TEXT,
        water TEXT,
        size TEXT,
        shape TEXT,
        leaf TEXT,
        pot TEXT,
        featured INTEGER DEFAULT 0,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      )
    `);

    // Insert categories
    const categories = ['Succulent', 'Fern', 'Flowering', 'Foliage', 'Trailing'];
    const catMap = {};
    let id = 1;
    for (const cat of categories) {
      db.run('INSERT INTO categories (id, name) VALUES (?, ?)', [id, cat]);
      catMap[cat] = id;
      id++;
    }

    // Insert sample products
    const products = [
      {
        name: 'Snake Plant',
        latin: 'Sansevieria trifasciata',
        category: 'Foliage',
        price: 449,
        description: 'Nearly indestructible houseplant. Grows in any light, thrives on neglect. Perfect for beginners.',
        light: 'Low to bright indirect light',
        water: 'Every 2-3 weeks',
        size: '12-24 inches',
        shape: 'tall',
        leaf: '#9fe2b4',
        pot: '#f4d35e',
        featured: 1
      },
      {
        name: 'Pothos',
        latin: 'Epipremnum aureum',
        category: 'Trailing',
        price: 399,
        description: 'Vigorous vining plant. Cascades beautifully from shelves. One of the easiest houseplants.',
        light: 'Low to bright indirect light',
        water: 'When top soil is dry',
        size: 'Vines 3-6 feet',
        shape: 'trailing',
        leaf: '#c8f169',
        pot: '#ffffff',
        featured: 1
      },
      {
        name: 'Spider Plant',
        latin: 'Chlorophytum comosum',
        category: 'Foliage',
        price: 349,
        description: 'Produces dangling babies. Extremely forgiving. Great for hanging baskets.',
        light: 'Bright indirect light',
        water: 'Every 1-2 weeks',
        size: '12-18 inches',
        shape: 'paddle',
        leaf: '#c8f169',
        pot: '#ffd9e0',
        featured: 1
      },
      {
        name: 'ZZ Plant',
        latin: 'Zamioculcas zamiifolia',
        category: 'Foliage',
        price: 599,
        description: 'Glossy leaflets. Drought tolerant. Adds structure to any space.',
        light: 'Low to bright indirect light',
        water: 'Every 2-3 weeks',
        size: '12-24 inches',
        shape: 'tall',
        leaf: '#9fe2b4',
        pot: '#f4d35e',
        featured: 0
      },
      {
        name: 'Monstera Deliciosa',
        latin: 'Monstera deliciosa',
        category: 'Foliage',
        price: 899,
        description: 'Statement plant with split leaves. Grows tall and dramatic over time.',
        light: 'Bright indirect light',
        water: 'When top soil is dry',
        size: '24-36 inches',
        shape: 'tall',
        leaf: '#9fe2b4',
        pot: '#f4d35e',
        featured: 1
      },
      {
        name: 'Jade Plant',
        latin: 'Crassula ovata',
        category: 'Succulent',
        price: 449,
        description: 'Succulent with thick leaves. Nearly impossible to kill. Grows slowly and steadily.',
        light: 'Bright indirect light',
        water: 'Every 2-3 weeks',
        size: '12-18 inches',
        shape: 'paddle',
        leaf: '#c8f169',
        pot: '#ffd9e0',
        featured: 0
      },
      {
        name: 'Boston Fern',
        latin: 'Nephrolepis exaltata',
        category: 'Fern',
        price: 499,
        description: 'Lush and feathery. Loves humidity. Keep soil consistently moist.',
        light: 'Bright indirect light',
        water: 'Keep moist, not wet',
        size: '18-24 inches',
        shape: 'paddle',
        leaf: '#9fe2b4',
        pot: '#f4d35e',
        featured: 0
      },
      {
        name: 'Philodendron',
        latin: 'Philodendron hederaceum',
        category: 'Trailing',
        price: 449,
        description: 'Heart-shaped leaves. Vines gracefully. Adapts to various light conditions.',
        light: 'Low to bright indirect light',
        water: 'When top soil is dry',
        size: 'Vines 2-4 feet',
        shape: 'trailing',
        leaf: '#c8f169',
        pot: '#ffffff',
        featured: 0
      },
      {
        name: 'Echeveria',
        latin: 'Echeveria elegans',
        category: 'Succulent',
        price: 299,
        description: 'Rosette-shaped succulent. Beautiful blooms in spring. Minimal watering.',
        light: 'Bright light',
        water: 'Every 2-3 weeks',
        size: '4-6 inches',
        shape: 'paddle',
        leaf: '#c8f169',
        pot: '#ffd9e0',
        featured: 0
      },
      {
        name: 'Orchid',
        latin: 'Phalaenopsis amabilis',
        category: 'Flowering',
        price: 1299,
        description: 'Elegant blooms that last months. Easier than most orchids. Room temperature is fine.',
        light: 'Bright indirect light',
        water: 'Once a week',
        size: '12-18 inches',
        shape: 'tall',
        leaf: '#9fe2b4',
        pot: '#f4d35e',
        featured: 1
      }
    ];

    let productId = 1;
    for (const product of products) {
      db.run(
        `INSERT INTO products (id, name, latin, category_id, price, description, light, water, size, shape, leaf, pot, featured)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          productId,
          product.name,
          product.latin,
          catMap[product.category],
          product.price,
          product.description,
          product.light,
          product.water,
          product.size,
          product.shape,
          product.leaf,
          product.pot,
          product.featured
        ]
      );
      productId++;
    }

    // Save database
    saveDatabase();
    console.log('Database initialized with sample data');
  }
}

function saveDatabase() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

function queryToObjects(query) {
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
    console.error('Query error:', err, 'Query:', query);
    return [];
  }
}

// API Routes

// Get all categories
app.get('/api/categories', (req, res) => {
  try {
    const categories = queryToObjects('SELECT name FROM categories ORDER BY name')
      .map(r => r.name);
    res.json(categories);
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get products with filtering and sorting
app.get('/api/products', (req, res) => {
  try {
    const { category, q, sort, featured } = req.query;
    
    let sql = `
      SELECT p.* FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE 1=1
    `;

    // Filter by featured
    if (featured === '1') {
      sql += ' AND p.featured = 1';
    }

    // Filter by category
    if (category && category !== 'All') {
      sql += ` AND c.name = '${category.replace(/'/g, "''")}'`;
    }

    // Filter by search query
    if (q) {
      const searchTerm = q.replace(/'/g, "''");
      sql += ` AND (p.name LIKE '%${searchTerm}%' OR p.latin LIKE '%${searchTerm}%' OR p.description LIKE '%${searchTerm}%')`;
    }

    // Sort
    if (sort === 'price-asc') {
      sql += ' ORDER BY p.price ASC';
    } else if (sort === 'price-desc') {
      sql += ' ORDER BY p.price DESC';
    } else if (sort === 'name') {
      sql += ' ORDER BY p.name ASC';
    } else {
      sql += ' ORDER BY p.featured DESC, p.name ASC';
    }

    const rows = queryToObjects(sql);
    res.json(rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product by ID
app.get('/api/products/:id', (req, res) => {
  try {
    const { id } = req.params;
    const products = queryToObjects(`SELECT * FROM products WHERE id = ${id}`);
    
    if (!products.length) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(products[0]);
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
await initializeDatabase();
app.listen(PORT, () => {
  console.log(`🌱 Sprout Room server running on http://localhost:${PORT}`);
  console.log(`API available at http://localhost:${PORT}/api`);
});
