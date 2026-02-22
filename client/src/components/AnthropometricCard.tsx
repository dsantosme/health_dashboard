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
 * Retorna cor e label baseado no IMC
 * < 18.5: Abaixo do peso
 * 18.5-24.9: Peso normal
 * 25-29.9: Sobrepeso
 * 30-34.9: Obesidade Grau I
 * 35-39.9: Obesidade Grau II
 * >= 40: Obesidade Grau III
 */
function getAvatarByBMI(bmi: number): { label: string; color: string; fillColor: string } {
  if (bmi < 18.5) {
    return { label: 'Abaixo do peso', color: 'text-blue-400', fillColor: '#60a5fa' };
  } else if (bmi < 25) {
    return { label: 'Peso normal', color: 'text-green-400', fillColor: '#4ade80' };
  } else if (bmi < 30) {
    return { label: 'Sobrepeso', color: 'text-yellow-400', fillColor: '#facc15' };
  } else if (bmi < 35) {
    return { label: 'Obesidade Grau I', color: 'text-orange-400', fillColor: '#fb923c' };
  } else if (bmi < 40) {
    return { label: 'Obesidade Grau II', color: 'text-red-400', fillColor: '#f87171' };
  } else {
    return { label: 'Obesidade Grau III', color: 'text-red-600', fillColor: '#dc2626' };
  }
}

/**
 * Silhueta humana flat monocromática (SVG)
 */
function HumanSilhouette({ fillColor }: { fillColor: string }) {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cabeça */}
      <circle cx="12" cy="5" r="3" fill={fillColor} />
      {/* Corpo */}
      <path
        d="M12 9C9 9 7 11 7 13V18C7 18.5 7.5 19 8 19H16C16.5 19 17 18.5 17 18V13C17 11 15 9 12 9Z"
        fill={fillColor}
      />
      {/* Braços */}
      <path
        d="M7 13L5 17C4.8 17.5 5 18 5.5 18.2C6 18.4 6.5 18.2 6.7 17.7L8.5 13.5"
        fill={fillColor}
      />
      <path
        d="M17 13L19 17C19.2 17.5 19 18 18.5 18.2C18 18.4 17.5 18.2 17.3 17.7L15.5 13.5"
        fill={fillColor}
      />
      {/* Pernas */}
      <path
        d="M10 19V23C10 23.5 10.5 24 11 24C11.5 24 12 23.5 12 23V19"
        fill={fillColor}
      />
      <path
        d="M14 19V23C14 23.5 13.5 24 13 24C12.5 24 12 23.5 12 23V19"
        fill={fillColor}
      />
    </svg>
  );
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
        <HumanSilhouette fillColor={avatar.fillColor} />
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
