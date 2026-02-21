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
}

export function FutureProjectionChart({
  examName,
  currentValue,
  referenceMin,
  referenceMax,
  unit,
  historicalData,
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

  // Gerar projeção para 24 meses (3 em 3 meses)
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

      projectionData.push({
        date: futureDate.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        value: null,
        actual: null,
        otimista: Math.max(0, otimista),
        manutenção: Math.max(0, manutenção),
        pessimista: Math.max(0, pessimista),
        referenceMin: referenceMin,
        referenceMax: referenceMax,
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
  ]).filter(v => v !== null && v !== undefined);

  const minValue = Math.min(...allValues);
  const maxValue = Math.max(...allValues);
  const padding = (maxValue - minValue) * 0.1;

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
              <li className="text-green-700">🟢 <strong>Otimista:</strong> Melhora 2x mais rápido que a tendência</li>
              <li className="text-yellow-700">🟡 <strong>Manutenção:</strong> Continua com a tendência atual</li>
              <li className="text-red-700">🔴 <strong>Pessimista:</strong> Piora 2x mais rápido que a tendência</li>
            </ul>
          </div>

          <ResponsiveContainer width="100%" height={350}>
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
              <Tooltip
                formatter={(value) => typeof value === 'number' ? `${value.toFixed(2)} ${unit}` : '-'}
                labelFormatter={(label) => `Data: ${label}`}
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '4px' }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />

              {/* Faixa de Referência como área de fundo */}
              <Bar 
                dataKey="referenceMin" 
                fill="#e0e7ff" 
                opacity={0.3}
                name="Faixa de Referência"
                isAnimationActive={false}
              />

              {/* Linhas de projeção */}
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#000"
                name="Histórico"
                connectNulls
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="otimista"
                stroke="#22c55e"
                name="Otimista"
                strokeDasharray="5 5"
                connectNulls
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="manutenção"
                stroke="#eab308"
                name="Manutenção"
                strokeDasharray="5 5"
                connectNulls
                strokeWidth={2}
                dot={{ r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="pessimista"
                stroke="#ef4444"
                name="Pessimista"
                strokeDasharray="5 5"
                connectNulls
                strokeWidth={2}
                dot={{ r: 3 }}
              />

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

          {/* Interpretação dos cenários */}
          <div className="mt-6 grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-green-50 border border-green-200 rounded">
              <p className="font-semibold text-green-900">Cenário Otimista</p>
              <p className="text-green-700 mt-1">Melhora consistente com mudanças de hábitos positivos</p>
            </div>
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
              <p className="font-semibold text-yellow-900">Manutenção</p>
              <p className="text-yellow-700 mt-1">Mantém a tendência atual sem mudanças significativas</p>
            </div>
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <p className="font-semibold text-red-900">Cenário Pessimista</p>
              <p className="text-red-700 mt-1">Piora sem intervenção ou com hábitos prejudiciais</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
