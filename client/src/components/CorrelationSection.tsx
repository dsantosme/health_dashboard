import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Info, Network } from 'lucide-react';
import { trpc } from '@/lib/trpc';

interface CorrelationSectionProps {
  patientId: string;
  examName: string;
}

export function CorrelationSection({ patientId, examName }: CorrelationSectionProps) {
  // Buscar correlações para o exame selecionado (data mais recente)
  const { data: correlations = [], isLoading } = trpc.correlations.getWithMedicalAnalysis.useQuery(
    {
      patientId,
      date: new Date().toISOString().split('T')[0] // Usar data atual como fallback
    },
    {
      enabled: !!patientId && !!examName
    }
  );

  // Filtrar correlações que envolvem o exame selecionado
  const relevantCorrelations = correlations.filter((c: any) => {
    try {
      const examsInvolved = JSON.parse(c.examsInvolved || '[]');
      return examsInvolved.includes(examName);
    } catch {
      return false;
    }
  });

  if (isLoading) {
    return (
      <Card className="p-6 bg-card border-border">
        <div className="flex items-center gap-3">
          <Network className="w-5 h-5 text-primary animate-pulse" />
          <p className="text-sm text-muted-foreground">Carregando correlações...</p>
        </div>
      </Card>
    );
  }

  if (relevantCorrelations.length === 0) {
    return (
      <Card className="p-6 bg-card border-border">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-bold text-foreground mb-1">Correlações Disponíveis</h3>
              <p className="text-sm text-muted-foreground">
                Este exame pode ser correlacionado com outros para análise mais profunda. Selecione exames relacionados para visualizar insights médicos.
              </p>
            </div>
          </div>

          <div className="p-4 bg-background/50 rounded-xl">
            <h4 className="text-sm font-semibold text-foreground mb-2">Exames relacionados:</h4>
            <p className="text-sm text-muted-foreground">
              {getRelatedExams(examName).join(', ')}
            </p>
          </div>

          <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-300">
                💡 <strong>Dica:</strong> Correlações são mais precisas quando os exames são realizados no mesmo período (mesma semana ou mês).
              </p>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Exibir correlações encontradas
  return (
    <div className="space-y-4">
      {relevantCorrelations.map((correlation: any, index: number) => {
        const examsInvolved = JSON.parse(correlation.examsInvolved || '[]');
        const specialists = JSON.parse(correlation.specialists || '[]');
        const isGood = correlation.severity === 'good';
        const isUrgent = correlation.severity === 'urgent';

        return (
          <Card
            key={index}
            className={`p-6 border-2 ${
              isGood
                ? 'bg-green-500/5 border-green-500/20'
                : isUrgent
                ? 'bg-red-500/5 border-red-500/20'
                : 'bg-yellow-500/5 border-yellow-500/20'
            }`}
          >
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start gap-3">
                {isGood ? (
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                ) : (
                  <AlertCircle className={`w-6 h-6 flex-shrink-0 mt-1 ${isUrgent ? 'text-red-400' : 'text-yellow-400'}`} />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-foreground mb-1">
                    {isGood ? '✓ Padrão Normal' : isUrgent ? '🔴 Atenção Urgente' : '⚠️ Atenção Necessária'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Correlação entre {examsInvolved.join(' e ')}
                  </p>
                </div>
              </div>

              {/* Análise Médica */}
              <div className="space-y-3">
                <div className="p-4 bg-background/50 rounded-xl">
                  <div className="flex items-start gap-2 mb-2">
                    <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <h4 className="text-sm font-semibold text-foreground">Análise Médica</h4>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {correlation.analysis}
                  </p>
                </div>

                {/* Recomendações */}
                {correlation.recommendations && (
                  <div
                    className={`p-4 rounded-xl ${
                      isGood ? 'bg-green-500/10' : isUrgent ? 'bg-red-500/10' : 'bg-yellow-500/10'
                    }`}
                  >
                    <h4 className="text-sm font-semibold text-foreground mb-2">💊 Recomendações</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {correlation.recommendations}
                    </p>
                  </div>
                )}

                {/* Especialistas */}
                {specialists.length > 0 && (
                  <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-semibold text-foreground mb-2">👨‍⚕️ Especialistas Recomendados</h4>
                    <div className="flex flex-wrap gap-2">
                      {specialists.map((specialist: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                        >
                          {specialist}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Data */}
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  Análise gerada em {new Date(correlation.correlationDate).toLocaleDateString('pt-BR')}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

// Helper: Retorna exames relacionados baseado no tipo
function getRelatedExams(examName: string): string[] {
  const relations: Record<string, string[]> = {
    'COLESTEROL TOTAL': ['Colesterol HDL', 'Colesterol LDL', 'Triglicerídeos', 'Glicose'],
    'COLESTEROL HDL': ['Colesterol Total', 'Triglicerídeos', 'Colesterol LDL'],
    'COLESTEROL LDL': ['Colesterol Total', 'Triglicerídeos', 'Colesterol HDL'],
    'TRIGLICERIDEOS': ['Colesterol Total', 'Glicose', 'Peso', 'IMC'],
    'GLICOSE': ['Triglicerídeos', 'Peso', 'IMC', 'Hemoglobina Glicada'],
    'PESO': ['IMC', 'Circunferência Abdominal', 'Glicose', 'Triglicerídeos'],
    'IMC': ['Peso', 'Circunferência Abdominal', 'Glicose', 'Triglicerídeos']
  };

  const key = Object.keys(relations).find(k => examName.toUpperCase().includes(k));
  return key ? relations[key] : ['Colesterol', 'Triglicerídeos', 'Glicose', 'Peso', 'IMC'];
}
