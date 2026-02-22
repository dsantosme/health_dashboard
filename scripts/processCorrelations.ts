import { processCorrelationsForDate } from '../server/correlationEngine';

async function main() {
  console.log('Processing correlations for Denis Santos (2026-02-14)...');
  
  try {
    await processCorrelationsForDate('denis-santos', '2026-02-14', 1);
    console.log('✅ Correlations processed successfully!');
  } catch (error) {
    console.error('❌ Error processing correlations:', error);
    process.exit(1);
  }
}

main();
