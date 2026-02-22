import { Card } from '@/components/ui/card';
import { Weight, Ruler, Activity } from 'lucide-react';

interface AnthropometricData {
  weight: number;
  height: number;
  waist: number;
  bmi: number;
}

interface Props {
  data: AnthropometricData;
}

/**
 * Retorna emoji de avatar baseado no IMC
 * < 18.5: Abaixo do peso
 * 18.5-24.9: Peso normal
 * 25-29.9: Sobrepeso
 * 30-34.9: Obesidade Grau I
 * 35-39.9: Obesidade Grau II
 * >= 40: Obesidade Grau III
 */
function getAvatarByBMI(bmi: number): { emoji: string; label: string; color: string } {
  if (bmi < 18.5) {
    return { emoji: '🧍‍♂️', label: 'Abaixo do peso', color: 'text-blue-400' };
  } else if (bmi < 25) {
    return { emoji: '🏃‍♂️', label: 'Peso normal', color: 'text-green-400' };
  } else if (bmi < 30) {
    return { emoji: '🚶‍♂️', label: 'Sobrepeso', color: 'text-yellow-400' };
  } else if (bmi < 35) {
    return { emoji: '🧍', label: 'Obesidade Grau I', color: 'text-orange-400' };
  } else if (bmi < 40) {
    return { emoji: '🧍', label: 'Obesidade Grau II', color: 'text-red-400' };
  } else {
    return { emoji: '🧍', label: 'Obesidade Grau III', color: 'text-red-600' };
  }
}

export default function AnthropometricCard({ data }: Props) {
  const avatar = getAvatarByBMI(data.bmi);

  return (
    <Card className="p-6 bg-gradient-to-br from-card via-card to-card/80 border-border/50">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Dados Antropométricos</h3>
          <p className="text-sm text-muted-foreground">Medidas atuais</p>
        </div>
        <div className="text-5xl">{avatar.emoji}</div>
      </div>

      {/* Grid de métricas */}
      <div className="grid grid-cols-2 gap-4">
        {/* Peso */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
            <Weight className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Peso</p>
            <p className="text-lg font-bold text-foreground">{data.weight} <span className="text-sm font-normal">kg</span></p>
          </div>
        </div>

        {/* Altura */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <Ruler className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Altura</p>
            <p className="text-lg font-bold text-foreground">{data.height} <span className="text-sm font-normal">cm</span></p>
          </div>
        </div>

        {/* Circunferência Abdominal */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50">
          <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-pink-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Cintura</p>
            <p className="text-lg font-bold text-foreground">{data.waist} <span className="text-sm font-normal">cm</span></p>
          </div>
        </div>

        {/* IMC */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50">
          <div className={`w-10 h-10 rounded-lg ${avatar.color.replace('text-', 'bg-')}/10 flex items-center justify-center`}>
            <span className={`text-2xl font-bold ${avatar.color}`}>⚡</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">IMC</p>
            <p className={`text-lg font-bold ${avatar.color}`}>{data.bmi.toFixed(1)}</p>
          </div>
        </div>
      </div>

      {/* Status do IMC */}
      <div className="mt-4 p-3 rounded-xl bg-background/30 border border-border/30">
        <p className="text-xs text-muted-foreground mb-1">Status</p>
        <p className={`text-sm font-semibold ${avatar.color}`}>{avatar.label}</p>
      </div>
    </Card>
  );
}
