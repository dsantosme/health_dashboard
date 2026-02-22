import { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ComposedChart } from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp } from 'lucide-react';

interface FutureProjectionChartProps {
  examName: string;
  currentValue: number;
  referenceMin: number;
  referenceMax: number;
  unit: string;
  historicalData: Array<{ date: string; value: number }>;
  anthropometricData?: {
    weight: number;
    bmi: number;
    waist: number;
  };
  showAnthropometricData?: boolean;
}

export function FutureProjectionChart({
  examName,
  currentValue,
  referenceMin,
  referenceMax,
  unit,
  historicalData,
  anthropometricData,
  showAnthropometricData = true,
}: FutureProjectionChartProps) {
  const [showProjection, setShowProjection] = useState(false);

  // Calcular tendência usando regressão linear (todos os dados históricos)
  const calculateTrend = () => {
    if (historicalData.length < 2) return 0;

    const n = historicalData.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

    historicalData.forEach((item, index) => {
      sumX += index;
      sumY += item.value;
      sumXY += index * item.value;
      sumX2 += index * index;
    });

    // Regressão linear: y = a + bx
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope / historicalData.length; // Normalizar para por ponto
  };

  const trend = calculateTrend();

  // Calcular correlação entre peso e valor do exame
  const getWeightExamCorrelation = () => {
    const examNameLower = examName.toLowerCase();
    
    // Correlações conhecidas entre peso e exames
    const correlations: Record<string, { impactPerKg: number; description: string }> = {
      'glicose': { impactPerKg: -3, description: 'Cada kg perdido reduz glicose ~3 mg/dL' },
      'glicose jejum': { impactPerKg: -3, description: 'Cada kg perdido reduz glicose ~3 mg/dL' },
      'colesterol total': { impactPerKg: -2, description: 'Cada kg perdido reduz colesterol ~2 mg/dL' },
      'colesterol ldl': { impactPerKg: -1.5, description: 'Cada kg perdido reduz LDL ~1.5 mg/dL' },
      'colesterol hdl': { impactPerKg: 0.5, description: 'Cada kg perdido aumenta HDL ~0.5 mg/dL' },
      'triglicerideos': { impactPerKg: -4, description: 'Cada kg perdido reduz triglicerídeos ~4 mg/dL' },
      'pressão sistólica': { impactPerKg: -1, description: 'Cada kg perdido reduz pressão ~1 mmHg' },
      'imc': { impactPerKg: -0.3, description: 'Cada kg perdido reduz IMC ~0.3 pontos' },
    };
    
    for (const [key, value] of Object.entries(correlations)) {
      if (examNameLower.includes(key)) {
        return value;
      }
    }
    
    return null;
  };

  const weightCorrelation = getWeightExamCorrelation();


  // Gerar projeção para 24 meses (3 em 3 meses) com correlação antropométrica
  const generateProjection = () => {
    const projectionData = [];
    const today = new Date();

    // Adicionar dados históricos
    historicalData.forEach(item => {
      projectionData.push({
        date: item.date,
        value: item.value,
        actual: item.value,
        otimista: null,
        manutenção: null,
        pessimista: null,
        referenceMin: referenceMin,
        referenceMax: referenceMax,
        weight: null,
        bmi: null,
        waist: null,
      });
    });

    // Gerar 8 pontos de projeção (3 em 3 meses por 2 anos)
    for (let i = 1; i <= 8; i++) {
      const futureDate = new Date(today);
      futureDate.setMonth(futureDate.getMonth() + i * 3);
      const monthsAhead = i * 3;

      // Cenários de projeção com progressão real
      // Otimista: melhora 2x mais rápido que a tendência
      const otimista = currentValue - (Math.abs(trend) * monthsAhead * 2);
      
      // Manutenção: mantém tendência atual
      const manutenção = currentValue + (trend * monthsAhead);
      
      // Pessimista: piora 2x mais rápido que a tendência
      const pessimista = currentValue + (Math.abs(trend) * monthsAhead * 2);

      // Correlacionar com dados antropométricos (se disponível)
      let projectedWeight = null;
      let projectedBmi = null;
      let projectedWaist = null;

      if (anthropometricData) {
        // Cenário otimista: reduz 0.5kg a cada 3 meses
        // Cenário manutenção: sem mudança
        // Cenário pessimista: aumenta 0.5kg a cada 3 meses
        const weightChange = i * 0.5;
        projectedWeight = {
          otimista: Math.max(40, anthropometricData.weight - weightChange),
          manutenção: anthropometricData.weight,
          pessimista: anthropometricData.weight + weightChange,
        };
      }

      projectionData.push({
        date: futureDate.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        value: null,
        actual: null,
        otimista: Math.max(0, otimista),
        manutenção: Math.max(0, manutenção),
        pessimista: Math.max(0, pessimista),
        referenceMin: referenceMin,
        referenceMax: referenceMax,
        weight: projectedWeight,
        bmi: projectedBmi,
        waist: projectedWaist,
      });
    }

    return projectionData;
  };

  const projectionData = showProjection ? generateProjection() : [];

  // Calcular intervalo Y para melhor visualização
  const allValues = projectionData.flatMap(d => [
    d.otimista,
    d.manutenção,
    d.pessimista,
    referenceMin,
    referenceMax,
  ]).filter(v => v !== null && v !== undefined && typeof v === 'number' && isFinite(v));

  const minValue = allValues.length > 0 ? Math.min(...(allValues as number[])) : 0;
  const maxValue = allValues.length > 0 ? Math.max(...(allValues as number[])) : 100;
  const range = maxValue - minValue;
  const padding = Math.max(range * 0.1, 5); // Mínimo 5 unidades de padding

  // Custom tooltip para mostrar dados antropométricos
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-slate-300 rounded shadow-lg text-xs">
          <p className="font-semibold text-slate-900">{data.date}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? entry.value.toFixed(2) : '-'} {unit}
            </p>
          ))}
          {data.weight && (
            <div className="mt-2 pt-2 border-t border-slate-200">
              <p className="text-slate-600">
                <strong>Peso Projetado:</strong>
              </p>
              <p className="text-green-700">Otimista: {data.weight.otimista.toFixed(1)} kg</p>
              <p className="text-yellow-700">Manutenção: {data.weight.manutenção.toFixed(1)} kg</p>
              <p className="text-red-700">Pessimista: {data.weight.pessimista.toFixed(1)} kg</p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Projeção Futura (24 meses)
        </h3>
        <Button
          variant={showProjection ? 'default' : 'outline'}
          size="sm"
          onClick={() => setShowProjection(!showProjection)}
        >
          {showProjection ? 'Ocultar Projeção' : 'Ver Projeção'}
        </Button>
      </div>

      {showProjection && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="mb-4 space-y-2 text-sm">
            <p className="text-slate-700">
              <strong>Tendência Atual:</strong> {trend > 0 ? '📈 Aumentando' : trend < 0 ? '📉 Diminuindo' : '➡️ Estável'} ({Math.abs(trend).toFixed(3)} {unit}/mês)
            </p>
            <p className="text-slate-600">
              Baseado em {historicalData.length} medições históricas. As projeções mostram 3 cenários possíveis:
            </p>
            <ul className="space-y-1 ml-4">
              <li className="text-green-700">🟢 <strong>Otimista:</strong> Melhora 2x mais rápido que a tendência {anthropometricData ? '(redução de peso)' : ''}</li>
              <li className="text-yellow-700">🟡 <strong>Manutenção:</strong> Continua com a tendência atual {anthropometricData ? '(peso estável)' : ''}</li>
              <li className="text-red-700">🔴 <strong>Pessimista:</strong> Piora 2x mais rápido que a tendência {anthropometricData ? '(aumento de peso)' : ''}</li>
            </ul>
            
            {showAnthropometricData && anthropometricData && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-slate-700 font-semibold mb-2">📊 Dados Antropométricos Atuais:</p>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="bg-white rounded p-2">
                    <p className="text-slate-600">Peso</p>
                    <p className="font-bold text-slate-900">{anthropometricData.weight.toFixed(1)} kg</p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <p className="text-slate-600">IMC</p>
                    <p className="font-bold text-slate-900">{anthropometricData.bmi.toFixed(1)}</p>
                  </div>
                  <div className="bg-white rounded p-2">
                    <p className="text-slate-600">Cintura</p>
                    <p className="font-bold text-slate-900">{anthropometricData.waist} cm</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <ResponsiveContainer width="100%" height={400}>
            <ComposedChart data={projectionData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                angle={-45} 
                textAnchor="end" 
                height={100}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[Math.max(0, minValue - padding), maxValue + padding]}
                label={{ value: unit, angle: -90, position: 'insideLeft', offset: 10 }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                domain={[40, 120]}
                label={{ value: 'Peso (kg)', angle: 90, position: 'insideRight', offset: -10 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />

              {/* Barras de valores históricos e projeção */}
              <Bar 
                dataKey="actual" 
                fill="#1f2937" 
                name="Histórico"
                radius={[4, 4, 0, 0]}
                isAnimationActive={false}
              />

              {/* Linhas de projeção com interpolação suave */}
              <Line
                type="monotone"
                dataKey="otimista"
                stroke="#22c55e"
                name="Otimista"
                strokeDasharray="5 5"
                connectNulls
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#22c55e' }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="manutenção"
                stroke="#eab308"
                name="Manutenção"
                strokeDasharray="5 5"
                connectNulls
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#eab308' }}
                isAnimationActive={false}
              />
              <Line
                type="monotone"
                dataKey="pessimista"
                stroke="#ef4444"
                name="Pessimista"
                strokeDasharray="5 5"
                connectNulls
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#ef4444' }}
                isAnimationActive={false}
              />


              {/* Barras de peso projetado (eixo Y secundário) */}
              {anthropometricData && (
                <>
                  <Bar 
                    yAxisId="right"
                    dataKey="weight.otimista" 
                    fill="#22c55e" 
                    name="Peso Otimista"
                    opacity={0.3}
                    isAnimationActive={false}
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="weight.manutenção" 
                    fill="#eab308" 
                    name="Peso Manutenção"
                    opacity={0.3}
                    isAnimationActive={false}
                  />
                  <Bar 
                    yAxisId="right"
                    dataKey="weight.pessimista" 
                    fill="#ef4444" 
                    name="Peso Pessimista"
                    opacity={0.3}
                    isAnimationActive={false}
                  />
                </>
              )}

              {/* Linhas de referência */}
              <ReferenceLine
                y={referenceMin}
                stroke="#ff6b6b"
                strokeDasharray="5 5"
                label={{ value: `Mín: ${referenceMin}`, position: 'right', fill: '#ff6b6b', fontSize: 11 }}
              />
              <ReferenceLine
                y={referenceMax}
                stroke="#ff6b6b"
                strokeDasharray="5 5"
                label={{ value: `Máx: ${referenceMax}`, position: 'right', fill: '#ff6b6b', fontSize: 11 }}
              />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Interpretação dos cenários com dados antropométricos */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <p className="font-semibold text-green-900">Cenário Otimista</p>
              <p className="text-green-700 mt-1">Melhora consistente com mudanças de hábitos positivos</p>
              {anthropometricData && (
                <p className="text-green-600 mt-2 text-xs">
                  Peso: {(anthropometricData.weight - 4).toFixed(1)} kg
                </p>
              )}
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="font-semibold text-yellow-900">Manutenção</p>
              <p className="text-yellow-700 mt-1">Mantém a tendência atual sem mudanças significativas</p>
              {anthropometricData && (
                <p className="text-yellow-600 mt-2 text-xs">
                  Peso: {anthropometricData.weight.toFixed(1)} kg
                </p>
              )}
            </div>
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <p className="font-semibold text-red-900">Cenário Pessimista</p>
              <p className="text-red-700 mt-1">Piora sem intervenção ou com hábitos prejudiciais</p>
              {anthropometricData && (
                <p className="text-red-600 mt-2 text-xs">
                  Peso: {(anthropometricData.weight + 4).toFixed(1)} kg
                </p>
              )}
            </div>
          </div>

          {/* Insights de correlação entre peso e exame */}
          {weightCorrelation && anthropometricData && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="font-semibold text-blue-900 mb-2">💡 Insights de Correlação</p>
              <p className="text-blue-700 text-xs">
                {weightCorrelation.description}
              </p>
              <div className="mt-2 pt-2 border-t border-blue-200 text-xs">
                <p className="text-blue-600">
                  <strong>Impacto Estimado:</strong>
                </p>
                <p className="text-green-700 mt-1">
                  Cenário Otimista: {(currentValue + (weightCorrelation.impactPerKg * 4)).toFixed(1)} {unit} (perda de 4kg)
                </p>
                <p className="text-yellow-700">
                  Manutenção: {currentValue.toFixed(1)} {unit} (sem mudança)
                </p>
                <p className="text-red-700">
                  Cenário Pessimista: {(currentValue - (weightCorrelation.impactPerKg * 4)).toFixed(1)} {unit} (ganho de 4kg)
                </p>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
