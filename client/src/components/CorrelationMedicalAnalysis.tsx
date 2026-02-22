import { Card } from '@/components/ui/card';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

/**
 * Componente que exibe análise médica de correlações
 * Explica pela "ótica do médico" se a correlação está boa ou preocupante
 */

interface CorrelationMedicalAnalysisProps {
  correlation: {
    examName1: string;
    examName2: string;
    correlationType: string;
    strength: number;
    interpretation: string;
  };
}

export function CorrelationMedicalAnalysis({ correlation }: CorrelationMedicalAnalysisProps) {
  // Determinar se a correlação é boa ou preocupante baseado no tipo e força
  const getMedicalInterpretation = () => {
    const { examName1, examName2, correlationType, strength } = correlation;
    
    // Correlações conhecidas e suas interpretações
    const interpretations: Record<string, { good: boolean; explanation: string; recommendation: string }> = {
      'COLESTEROL_TOTAL-COLESTEROL_LDL': {
        good: false,
        explanation: 'Correlação positiva forte entre Colesterol Total e LDL indica que ambos estão elevados. O LDL é o "colesterol ruim" que se acumula nas artérias, aumentando risco cardiovascular.',
        recommendation: 'Recomenda-se dieta com baixo teor de gorduras saturadas, exercícios aeróbicos regulares e acompanhamento médico. Considere avaliação para estatinas se LDL > 130 mg/dL.'
      },
      'COLESTEROL_HDL-TRIGLICERIDEOS': {
        good: strength < 0, // Correlação negativa é boa
        explanation: strength < 0 
          ? 'Correlação negativa entre HDL e Triglicerídeos é POSITIVA: indica que níveis mais altos de HDL (colesterol bom) estão associados a níveis mais baixos de triglicerídeos, reduzindo risco cardiovascular.'
          : 'Correlação positiva entre HDL e Triglicerídeos é PREOCUPANTE: sugere que ambos estão elevados, o que pode indicar resistência à insulina ou síndrome metabólica.',
        recommendation: strength < 0
          ? 'Continue mantendo estilo de vida saudável com exercícios regulares e dieta balanceada para preservar este padrão protetor.'
          : 'Recomenda-se redução de carboidratos refinados, aumento de ômega-3 e exercícios aeróbicos. Avalie glicemia e resistência à insulina.'
      },
      'GLICOSE-TRIGLICERIDEOS': {
        good: false,
        explanation: 'Correlação positiva entre Glicose e Triglicerídeos indica resistência à insulina ou pré-diabetes. Ambos elevados aumentam significativamente o risco de diabetes tipo 2 e doenças cardiovasculares.',
        recommendation: 'URGENTE: Reduzir carboidratos refinados, aumentar fibras, praticar exercícios diários. Solicitar hemoglobina glicada (HbA1c) e curva glicêmica. Acompanhamento endocrinológico.'
      },
      'COLESTEROL_TOTAL-TRIGLICERIDEOS': {
        good: false,
        explanation: 'Ambos elevados indicam dislipidemia mista, aumentando risco de aterosclerose e eventos cardiovasculares (infarto, AVC).',
        recommendation: 'Dieta mediterrânea, redução de álcool, exercícios aeróbicos 5x/semana. Considere estatinas + fibratos sob supervisão médica.'
      },
      'PESO-IMC': {
        good: true, // Correlação esperada e normal
        explanation: 'Correlação positiva entre Peso e IMC é NORMAL e ESPERADA: o IMC é calculado a partir do peso e altura, então esta correlação apenas confirma a consistência dos dados.',
        recommendation: 'Mantenha acompanhamento regular do peso. Se IMC > 25, considere ajustes na dieta e exercícios para redução gradual.'
      }
    };

    // Buscar interpretação específica
    const key1 = `${examName1}-${examName2}`.toUpperCase().replace(/\s+/g, '_');
    const key2 = `${examName2}-${examName1}`.toUpperCase().replace(/\s+/g, '_');
    
    if (interpretations[key1]) return interpretations[key1];
    if (interpretations[key2]) return interpretations[key2];

    // Interpretação genérica baseada no tipo de correlação
    if (correlationType === 'POSITIVE') {
      return {
        good: false,
        explanation: `Correlação positiva forte (${(strength * 100).toFixed(0)}%) entre ${examName1} e ${examName2} indica que ambos tendem a aumentar juntos. Isso pode sugerir um padrão metabólico que requer atenção.`,
        recommendation: 'Consulte um médico para avaliação detalhada desta correlação e possíveis ajustes no tratamento ou estilo de vida.'
      };
    } else if (correlationType === 'NEGATIVE') {
      return {
        good: true,
        explanation: `Correlação negativa (${(strength * 100).toFixed(0)}%) entre ${examName1} e ${examName2} indica que quando um aumenta, o outro tende a diminuir. Geralmente é um padrão protetor.`,
        recommendation: 'Continue mantendo hábitos saudáveis para preservar este padrão benéfico.'
      };
    }

    return {
      good: true,
      explanation: 'Correlação fraca ou inexistente entre estes exames.',
      recommendation: 'Continue monitoramento regular dos exames.'
    };
  };

  const medical = getMedicalInterpretation();

  return (
    <Card className={`p-6 border-2 ${
      medical.good 
        ? 'bg-green-500/5 border-green-500/20' 
        : 'bg-yellow-500/5 border-yellow-500/20'
    }`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          {medical.good ? (
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
          ) : (
            <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
          )}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-foreground mb-1">
              {medical.good ? '✓ Padrão Normal' : '⚠️ Atenção Necessária'}
            </h3>
            <p className="text-sm text-muted-foreground">
              Análise médica da correlação entre {correlation.examName1} e {correlation.examName2}
            </p>
          </div>
        </div>

        {/* Explicação Médica */}
        <div className="space-y-3">
          <div className="p-4 bg-background/50 rounded-xl">
            <div className="flex items-start gap-2 mb-2">
              <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <h4 className="text-sm font-semibold text-foreground">Interpretação Médica</h4>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {medical.explanation}
            </p>
          </div>

          {/* Recomendação */}
          <div className={`p-4 rounded-xl ${
            medical.good 
              ? 'bg-green-500/10' 
              : 'bg-yellow-500/10'
          }`}>
            <h4 className="text-sm font-semibold text-foreground mb-2">
              💊 Recomendação
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {medical.recommendation}
            </p>
          </div>
        </div>

        {/* Dados Técnicos */}
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Tipo de Correlação</p>
              <p className="font-semibold text-foreground">{correlation.correlationType}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Força</p>
              <p className="font-semibold text-foreground">{(correlation.strength * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
