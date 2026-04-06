import { createClient } from '@libsql/client';

let _client = null;

export function getTursoClient() {
    if (_client) return _client;

    const url = import.meta.env.VITE_TURSO_DB_URL;
    const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

    if (!url || !authToken) {
        console.error(
            '[Turso] Missing VITE_TURSO_DB_URL or VITE_TURSO_AUTH_TOKEN in .env'
        );
        return null;
    }

    _client = createClient({ url, authToken });
    return _client;
}

/**
 * Execute a SQL query with optional args.
 * @param {string} sql
 * @param {any[]} args
 * @returns {Promise<import('@libsql/client').ResultSet | null>}
 */
export async function query(sql, args = []) {
    const client = getTursoClient();
    if (!client) return null;
    try {
        const result = await client.execute({ sql, args });
        return result;
    } catch (err) {
        console.error('[Turso] Query error:', sql, err);
        throw err;
    }
}
