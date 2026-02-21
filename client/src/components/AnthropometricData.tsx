import { Card } from '@/components/ui/card';
import { Activity, Ruler, Weight, Zap } from 'lucide-react';

interface AnthropometricDataProps {
  weight: number; // kg
  height: number; // cm
  waist: number; // cm
  bmi: number;
}

export function AnthropometricData({ weight, height, waist, bmi }: AnthropometricDataProps) {
  // Determinar categoria de IMC
  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { label: 'Abaixo do peso', color: 'text-blue-600', bg: 'bg-blue-50' };
    if (bmi < 25) return { label: 'Peso normal', color: 'text-green-600', bg: 'bg-green-50' };
    if (bmi < 30) return { label: 'Sobrepeso', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    if (bmi < 35) return { label: 'Obesidade Grau I', color: 'text-orange-600', bg: 'bg-orange-50' };
    return { label: 'Obesidade Grau II+', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const bmiCategory = getBMICategory(bmi);

  // Determinar categoria de circunferência abdominal (para homem)
  const getWaistCategory = (waist: number) => {
    if (waist < 94) return { label: 'Normal', color: 'text-green-600', bg: 'bg-green-50' };
    if (waist < 102) return { label: 'Aumentado', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { label: 'Muito aumentado', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const waistCategory = getWaistCategory(waist);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Peso */}
      <Card className="p-6 bg-white border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900">Peso</h3>
          <Weight className="w-5 h-5 text-blue-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-900">{weight}</span>
          <span className="text-sm text-slate-600">kg</span>
        </div>
        <p className="text-xs text-slate-500 mt-2">Medida atual</p>
      </Card>

      {/* Altura */}
      <Card className="p-6 bg-white border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900">Altura</h3>
          <Ruler className="w-5 h-5 text-indigo-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-900">{height}</span>
          <span className="text-sm text-slate-600">cm</span>
        </div>
        <p className="text-xs text-slate-500 mt-2">Medida fixa</p>
      </Card>

      {/* Circunferência Abdominal */}
      <Card className={`p-6 border-slate-200 ${waistCategory.bg}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900">Circunferência Abdominal</h3>
          <Activity className="w-5 h-5 text-purple-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-900">{waist}</span>
          <span className="text-sm text-slate-600">cm</span>
        </div>
        <p className={`text-xs font-medium mt-2 ${waistCategory.color}`}>{waistCategory.label}</p>
        <p className="text-xs text-slate-500 mt-1">Homem: &lt;94cm normal, 94-102cm aumentado</p>
      </Card>

      {/* IMC */}
      <Card className={`p-6 border-slate-200 ${bmiCategory.bg}`}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-slate-900">IMC</h3>
          <Zap className="w-5 h-5 text-yellow-600" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-900">{bmi.toFixed(1)}</span>
          <span className="text-sm text-slate-600">kg/m²</span>
        </div>
        <p className={`text-xs font-medium mt-2 ${bmiCategory.color}`}>{bmiCategory.label}</p>
        <p className="text-xs text-slate-500 mt-1">18.5-24.9 normal, 25-29.9 sobrepeso</p>
      </Card>
    </div>
  );
}
