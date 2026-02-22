import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

console.log('=== ANOS COM DADOS NO BANCO ===\n');

const [years] = await connection.execute(`
  SELECT YEAR(date) as year, COUNT(*) as count 
  FROM exam_history 
  GROUP BY YEAR(date) 
  ORDER BY year DESC
`);

years.forEach(row => {
  console.log(`${row.year}: ${row.count} exames`);
});

console.log('\n=== TOTAL ===');
const [total] = await connection.execute('SELECT COUNT(*) as total FROM exam_history');
console.log(`Total de exames: ${total[0].total}`);

await connection.end();
