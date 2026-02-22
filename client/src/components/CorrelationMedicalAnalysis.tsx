import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

interface CorrelationData {
  exam1: string;
  exam2: string;
  value1: number;
  value2: number;
  correlation: number;
  date: string;
}

interface Props {
  correlation: CorrelationData;
}

/**
 * Análise médica de correlações entre exames
 * Explica a correlação pela "ótica do médico"
 */
export default function CorrelationMedicalAnalysis({ correlation }: Props) {
  const { exam1, exam2, value1, value2, correlation: corrValue } = correlation;

  // Determinar se a correlação é boa ou preocupante
  const getCorrelationAnalysis = () => {
    const pair = `${exam1.toUpperCase()}-${exam2.toUpperCase()}`;

    // Colesterol Total x LDL (correlação positiva esperada)
    if (pair.includes('COLESTEROL TOTAL') && pair.includes('LDL')) {
      if (corrValue > 0.7) {
        return {
          status: 'normal',
          title: '✅ Correlação Esperada',
          explanation: 'O Colesterol Total e o LDL estão correlacionados positivamente, o que é esperado. O LDL é um componente do Colesterol Total.',
          recommendation: 'Continue monitorando. Se ambos estiverem elevados, considere ajustes na dieta e exercícios.'
        };
      }
    }

    // Colesterol HDL x Triglicerídeos (correlação negativa esperada)
    if ((pair.includes('HDL') && pair.includes('TRIGLICERID')) || (pair.includes('TRIGLICERID') && pair.includes('HDL'))) {
      if (corrValue < -0.3) {
        return {
          status: 'good',
          title: '✅ Correlação Protetora',
          explanation: 'HDL alto e Triglicerídeos baixos indicam perfil lipídico saudável. Esta correlação negativa é protetora contra doenças cardiovasculares.',
          recommendation: 'Excelente! Mantenha hábitos saudáveis: dieta equilibrada, exercícios aeróbicos regulares e evite açúcares simples.'
        };
      } else if (corrValue > 0.3) {
        return {
          status: 'warning',
          title: '⚠️ Atenção: Perfil Lipídico Desfavorável',
          explanation: 'HDL baixo e Triglicerídeos altos aumentam risco cardiovascular. Esta combinação indica resistência à insulina ou síndrome metabólica.',
          recommendation: 'Recomendado: consulta com cardiologista, ajustes na dieta (reduzir carboidratos refinados), aumentar exercícios aeróbicos.'
        };
      }
    }

    // Glicose x Triglicerídeos (correlação positiva pode indicar resistência à insulina)
    if ((pair.includes('GLICOSE') && pair.includes('TRIGLICERID')) || (pair.includes('TRIGLICERID') && pair.includes('GLICOSE'))) {
      if (corrValue > 0.5 && value1 > 100 && value2 > 150) {
        return {
          status: 'critical',
          title: '🔴 Alerta: Risco de Resistência à Insulina',
          explanation: 'Glicose e Triglicerídeos elevados simultaneamente indicam possível resistência à insulina ou pré-diabetes.',
          recommendation: 'URGENTE: consulta com endocrinologista. Exames adicionais: HbA1c, insulina em jejum. Ajustes imediatos na dieta e atividade física.'
        };
      } else if (corrValue > 0.3) {
        return {
          status: 'warning',
          title: '⚠️ Atenção: Monitorar Metabolismo de Carboidratos',
          explanation: 'Correlação positiva entre Glicose e Triglicerídeos pode indicar início de resistência à insulina.',
          recommendation: 'Recomendado: reduzir carboidratos refinados, aumentar fibras, exercícios regulares. Repetir exames em 3 meses.'
        };
      }
    }

    // Creatinina x Ureia (correlação positiva esperada)
    if ((pair.includes('CREATININA') && pair.includes('UREIA')) || (pair.includes('UREIA') && pair.includes('CREATININA'))) {
      if (corrValue > 0.6) {
        if (value1 > 1.2 && value2 > 40) {
          return {
            status: 'warning',
            title: '⚠️ Atenção: Função Renal Comprometida',
            explanation: 'Creatinina e Ureia elevadas simultaneamente indicam possível comprometimento da função renal.',
            recommendation: 'Recomendado: consulta com nefrologista, exames adicionais (clearance de creatinina, ureia), hidratação adequada.'
          };
        }
        return {
          status: 'normal',
          title: '✅ Função Renal Normal',
          explanation: 'Creatinina e Ureia estão correlacionadas positivamente, o que é esperado. Ambos são marcadores de função renal.',
          recommendation: 'Continue monitorando anualmente. Mantenha hidratação adequada.'
        };
      }
    }

    // TSH x T4 (correlação negativa esperada)
    if ((pair.includes('TSH') && pair.includes('T4')) || (pair.includes('T4') && pair.includes('TSH'))) {
      if (corrValue < -0.4) {
        return {
          status: 'normal',
          title: '✅ Função Tireoidiana Normal',
          explanation: 'TSH e T4 têm correlação negativa esperada (feedback negativo). Quando TSH sobe, T4 desce e vice-versa.',
          recommendation: 'Função tireoidiana regulada adequadamente. Monitorar anualmente.'
        };
      } else if (corrValue > 0.3) {
        return {
          status: 'warning',
          title: '⚠️ Atenção: Possível Disfunção Tireoidiana',
          explanation: 'TSH e T4 não estão seguindo o padrão esperado de feedback negativo. Pode indicar resistência ou disfunção tireoidiana.',
          recommendation: 'Recomendado: consulta com endocrinologista, exames adicionais (T3, anticorpos anti-TPO).'
        };
      }
    }

    // Análise genérica
    if (Math.abs(corrValue) > 0.7) {
      return {
        status: 'info',
        title: '📊 Correlação Forte Detectada',
        explanation: `${exam1} e ${exam2} apresentam correlação ${corrValue > 0 ? 'positiva' : 'negativa'} forte (${(corrValue * 100).toFixed(0)}%).`,
        recommendation: 'Discuta este padrão com seu médico para interpretação personalizada baseada em seu histórico clínico.'
      };
    } else if (Math.abs(corrValue) > 0.4) {
      return {
        status: 'info',
        title: '📊 Correlação Moderada Detectada',
        explanation: `${exam1} e ${exam2} apresentam correlação ${corrValue > 0 ? 'positiva' : 'negativa'} moderada (${(corrValue * 100).toFixed(0)}%).`,
        recommendation: 'Continue monitorando. Correlações podem mudar ao longo do tempo.'
      };
    }

    return {
      status: 'info',
      title: '📊 Correlação Fraca',
      explanation: `${exam1} e ${exam2} apresentam correlação fraca (${(corrValue * 100).toFixed(0)}%). Não há padrão significativo entre estes exames no momento.`,
      recommendation: 'Nenhuma ação necessária. Continue monitoramento regular.'
    };
  };

  const analysis = getCorrelationAnalysis();

  const statusConfig = {
    normal: { bg: 'bg-green-500/10', border: 'border-green-500/20', icon: CheckCircle, iconColor: 'text-green-400' },
    good: { bg: 'bg-green-500/10', border: 'border-green-500/20', icon: CheckCircle, iconColor: 'text-green-400' },
    warning: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', icon: AlertTriangle, iconColor: 'text-yellow-400' },
    critical: { bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertCircle, iconColor: 'text-red-400' },
    info: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: AlertCircle, iconColor: 'text-blue-400' }
  };

  const config = statusConfig[analysis.status as keyof typeof statusConfig];
  const Icon = config.icon;

  return (
    <Card className={`p-6 ${config.bg} border ${config.border}`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <Icon className={`w-6 h-6 ${config.iconColor} flex-shrink-0 mt-1`} />
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground mb-1">{analysis.title}</h3>
            <p className="text-sm text-muted-foreground">
              Correlação entre <strong>{exam1}</strong> e <strong>{exam2}</strong>
            </p>
          </div>
        </div>

        {/* Valores */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-background/50 rounded-xl">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{exam1}</p>
            <p className="text-lg font-bold text-foreground">{value1.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">{exam2}</p>
            <p className="text-lg font-bold text-foreground">{value2.toFixed(2)}</p>
          </div>
        </div>

        {/* Explicação */}
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">🔍 Análise Médica</h4>
            <p className="text-sm text-muted-foreground">{analysis.explanation}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">💡 Recomendação</h4>
            <p className="text-sm text-muted-foreground">{analysis.recommendation}</p>
          </div>
        </div>

        {/* Coeficiente de Correlação */}
        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Coeficiente de Correlação</span>
            <div className="flex items-center gap-2">
              {corrValue > 0 ? (
                <TrendingUp className="w-4 h-4 text-red-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-green-400" />
              )}
              <span className={`text-sm font-bold ${
                Math.abs(corrValue) > 0.7 ? 'text-foreground' :
                Math.abs(corrValue) > 0.4 ? 'text-muted-foreground' :
                'text-muted-foreground/70'
              }`}>
                {(corrValue * 100).toFixed(0)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
