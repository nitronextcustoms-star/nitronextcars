/**
 * NitroNext Customs — Turso DB Schema Initializer
 * Creates all tables if they don't exist. Call initDB() once on app startup.
 */
import { query } from './turso';

export async function initDB() {
    try {
        // Users table
        await query(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT,
        phone TEXT,
        address TEXT,
        user_type TEXT DEFAULT 'buyer',
        business_name TEXT,
        business_license TEXT,
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);

        // Cars table
        await query(`
      CREATE TABLE IF NOT EXISTS cars (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        seller_id TEXT NOT NULL,
        name TEXT NOT NULL,
        brand TEXT,
        model TEXT,
        year TEXT,
        price TEXT,
        color TEXT,
        engine TEXT,
        power TEXT,
        torque TEXT,
        transmission TEXT,
        fuel_type TEXT,
        mileage TEXT,
        seating TEXT,
        doors TEXT,
        drivetrain TEXT,
        condition TEXT DEFAULT 'excellent',
        accident_history TEXT DEFAULT 'no',
        owners TEXT DEFAULT '1',
        service_history TEXT DEFAULT 'full',
        registration_state TEXT,
        registration_year TEXT,
        modifications TEXT,
        features TEXT,
        description TEXT,
        location TEXT,
        negotiable INTEGER DEFAULT 1,
        available_test_drive INTEGER DEFAULT 1,
        stock_status TEXT DEFAULT 'available',
        images TEXT DEFAULT '[]',
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);

        // Parts table
        await query(`
      CREATE TABLE IF NOT EXISTS parts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        seller_id TEXT NOT NULL,
        name TEXT NOT NULL,
        category TEXT,
        description TEXT,
        price TEXT,
        stock INTEGER DEFAULT 0,
        compatible_brands TEXT,
        compatible_models TEXT,
        condition TEXT DEFAULT 'new',
        warranty TEXT,
        images TEXT DEFAULT '[]',
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);

        // Orders table
        await query(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id TEXT UNIQUE NOT NULL,
        user_email TEXT NOT NULL,
        items TEXT NOT NULL,
        billing_info TEXT NOT NULL,
        payment_method TEXT,
        subtotal REAL DEFAULT 0,
        tax REAL DEFAULT 0,
        shipping REAL DEFAULT 0,
        total REAL DEFAULT 0,
        status TEXT DEFAULT 'pending',
        created_at TEXT DEFAULT (datetime('now'))
      )
    `);

        console.log('[Turso] ✅ Database schema initialized.');
    } catch (err) {
        console.error('[Turso] ❌ Failed to initialize schema:', err);
    }
}
