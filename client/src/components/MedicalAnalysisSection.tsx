/**
 * MedicalAnalysisSection
 * 
 * Componente que exibe análise médica em linguagem natural gerada por LLM.
 * Mostra valores reais dos exames, índices clínicos calculados e interpretação
 * contextualizada como se fosse um especialista conversando com o paciente.
 */

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Activity, TrendingUp, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { trpc } from '@/lib/trpc';

interface MedicalAnalysisSectionProps {
  patientId: string;
  examNames: string[];
  correlationDate?: string;
}

export function MedicalAnalysisSection({
  patientId,
  examNames,
  correlationDate,
}: MedicalAnalysisSectionProps) {
  const [showAnalysis, setShowAnalysis] = useState(false);

  const mutation = trpc.medicalAnalysis.generate.useMutation();

  const handleGenerateAnalysis = async () => {
    setShowAnalysis(true);
    await mutation.mutateAsync({
      patientId,
      examNames,
    });
  };

  const { data: analysis, isPending, error } = mutation;

  if (!showAnalysis) {
    return (
      <Card className="p-6 bg-card border-border/50">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Análise Médica Detalhada
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Gere uma análise em linguagem natural cruzando os valores reais desses exames,
              calculando índices clínicos e interpretando os resultados como um especialista.
            </p>
            <Button
              onClick={handleGenerateAnalysis}
              className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
              variant="outline"
            >
              <Activity className="w-4 h-4 mr-2" />
              Gerar Análise Médica
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (isPending) {
    return (
      <Card className="p-6 bg-card border-border/50">
        <div className="flex items-center justify-center gap-3 py-8">
          <Loader2 className="w-6 h-6 text-primary animate-spin" />
          <p className="text-muted-foreground">Gerando análise médica...</p>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-red-500/10 border-red-500/20">
        <div className="flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
          <div>
            <h3 className="text-lg font-semibold text-red-400 mb-2">Erro ao Gerar Análise</h3>
            <p className="text-sm text-red-300">{error.message}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!analysis) {
    return null;
  }

  const { specialist, specialtyEmoji, patientName, analysis: analysisText, examValues, clinicalIndices, urgencyLevel, recommendations } = analysis;

  const urgencyConfig = {
    good: {
      bg: 'bg-green-500/10',
      border: 'border-green-500/20',
      text: 'text-green-400',
      icon: CheckCircle2,
      label: 'Situação Favorável',
    },
    attention: {
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      text: 'text-yellow-400',
      icon: AlertCircle,
      label: 'Requer Atenção',
    },
    urgent: {
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      text: 'text-red-400',
      icon: AlertCircle,
      label: 'Urgente',
    },
  };

  const config = urgencyConfig[urgencyLevel as keyof typeof urgencyConfig];
  const UrgencyIcon = config.icon;

  return (
    <div className="space-y-4">
      {/* Header com Especialista */}
      <Card className={`p-6 ${config.bg} border ${config.border}`}>
        <div className="flex items-start gap-4">
          <div className="text-4xl">{specialtyEmoji}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-foreground">{specialist}</h3>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${config.bg} ${config.text} text-xs font-medium`}>
                <UrgencyIcon className="w-3 h-3" />
                {config.label}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Análise personalizada para {patientName}
            </p>
          </div>
        </div>
      </Card>

      {/* Valores dos Exames */}
      <Card className="p-6 bg-card border-border/50">
        <h4 className="text-md font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Valores dos Exames
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {examValues.map((exam: any, idx: number) => {
            const statusConfig = {
              normal: { bg: 'bg-green-500/10', text: 'text-green-400', label: 'Normal' },
              low: { bg: 'bg-blue-500/10', text: 'text-blue-400', label: 'Baixo' },
              high: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Alto' },
            };
            const examConfig = statusConfig[exam.status as keyof typeof statusConfig];

            return (
              <div key={idx} className={`p-3 rounded-lg ${examConfig.bg} border border-border/30`}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">{exam.name}</p>
                  <span className={`text-xs font-medium ${examConfig.text}`}>{examConfig.label}</span>
                </div>
                <p className="text-lg font-bold text-foreground">
                  {exam.value} {exam.unit}
                </p>
                {exam.referenceMin && exam.referenceMax && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Referência: {exam.referenceMin}-{exam.referenceMax} {exam.unit}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Índices Clínicos */}
      {Object.keys(clinicalIndices).length > 0 && (
        <Card className="p-6 bg-card border-border/50">
          <h4 className="text-md font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Índices Clínicos Calculados
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {clinicalIndices.tgHdlRatio && (
              <div className="p-3 rounded-lg bg-primary/5 border border-border/30">
                <p className="text-sm text-muted-foreground">Relação TG/HDL</p>
                <p className="text-lg font-bold text-foreground">{clinicalIndices.tgHdlRatio.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {clinicalIndices.tgHdlRatio > 5 ? 'Elevado (risco metabólico)' : 'Adequado'}
                </p>
              </div>
            )}
            {clinicalIndices.ctHdlRatio && (
              <div className="p-3 rounded-lg bg-primary/5 border border-border/30">
                <p className="text-sm text-muted-foreground">Relação CT/HDL</p>
                <p className="text-lg font-bold text-foreground">{clinicalIndices.ctHdlRatio.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {clinicalIndices.ctHdlRatio > 5 ? 'Elevado (risco cardiovascular)' : 'Adequado'}
                </p>
              </div>
            )}
            {clinicalIndices.ldlHdlRatio && (
              <div className="p-3 rounded-lg bg-primary/5 border border-border/30">
                <p className="text-sm text-muted-foreground">Relação LDL/HDL</p>
                <p className="text-lg font-bold text-foreground">{clinicalIndices.ldlHdlRatio.toFixed(2)}</p>
              </div>
            )}
            {clinicalIndices.nonHdlCholesterol && (
              <div className="p-3 rounded-lg bg-primary/5 border border-border/30">
                <p className="text-sm text-muted-foreground">Colesterol Não-HDL</p>
                <p className="text-lg font-bold text-foreground">{clinicalIndices.nonHdlCholesterol.toFixed(0)} mg/dL</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Análise em Linguagem Natural */}
      <Card className="p-6 bg-card border-border/50">
        <h4 className="text-md font-semibold text-foreground mb-4">Análise Detalhada</h4>
        <div className="prose prose-invert max-w-none">
          <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
            {analysisText}
          </p>
        </div>
      </Card>

      {/* Recomendações */}
      {recommendations.length > 0 && (
        <Card className="p-6 bg-primary/5 border-primary/20">
          <h4 className="text-md font-semibold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-primary" />
            Recomendações
          </h4>
          <ul className="space-y-2">
            {recommendations.map((rec: string, idx: number) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                <span className="text-primary mt-0.5">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Recomendações Personalizadas */}
      {analysis.personalizedRecommendations && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mt-6 mb-4">
            <div className="h-px flex-1 bg-border"></div>
            <h3 className="text-lg font-bold text-foreground">Plano de Ação Personalizado</h3>
            <div className="h-px flex-1 bg-border"></div>
          </div>

          {/* Plano de Ação */}
          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <h4 className="text-md font-semibold text-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              Plano de Ação (3-6 meses)
            </h4>
            <div className="prose prose-sm prose-invert max-w-none">
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {analysis.personalizedRecommendations.actionPlan}
              </p>
            </div>
          </Card>

          {/* Sugestões de Dieta */}
          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <h4 className="text-md font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="text-xl">🥗</span>
              Sugestões de Dieta
            </h4>
            <div className="prose prose-sm prose-invert max-w-none">
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {analysis.personalizedRecommendations.dietSuggestions}
              </p>
            </div>
          </Card>

          {/* Plano de Exercícios */}
          <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20">
            <h4 className="text-md font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="text-xl">🏃</span>
              Plano de Exercícios
            </h4>
            <div className="prose prose-sm prose-invert max-w-none">
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {analysis.personalizedRecommendations.exercisePlan}
              </p>
            </div>
          </Card>

          {/* Cronograma de Acompanhamento */}
          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <h4 className="text-md font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="text-xl">📅</span>
              Cronograma de Acompanhamento
            </h4>
            <div className="prose prose-sm prose-invert max-w-none">
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {analysis.personalizedRecommendations.followUpSchedule}
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
