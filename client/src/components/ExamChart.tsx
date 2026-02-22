import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useMemo } from 'react';
import { useCurrentPatient } from '@/hooks/useCurrentPatient';
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell } from 'recharts';
import { FutureProjectionChart } from './FutureProjectionChart';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface ExamDataPoint {
  date: string | Date;
  value: string | number;
  referenceMin?: string | number | null;
  referenceMax?: string | number | null;
  status?: string;
}

interface ExamChartProps {
  data: ExamDataPoint[];
  examName: string;
  unit: string;
  referenceMin?: number;
  referenceMax?: number;
}

export function ExamChart({ data, examName, unit }: ExamChartProps) {
  const [showCorrelations, setShowCorrelations] = useState(false);
  const { patientId } = useCurrentPatient();

  // Buscar dados antropométricos do banco
  const { data: anthropometricData } = trpc.patients.getAnthropometricData.useQuery(
    {
      patientId: patientId!
    },
    {
      enabled: !!patientId,
    }
  );

  // Preparar dados para o gráfico
  const chartData = useMemo(() => {
    return data
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(point => {
        const value = typeof point.value === 'number' ? point.value : parseFloat(String(point.value));
        const refMin = point.referenceMin ? parseFloat(String(point.referenceMin)) : null;
        const refMax = point.referenceMax ? parseFloat(String(point.referenceMax)) : null;
        
        return {
          date: new Date(point.date).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
          fullDate: point.date,
          value: isNaN(value) ? 0 : value,
          referenceMin: refMin,
          referenceMax: refMax,
          referenceRange: refMin !== null && refMax !== null ? refMax - refMin : 0,
          referenceBase: refMin || 0,
          status: point.status || 'normal'
        };
      });
  }, [data]);

  // Encontrar valores mín/máx para ajustar o eixo Y
  const yAxisDomain = useMemo(() => {
    const allValues = chartData.flatMap(d => [
      d.value,
      d.referenceMin || 0,
      d.referenceMax || 0
    ]).filter(v => v !== null && !isNaN(v as number));
    
    if (allValues.length === 0) return [0, 100];
    
    const min = Math.min(...allValues as number[]);
    const max = Math.max(...allValues as number[]);
    const range = max - min;
    const padding = Math.max(range * 0.2, 5);
    
    const minDomain = min < range * 0.1 ? 0 : Math.max(0, min - padding);
    
    return [minDomain, max + padding];
  }, [chartData]);

  const lineColor = '#10b981';

  const getValueBarColor = (status: string) => {
    switch (status) {
      case 'high':
        return '#ef4444';
      case 'low':
        return '#f59e0b';
      case 'normal':
      default:
        return '#10b981';
    }
  };

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500">
        Nenhum dado disponível para este exame
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Botões de ação */}
      <div className="flex gap-3 justify-center flex-wrap">
        <Button
          onClick={() => setShowCorrelations(!showCorrelations)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
        >
          {showCorrelations ? '✓ Correlações' : '🔗 Ver Correlações'}
        </Button>
      </div>

      {/* Gráfico de Evolução */}
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12, fill: '#64748b' }}
            stroke="#cbd5e1"
          />
          
          <YAxis 
            domain={yAxisDomain}
            tick={{ fontSize: 12, fill: '#64748b' }}
            stroke="#cbd5e1"
            label={{ 
              value: unit, 
              angle: -90, 
              position: 'insideLeft',
              style: { fontSize: 12, fill: '#64748b' }
            }}
          />
          
          <Tooltip 
            contentStyle={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '12px'
            }}
            formatter={(value: any) => `${value} ${unit}`}
            labelFormatter={(label) => `Data: ${label}`}
          />
          
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
          
          <Bar 
            dataKey="referenceBase" 
            fill="transparent" 
            stackId="stack"
          />
          <Bar 
            dataKey="referenceRange" 
            fill="#c7d2fe" 
            opacity={0.7}
            name="Faixa de Referência"
            stackId="stack"
            radius={[4, 4, 0, 0]}
            barSize={60}
          />
          
          <Bar 
            dataKey="value" 
            name={examName}
            radius={[4, 4, 4, 4]}
            barSize={40}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getValueBarColor(entry.status)} />
            ))}
          </Bar>
          
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={lineColor}
            strokeWidth={3}
            dot={{ fill: lineColor, r: 5 }}
            activeDot={{ r: 7 }}
            name="Evolução"
          />
          
          {chartData[0]?.referenceMin !== null && (
            <ReferenceLine 
              y={chartData[0].referenceMin} 
              stroke="#f59e0b" 
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{ 
                value: 'Mín', 
                position: 'right', 
                fill: '#f59e0b',
                fontSize: 12,
                fontWeight: 'bold'
              }}
            />
          )}
          
          {chartData[0]?.referenceMax !== null && (
            <ReferenceLine 
              y={chartData[0].referenceMax} 
              stroke="#f59e0b" 
              strokeDasharray="5 5"
              strokeWidth={2}
              label={{ 
                value: 'Máx', 
                position: 'right', 
                fill: '#f59e0b',
                fontSize: 12,
                fontWeight: 'bold'
              }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
      
      {/* Legenda de cores */}
      <div className="flex flex-wrap gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500"></div>
          <span className="text-slate-600">Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-500"></div>
          <span className="text-slate-600">Baixo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500"></div>
          <span className="text-slate-600">Alto</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-indigo-200"></div>
          <span className="text-slate-600">Faixa de Referência</span>
        </div>
      </div>

      {/* Seção de Correlações */}
      {showCorrelations && (
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
          <h3 className="text-lg font-bold mb-4 text-indigo-900">Análise de Correlações</h3>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-indigo-200">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-900">Correlações Disponíveis</p>
                  <p className="text-sm text-slate-600 mt-1">
                    Este exame pode ser correlacionado com outros para análise mais profunda. 
                    Selecione exames relacionados para visualizar insights médicos.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-indigo-200">
              <p className="text-sm text-slate-700">
                <strong>Exames relacionados:</strong> Colesterol, Triglicerídeos, Glicose, Peso, IMC
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  💡 <strong>Dica:</strong> Correlações são mais precisas quando os exames são realizados no mesmo período (mesma semana ou mês).
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Projeção Futura */}
      <div className="mt-8">
        <FutureProjectionChart
          examName={examName}
          currentValue={chartData[chartData.length - 1]?.value || 0}
          referenceMin={chartData[0]?.referenceMin || 0}
          referenceMax={chartData[0]?.referenceMax || 100}
          unit={unit}
          historicalData={chartData.map(d => ({
            date: d.date,
            value: d.value
          }))}
          anthropometricData={anthropometricData ? {
            weight: anthropometricData.weight || 107,
            bmi: anthropometricData.bmi || 32.3,
            waist: anthropometricData.waist || 111
          } : {
            weight: 107,
            bmi: 32.3,
            waist: 111
          }}
        />
      </div>
    </div>
  );
}
