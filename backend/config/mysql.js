const mysql = require('mysql2/promise');
const fs = require('fs');

const XAMPP_SOCKET = '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock';

// In cloud/production (Render, Vercel etc.) MySQL is optional.
// The app runs fully on MongoDB Atlas. MySQL only syncs when XAMPP is running locally.
const isMySQLConfigured = () => {
  const hasSocket = fs.existsSync(XAMPP_SOCKET);
  const hasHost = !!(process.env.MYSQL_HOST && process.env.MYSQL_HOST.trim());
  return hasSocket || hasHost;
};

const mysqlConfig = {
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'JOB_AI',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 5000,
};

// Use Unix domain socket if running with XAMPP on macOS
if (fs.existsSync(XAMPP_SOCKET)) {
  mysqlConfig.socketPath = XAMPP_SOCKET;
} else if (process.env.MYSQL_HOST && process.env.MYSQL_HOST.trim()) {
  mysqlConfig.host = process.env.MYSQL_HOST;
  mysqlConfig.port = Number(process.env.MYSQL_PORT) || 3306;
} else {
  // No MySQL configured — use a dummy localhost that will fail gracefully
  mysqlConfig.host = '127.0.0.1';
  mysqlConfig.port = 3306;
}

let pool = null;

const getMySQLPool = () => {
  if (!pool) {
    pool = mysql.createPool(mysqlConfig);
  }
  return pool;
};

const testMySQLConnection = async () => {
  if (!isMySQLConfigured() && process.env.NODE_ENV === 'production') {
    console.log('[Database] MySQL skipped in cloud production — running on MongoDB Atlas only.');
    return { connected: false, skipped: true };
  }
  try {
    const connection = await getMySQLPool().getConnection();
    const [rows] = await connection.query('SELECT DATABASE() AS db_name, VERSION() AS version');
    connection.release();
    console.log(`[Database] MySQL Connected: ${rows[0]?.db_name || 'JOB_AI'} (MariaDB/MySQL @ ${rows[0]?.version || 'latest'})`);
    return { connected: true, database: rows[0]?.db_name || 'JOB_AI', version: rows[0]?.version };
  } catch (err) {
    console.warn(`[Database] MySQL Notice: ${err.message} — continuing without MySQL sync.`);
    return { connected: false, error: err.message };
  }
};

module.exports = {
  getMySQLPool,
  testMySQLConnection,
  isMySQLConfigured,
};
