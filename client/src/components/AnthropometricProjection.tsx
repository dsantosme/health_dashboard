import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Card } from '@/components/ui/card';

interface AnthropometricData {
  weight: number; // kg
  waist: number; // cm
  height: number; // cm
  bmi: number;
}

interface ProjectionScenario {
  name: string;
  color: string;
  weightChange: number; // kg por mês
  waistChange: number; // cm por mês
}

const SCENARIOS: ProjectionScenario[] = [
  {
    name: 'Otimista (Redução)',
    color: '#10b981', // verde
    weightChange: -0.5, // -0.5 kg por mês
    waistChange: -0.3, // -0.3 cm por mês
  },
  {
    name: 'Manutenção',
    color: '#f59e0b', // amarelo
    weightChange: 0,
    waistChange: 0,
  },
  {
    name: 'Pessimista (Aumento)',
    color: '#ef4444', // vermelho
    weightChange: 0.5, // +0.5 kg por mês
    waistChange: 0.3, // +0.3 cm por mês
  },
];

export function AnthropometricProjection({ data }: { data: AnthropometricData }) {
  // Gerar projeção para 24 meses (2 anos) a cada 3 meses
  const projectionData = useMemo(() => {
    const months = [];
    const today = new Date();

    for (let i = 0; i <= 24; i += 3) {
      const monthDate = new Date(today);
      monthDate.setMonth(monthDate.getMonth() + i);

      const monthLabel = monthDate.toLocaleDateString('pt-BR', {
        month: 'short',
        year: '2-digit',
      });

      const point: Record<string, any> = {
        month: monthLabel,
        monthNum: i,
      };

      // Calcular projeção para cada cenário
      SCENARIOS.forEach((scenario) => {
        const projectedWeight = data.weight + scenario.weightChange * i;
        const projectedWaist = data.waist + scenario.waistChange * i;
        const projectedBmi = (projectedWeight / ((data.height / 100) ** 2));

        point[`weight_${scenario.name}`] = parseFloat(projectedWeight.toFixed(1));
        point[`waist_${scenario.name}`] = parseFloat(projectedWaist.toFixed(1));
        point[`bmi_${scenario.name}`] = parseFloat(projectedBmi.toFixed(1));
      });

      months.push(point);
    }

    return months;
  }, [data]);

  // Calcular impacto em exames
  const examImpact = useMemo(() => {
    const impacts: Record<string, string[]> = {
      'Otimista (Redução)': [],
      'Manutenção': [],
      'Pessimista (Aumento)': [],
    };

    SCENARIOS.forEach((scenario) => {
      const finalWeight = data.weight + scenario.weightChange * 24;
      const finalWaist = data.waist + scenario.waistChange * 24;
      const finalBmi = finalWeight / ((data.height / 100) ** 2);

      const weightChange = finalWeight - data.weight;
      const waistChange = finalWaist - data.waist;
      const bmiChange = finalBmi - data.bmi;

      if (scenario.name === 'Otimista (Redução)') {
        impacts['Otimista (Redução)'] = [
          `Redução de ${Math.abs(weightChange).toFixed(1)} kg`,
          `Redução de ${Math.abs(waistChange).toFixed(1)} cm na circunferência`,
          `IMC: ${finalBmi.toFixed(1)} (melhoria de ${Math.abs(bmiChange).toFixed(1)})`,
          '✅ Melhoria esperada em: Glicose, Colesterol, Triglicerídeos, Pressão Arterial',
          '✅ Redução de risco de: Diabetes, Doenças Cardiovasculares',
        ];
      } else if (scenario.name === 'Manutenção') {
        impacts['Manutenção'] = [
          `Peso mantido em ${data.weight} kg`,
          `Circunferência mantida em ${data.waist} cm`,
          `IMC mantido em ${data.bmi}`,
          '⚠️ Sem mudanças esperadas nos exames',
          '⚠️ Risco mantido no nível atual',
        ];
      } else {
        impacts['Pessimista (Aumento)'] = [
          `Aumento de ${weightChange.toFixed(1)} kg`,
          `Aumento de ${waistChange.toFixed(1)} cm na circunferência`,
          `IMC: ${finalBmi.toFixed(1)} (piora de ${bmiChange.toFixed(1)})`,
          '❌ Piora esperada em: Glicose, Colesterol, Triglicerídeos, Pressão Arterial',
          '❌ Aumento de risco de: Diabetes, Doenças Cardiovasculares, Síndrome Metabólica',
        ];
      }
    });

    return impacts;
  }, [data]);

  return (
    <div className="space-y-6">
      {/* Gráfico de Projeção de Peso */}
      <Card className="p-6 bg-white border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Projeção de Peso (24 meses)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis
              tick={{ fontSize: 12, fill: '#64748b' }}
              label={{ value: 'Peso (kg)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip formatter={(value: any) => `${value} kg`} />
            <Legend />
            <ReferenceLine y={data.weight} stroke="#94a3b8" strokeDasharray="5 5" label="Peso Atual" />
            <Line
              type="monotone"
              dataKey="weight_Otimista (Redução)"
              stroke="#10b981"
              name="Otimista"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="weight_Manutenção"
              stroke="#f59e0b"
              name="Manutenção"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="weight_Pessimista (Aumento)"
              stroke="#ef4444"
              name="Pessimista"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Gráfico de Projeção de Circunferência Abdominal */}
      <Card className="p-6 bg-white border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Projeção de Circunferência Abdominal (24 meses)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={projectionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
            <YAxis
              tick={{ fontSize: 12, fill: '#64748b' }}
              label={{ value: 'Circunferência (cm)', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip formatter={(value: any) => `${value} cm`} />
            <Legend />
            <ReferenceLine y={data.waist} stroke="#94a3b8" strokeDasharray="5 5" label="Circunferência Atual" />
            <Line
              type="monotone"
              dataKey="waist_Otimista (Redução)"
              stroke="#10b981"
              name="Otimista"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="waist_Manutenção"
              stroke="#f59e0b"
              name="Manutenção"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="waist_Pessimista (Aumento)"
              stroke="#ef4444"
              name="Pessimista"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* Impacto em Exames */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {SCENARIOS.map((scenario) => (
          <Card
            key={scenario.name}
            className="p-6 bg-white border-2"
            style={{ borderColor: scenario.color }}
          >
            <h4 className="font-bold text-lg mb-3" style={{ color: scenario.color }}>
              {scenario.name}
            </h4>
            <div className="space-y-2 text-sm">
              {examImpact[scenario.name]?.map((impact, idx) => (
                <p key={idx} className="text-slate-700">
                  {impact}
                </p>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {/* Recomendações */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <h4 className="font-bold text-slate-900 mb-3">💡 Recomendações</h4>
        <ul className="space-y-2 text-sm text-slate-700">
          <li>
            • <strong>Cenário Otimista:</strong> Redução de 0,5 kg/mês e 0,3 cm/mês de circunferência abdominal
          </li>
          <li>
            • <strong>Cenário Manutenção:</strong> Manter peso e circunferência atual sem alterações
          </li>
          <li>
            • <strong>Cenário Pessimista:</strong> Aumento de 0,5 kg/mês e 0,3 cm/mês de circunferência abdominal
          </li>
          <li>
            • A circunferência abdominal é um indicador importante de risco metabólico e cardiovascular
          </li>
          <li>
            • Mudanças no peso e circunferência afetam principalmente: Glicose, Colesterol, Triglicerídeos e Pressão
            Arterial
          </li>
        </ul>
      </Card>
    </div>
  );
}
