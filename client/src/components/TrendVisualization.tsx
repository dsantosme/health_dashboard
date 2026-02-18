import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { historicalExamsData, trendsSummary } from '@/data/historicalExamsData';

export function TrendVisualization() {
  // Preparar dados para gráfico de tendências
  const trendData = historicalExamsData.map(exam => ({
    name: exam.name.split(' ')[0], // Primeiro nome para espaço
    trend: exam.trendValue || 0,
    direction: exam.trend
  }));

  // Preparar dados para gráfico de exames específicos
  const glucoseData = [
    { date: '06/01/2023', value: 91 },
    { date: '16/01/2024', value: 91 }
  ];

  const creatinineData = [
    { date: '06/01/2023', value: 1.16 },
    { date: '16/01/2024', value: 1.06 }
  ];

  const tshData = [
    { date: '06/01/2023', value: 1.72 },
    { date: '16/01/2024', value: 1.63 }
  ];

  return (
    <div className="space-y-6">
      {/* Resumo de Tendências */}
      <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
        <h3 className="text-lg font-semibold mb-4">📊 Resumo de Tendências (1 Ano)</h3>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{trendsSummary.total_exames_com_historico}</div>
            <div className="text-sm text-gray-600">Exames com histórico</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{trendsSummary.subindo}</div>
            </div>
            <div className="text-sm text-gray-600">Melhorando</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <TrendingDown className="w-5 h-5 text-red-600" />
              <div className="text-2xl font-bold text-red-600">{trendsSummary.descendo}</div>
            </div>
            <div className="text-sm text-gray-600">Piorando</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2">
              <Minus className="w-5 h-5 text-gray-600" />
              <div className="text-2xl font-bold text-gray-600">{trendsSummary.estavel}</div>
            </div>
            <div className="text-sm text-gray-600">Estável</div>
          </div>
        </div>
      </Card>

      {/* Gráfico de Variação Percentual */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">📈 Variação Percentual por Exame (1 Ano)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
            <YAxis label={{ value: 'Variação (%)', angle: -90, position: 'insideLeft' }} />
            <Tooltip 
              formatter={(value: any) => `${typeof value === 'number' ? value.toFixed(1) : value}%`}
              labelFormatter={(label) => `Variação: ${label}`}
            />
            <Bar 
              dataKey="trend" 
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Gráficos Individuais - Exames Críticos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Glicose */}
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Glicose em Jejum</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={glucoseData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[60, 100]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ fill: '#8b5cf6', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm">
            <div className="flex items-center gap-2">
              <Minus className="w-4 h-4 text-gray-600" />
              <span className="text-gray-600">Estável: 91 → 91 mg/dL</span>
            </div>
          </div>
        </Card>

        {/* Creatinina */}
        <Card className="p-6">
          <h4 className="font-semibold mb-4">Creatinina (Função Renal)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={creatinineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0.7, 1.3]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#10b981" 
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-green-600" />
              <span className="text-green-600">Melhorando: -8.6%</span>
            </div>
          </div>
        </Card>

        {/* TSH */}
        <Card className="p-6">
          <h4 className="font-semibold mb-4">TSH (Tireoide)</h4>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={tshData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0.4, 4.0]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#f59e0b" 
                strokeWidth={2}
                dot={{ fill: '#f59e0b', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 text-sm">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-green-600" />
              <span className="text-green-600">Melhorando: -5.2%</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Detalhes de Tendências */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">📋 Detalhes de Tendências</h3>
        <div className="space-y-3">
          {historicalExamsData.map((exam) => (
            <div key={exam.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium">{exam.name}</div>
                <div className="text-sm text-gray-600">{exam.interpretation}</div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {exam.trend === 'up' && (
                  <div className="flex items-center gap-1 text-red-600">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-semibold">+{typeof exam.trendValue === 'number' ? exam.trendValue.toFixed(1) : '0'}%</span>
                  </div>
                )}
                {exam.trend === 'down' && (
                  <div className="flex items-center gap-1 text-green-600">
                    <TrendingDown className="w-4 h-4" />
                    <span className="font-semibold">{typeof exam.trendValue === 'number' ? exam.trendValue.toFixed(1) : '0'}%</span>
                  </div>
                )}
                {exam.trend === 'stable' && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <Minus className="w-4 h-4" />
                    <span className="font-semibold">Estável</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
