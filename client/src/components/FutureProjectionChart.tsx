import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
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

  // Calcular tendência dos últimos 3 meses
  const last3Months = historicalData.slice(-3);
  const trend = last3Months.length >= 2
    ? (last3Months[last3Months.length - 1].value - last3Months[0].value) / (last3Months.length - 1)
    : 0;

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
      });
    });

    // Gerar 8 pontos de projeção (3 em 3 meses por 2 anos)
    for (let i = 1; i <= 8; i++) {
      const futureDate = new Date(today);
      futureDate.setMonth(futureDate.getMonth() + i * 3);
      const monthsAhead = i * 3;

      // Cenários de projeção
      const otimista = currentValue - (Math.abs(trend) * monthsAhead * 0.5); // Melhora 50% mais rápido
      const manutenção = currentValue + (trend * monthsAhead); // Mantém tendência atual
      const pessimista = currentValue + (Math.abs(trend) * monthsAhead * 1.5); // Piora 50% mais rápido

      projectionData.push({
        date: futureDate.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
        value: null,
        actual: null,
        otimista: Math.max(0, otimista),
        manutenção: Math.max(0, manutenção),
        pessimista: Math.max(0, pessimista),
      });
    }

    return projectionData;
  };

  const projectionData = showProjection ? generateProjection() : [];

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
              <strong>Tendência Atual:</strong> {trend > 0 ? '📈 Aumentando' : trend < 0 ? '📉 Diminuindo' : '➡️ Estável'} ({Math.abs(trend).toFixed(2)} {unit}/mês)
            </p>
            <p className="text-slate-600">
              Baseado nos últimos 3 meses de dados. As projeções mostram 3 cenários possíveis:
            </p>
            <ul className="space-y-1 ml-4">
              <li className="text-green-700">🟢 <strong>Otimista:</strong> Melhora 50% mais rápido que a tendência</li>
              <li className="text-yellow-700">🟡 <strong>Manutenção:</strong> Continua com a tendência atual</li>
              <li className="text-red-700">🔴 <strong>Pessimista:</strong> Piora 50% mais rápido que a tendência</li>
            </ul>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip
                formatter={(value) => typeof value === 'number' ? `${value.toFixed(2)} ${unit}` : '-'}
                labelFormatter={(label) => `Data: ${label}`}
              />
              <Legend />
              <ReferenceLine
                y={referenceMin}
                stroke="#ff6b6b"
                strokeDasharray="5 5"
                label={{ value: `Mín: ${referenceMin}`, position: 'right', fill: '#ff6b6b', fontSize: 12 }}
              />
              <ReferenceLine
                y={referenceMax}
                stroke="#ff6b6b"
                strokeDasharray="5 5"
                label={{ value: `Máx: ${referenceMax}`, position: 'right', fill: '#ff6b6b', fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#000"
                name="Histórico"
                connectNulls
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="otimista"
                stroke="#22c55e"
                name="Otimista"
                strokeDasharray="5 5"
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="manutenção"
                stroke="#eab308"
                name="Manutenção"
                strokeDasharray="5 5"
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="pessimista"
                stroke="#ef4444"
                name="Pessimista"
                strokeDasharray="5 5"
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      )}
    </div>
  );
}
