const mysql = require('mysql2/promise');
const fs = require('fs');

const XAMPP_SOCKET = '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock';

const mysqlConfig = {
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'JOB_AI',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Use Unix domain socket if running with XAMPP on macOS
if (fs.existsSync(XAMPP_SOCKET)) {
  mysqlConfig.socketPath = XAMPP_SOCKET;
} else {
  mysqlConfig.host = process.env.MYSQL_HOST || '127.0.0.1';
  mysqlConfig.port = Number(process.env.MYSQL_PORT) || 3306;
}

let pool = null;

const getMySQLPool = () => {
  if (!pool) {
    pool = mysql.createPool(mysqlConfig);
  }
  return pool;
};

const testMySQLConnection = async () => {
  try {
    const connection = await getMySQLPool().getConnection();
    const [rows] = await connection.query('SELECT DATABASE() AS db_name, VERSION() AS version');
    connection.release();
    console.log(`[Database] MySQL Connected: ${rows[0]?.db_name || 'JOB_AI'} (MariaDB/MySQL @ ${rows[0]?.version || 'latest'})`);
    return { connected: true, database: rows[0]?.db_name || 'JOB_AI', version: rows[0]?.version };
  } catch (err) {
    console.warn(`[Database] MySQL Notice: ${err.message}`);
    return { connected: false, error: err.message };
  }
};

module.exports = {
  getMySQLPool,
  testMySQLConnection,
};
