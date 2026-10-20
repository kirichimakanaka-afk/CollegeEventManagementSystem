const pool = require('./db');

async function testConnection() {
  try {
    const [rows] = await pool.query(
      'SELECT DATABASE() AS database_name, VERSION() AS mysql_version'
    );
    console.log('Database connected successfully:', rows[0]);
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

testConnection();