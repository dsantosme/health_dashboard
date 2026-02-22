/**
 * Modelo realista de progressão de peso baseado em estudos médicos
 * 
 * Referências:
 * - Déficit calórico: 7700 kcal = 1kg de peso corporal
 * - Perda de peso saudável: 0.5-1kg por semana (2-4kg/mês)
 * - Ganho de peso: 0.5-1kg por semana em excesso calórico
 * - IMC ideal: 22 (referência de peso saudável)
 */

export interface WeightProjectionParams {
  currentWeight: number;
  currentHeight: number; // em cm
  age: number;
  scenario: 'otimista' | 'manutenção' | 'pessimista';
  monthsAhead: number;
}

export interface WeightProjection {
  weight: number;
  bmi: number;
}

/**
 * Calcular IMC (Índice de Massa Corporal)
 */
function calculateBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return weight / (heightM * heightM);
}

/**
 * Calcular peso ideal baseado em altura
 * Usa IMC ideal de 22 como referência de peso saudável
 */
function calculateIdealWeight(heightCm: number): number {
  const idealBMI = 22;
  const heightM = heightCm / 100;
  return idealBMI * (heightM * heightM);
}

/**
 * Calcular progressão realista de peso
 * 
 * Cenário Otimista:
 * - Fase 1 (0-6 meses): 4kg/trimestre (déficit calórico agressivo mas sustentável)
 * - Fase 2 (6-12 meses): 2.5kg/trimestre (fator de redução gradual)
 * - Fase 3 (12-24 meses): 1.5kg/trimestre (aproximando do peso ideal)
 * - Para quando atinge peso ideal
 * 
 * Cenário Manutenção:
 * - Peso estável, sem mudanças
 * 
 * Cenário Pessimista:
 * - Fase 1 (0-6 meses): 6kg/trimestre (excesso calórico rápido)
 * - Fase 2 (6-12 meses): 4kg/trimestre (ganho moderado)
 * - Fase 3 (12-24 meses): 2kg/trimestre (platô de ganho)
 */
export function calculateWeightProjection(params: WeightProjectionParams): WeightProjection {
  const { currentWeight, currentHeight, age, scenario, monthsAhead } = params;
  
  const idealWeight = calculateIdealWeight(currentHeight);
  
  let projectedWeight = currentWeight;
  
  if (scenario === 'otimista') {
    // Progressão otimista: perda de peso realista com fator de redução
    const quarters = Math.ceil(monthsAhead / 3);
    
    for (let q = 1; q <= quarters; q++) {
      let quarterlyLoss = 0;
      
      if (q <= 2) {
        // Primeiros 6 meses: perda agressiva (4kg/trimestre)
        quarterlyLoss = 4;
      } else if (q <= 4) {
        // Próximos 6 meses: perda moderada (2.5kg/trimestre)
        quarterlyLoss = 2.5;
      } else {
        // Últimos 12 meses: perda lenta (1.5kg/trimestre)
        quarterlyLoss = 1.5;
      }
      
      // Parar quando atingir peso ideal
      if (projectedWeight - quarterlyLoss < idealWeight) {
        projectedWeight = idealWeight;
        break;
      }
      
      projectedWeight -= quarterlyLoss;
    }
  } else if (scenario === 'manutenção') {
    // Manutenção: peso estável
    projectedWeight = currentWeight;
  } else if (scenario === 'pessimista') {
    // Progressão pessimista: ganho de peso com fator de redução
    const quarters = Math.ceil(monthsAhead / 3);
    
    for (let q = 1; q <= quarters; q++) {
      let quarterlyGain = 0;
      
      if (q <= 2) {
        // Primeiros 6 meses: ganho rápido (6kg/trimestre)
        quarterlyGain = 6;
      } else if (q <= 4) {
        // Próximos 6 meses: ganho moderado (4kg/trimestre)
        quarterlyGain = 4;
      } else {
        // Últimos 12 meses: ganho lento (2kg/trimestre - platô)
        quarterlyGain = 2;
      }
      
      projectedWeight += quarterlyGain;
    }
  }
  
  const projectedBMI = calculateBMI(projectedWeight, currentHeight);
  
  return {
    weight: Math.round(projectedWeight * 10) / 10, // Arredondar para 1 casa decimal
    bmi: Math.round(projectedBMI * 10) / 10,
  };
}

/**
 * Obter descrição do cenário de peso
 */
export function getWeightScenarioDescription(
  scenario: 'otimista' | 'manutenção' | 'pessimista',
  currentWeight: number,
  projectedWeight: number,
  idealWeight: number
): string {
  const weightChange = currentWeight - projectedWeight;
  const toIdeal = projectedWeight - idealWeight;
  
  if (scenario === 'otimista') {
    if (projectedWeight <= idealWeight) {
      return `Perda de ${Math.abs(weightChange).toFixed(1)}kg - Atinge peso ideal (${idealWeight.toFixed(1)}kg)`;
    }
    return `Perda de ${Math.abs(weightChange).toFixed(1)}kg - Aproxima do peso ideal`;
  } else if (scenario === 'manutenção') {
    return `Peso estável em ${currentWeight.toFixed(1)}kg`;
  } else {
    return `Ganho de ${Math.abs(weightChange).toFixed(1)}kg - Afasta do peso ideal`;
  }
}
