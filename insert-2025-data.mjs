import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import fs from 'fs';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Ler dados extraídos
const rawData = JSON.parse(fs.readFileSync('/home/ubuntu/extract_2025_exams.json', 'utf8'));

// Filtrar apenas arquivos processados com sucesso
const successfulResults = rawData.results.filter(r => 
  r.output && r.output.file_processed && r.output.exam_count > 0
);

console.log(`\n=== PROCESSAMENTO DE DADOS DE 2025 ===`);
console.log(`Arquivos processados com sucesso: ${successfulResults.length}`);

let totalExams = 0;
let insertedExams = 0;
let skippedExams = 0;
const examTypes = new Set();

for (const result of successfulResults) {
  try {
    const examsJson = result.output.exams_json;
    let exams;
    
    try {
      exams = JSON.parse(examsJson);
    } catch (e) {
      console.log(`⚠️  Erro ao parsear JSON de ${result.input}: ${e.message}`);
      continue;
    }
    
    if (!Array.isArray(exams)) {
      continue;
    }
    
    for (const exam of exams) {
      totalExams++;
      
      // Pular dados do paciente e dados administrativos
      if (exam.category === 'Dados do Paciente' || exam.category === 'Dados do Exame') {
        skippedExams++;
        continue;
      }
      
      // Pular exames sem valor numérico
      const numericValue = parseFloat(exam.value);
      if (isNaN(numericValue)) {
        skippedExams++;
        continue;
      }
      
      // Normalizar data
      let date = exam.date;
      if (date.includes('-')) {
        const parts = date.split('-');
        if (parts[0].length === 2) {
          // Formato DD-MM-YYYY
          date = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }
      
      // Normalizar valores de referência
      const refMin = exam.referenceMin && exam.referenceMin !== '' && exam.referenceMin !== 'N/A' 
        ? parseFloat(exam.referenceMin) 
        : null;
      const refMax = exam.referenceMax && exam.referenceMax !== '' && exam.referenceMax !== 'N/A'
        ? parseFloat(exam.referenceMax)
        : null;
      
      // Determinar status
      let status = 'normal';
      if (refMin !== null && numericValue < refMin) {
        status = 'low';
      } else if (refMax !== null && numericValue > refMax) {
        status = 'high';
      }
      
      // Se o status veio do extrator, usar ele
      if (exam.status && ['normal', 'low', 'high'].includes(exam.status)) {
        status = exam.status;
      }
      
      examTypes.add(exam.examName);
      
      // Inserir ou atualizar tipo de exame
      await connection.execute(`
        INSERT INTO exams (name, category, unit, referenceMin, referenceMax)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE
          category = VALUES(category),
          unit = VALUES(unit),
          referenceMin = COALESCE(VALUES(referenceMin), referenceMin),
          referenceMax = COALESCE(VALUES(referenceMax), referenceMax)
      `, [exam.examName, exam.category, exam.unit, refMin, refMax]);
      
      // Verificar se já existe registro
      const [existing] = await connection.execute(`
        SELECT id FROM exam_history 
        WHERE patientId = ? AND examName = ? AND date = ?
      `, ['john-doe', exam.examName, date]);
      
      if (existing.length === 0) {
        // Inserir histórico
        await connection.execute(`
          INSERT INTO exam_history (patientId, examName, date, value, status, sourceFile)
          VALUES (?, ?, ?, ?, ?, ?)
        `, ['john-doe', exam.examName, date, numericValue, status, result.input]);
        
        insertedExams++;
      } else {
        skippedExams++;
      }
    }
  } catch (error) {
    console.error(`Erro ao processar ${result.input}:`, error.message);
  }
}

console.log(`\n=== RESUMO ===`);
console.log(`Total de exames encontrados: ${totalExams}`);
console.log(`Exames inseridos no banco: ${insertedExams}`);
console.log(`Exames pulados (duplicados/inválidos): ${skippedExams}`);
console.log(`Tipos de exames únicos: ${examTypes.size}`);

// Verificar dados finais no banco
const [years] = await connection.execute(`
  SELECT YEAR(date) as year, COUNT(*) as count 
  FROM exam_history 
  GROUP BY YEAR(date) 
  ORDER BY year DESC
`);

console.log(`\n=== DADOS NO BANCO POR ANO ===`);
years.forEach(row => {
  console.log(`${row.year}: ${row.count} exames`);
});

await connection.end();
