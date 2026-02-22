import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { labExamsData, examCorrelations, riskAnalysis } from '@/data/labExamsData';
import { AlertCircle, TrendingUp, Activity, Heart, Zap } from 'lucide-react';

export function CorrelationAnalysis() {
  const [selectedRiskArea, setSelectedRiskArea] = useState<string>('cardiovascular');

  const riskAreas = Object.keys(riskAnalysis) as Array<keyof typeof riskAnalysis>;

  const getRiskIcon = (area: string) => {
    switch (area) {
      case 'cardiovascular':
        return <Heart className="w-5 h-5" />;
      case 'metabolic':
        return <Zap className="w-5 h-5" />;
      case 'hematologic':
        return <Activity className="w-5 h-5" />;
      case 'hepatic':
        return <Zap className="w-5 h-5" />;
      case 'renal':
        return <Activity className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getRiskColor = (score: string) => {
    switch (score) {
      case 'Crítico':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Alto':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Médio':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Baixo':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getRiskLabel = (score: string) => {
    switch (score) {
      case 'Crítico':
        return '🚨 CRÍTICO';
      case 'Alto':
        return '⚠️ ALTO';
      case 'Médio':
        return '⏱️ MÉDIO';
      case 'Baixo':
        return '✅ BAIXO';
      default:
        return score;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Análise de Correlações</h2>
        <p className="text-gray-600">
          Inteligência artificial para identificar padrões e correlações entre indicadores
        </p>
      </div>

      {/* Risk Analysis Overview */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Análise de Risco por Área</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {riskAreas.map(area => {
            const riskData = riskAnalysis[area];
            const isSelected = selectedRiskArea === area;

            return (
              <Card
                key={area}
                className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => setSelectedRiskArea(area)}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-900 capitalize">
                      {area === 'cardiovascular'
                        ? 'Cardiovascular'
                        : area === 'metabolic'
                          ? 'Metabólico'
                          : area === 'hematologic'
                            ? 'Hematológico'
                            : area === 'hepatic'
                              ? 'Hepático'
                              : 'Renal'}
                    </h4>
                    {getRiskIcon(area)}
                  </div>

                  <Badge
                    className={`${getRiskColor(riskData.score)} border-2 text-sm px-3 py-1`}
                  >
                    {getRiskLabel(riskData.score)}
                  </Badge>

                  <p className="text-sm text-gray-600">
                    {riskData.factors.length} fator{riskData.factors.length !== 1 ? 'es' : ''} identificado
                    {riskData.factors.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Detailed Risk Analysis */}
      {selectedRiskArea && (
        <Card className="p-6 border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 capitalize">
                  {selectedRiskArea === 'cardiovascular'
                    ? 'Risco Cardiovascular'
                    : selectedRiskArea === 'metabolic'
                      ? 'Risco Metabólico'
                      : selectedRiskArea === 'hematologic'
                        ? 'Risco Hematológico'
                        : selectedRiskArea === 'hepatic'
                          ? 'Risco Hepático'
                          : 'Risco Renal'}
                </h3>
                <p className="text-gray-600 mt-2">
                  Análise detalhada dos fatores de risco nesta área
                </p>
              </div>
              <Badge
                className={`${getRiskColor(riskAnalysis[selectedRiskArea as keyof typeof riskAnalysis].score)} border-2 text-lg px-4 py-2`}
              >
                {getRiskLabel(riskAnalysis[selectedRiskArea as keyof typeof riskAnalysis].score)}
              </Badge>
            </div>

            {/* Factors */}
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">Fatores Identificados</h4>
              <div className="space-y-2">
                {riskAnalysis[selectedRiskArea as keyof typeof riskAnalysis].factors.map(
                  (factor, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-white rounded-lg border border-gray-200"
                    >
                      <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{factor}</p>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Recommendations */}
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900">Recomendações</h4>
              <div className="space-y-2">
                {riskAnalysis[selectedRiskArea as keyof typeof riskAnalysis].recommendations.map(
                  (rec, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-white rounded-lg border border-green-200"
                    >
                      <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-700">{rec}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Exam Correlations */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Correlações entre Exames</h3>
        <div className="space-y-3">
          {examCorrelations.map((corr, idx) => {
            const exam1 = labExamsData.find(e => e.id === corr.exam1);
            const exam2 = labExamsData.find(e => e.id === corr.exam2);

            return (
              <Card key={idx} className="p-4 border-l-4 border-blue-500">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{exam1?.name}</p>
                        <p className="text-sm text-gray-600">
                          Valor: {exam1?.value} {exam1?.unit}
                        </p>
                      </div>
                      <div className="text-gray-400">↔</div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{exam2?.name}</p>
                        <p className="text-sm text-gray-600">
                          Valor: {exam2?.value} {exam2?.unit}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={
                        corr.riskLevel === 'critical'
                          ? 'bg-red-100 text-red-800'
                          : corr.riskLevel === 'high'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {corr.riskLevel === 'critical'
                        ? '🚨 Crítica'
                        : corr.riskLevel === 'high'
                          ? '⚠️ Alta'
                          : '⏱️ Média'}
                    </Badge>
                  </div>

                  <p className="text-gray-700 text-sm">{corr.relationship}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Intelligence Summary */}
      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-600" />
            Resumo Inteligente
          </h3>

          <div className="space-y-3 text-gray-700">
            <p>
              <strong>Alerta Crítico:</strong> Ferro sérico criticamente baixo (1.0 mcg/dL) indica
              anemia severa que requer investigação urgente e pode comprometer sua capacidade de
              exercício.
            </p>

            <p>
              <strong>Oportunidade:</strong> Glicose e A1C normais indicam bom controle metabólico.
              Aproveite para focar em redução de peso e exercício.
            </p>

            <p>
              <strong>Ação Imediata:</strong> Consultar Hematologista nos próximos 2-3 dias para
              investigar causa da anemia e iniciar suplementação.
            </p>

            <p>
              <strong>Próximos Passos:</strong> Após corrigir ferro, será seguro intensificar
              exercício. Enquanto isso, foque em exercícios de baixa intensidade (pilates, natação
              iniciante).
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
