const db = require('./config/database');

async function testConnection() {
  try {
    console.log('Testing database connection...');

    // 모든 테이블 조회
    const [tables] = await db.query('SHOW TABLES');
    console.log('\n✅ Available tables:');
    console.log(tables);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testConnection();
