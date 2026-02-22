import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Activity, Zap, Heart, AlertCircle, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useMemo } from 'react';
import { useCurrentPatient } from '@/hooks/useCurrentPatient';

export default function SportsInsights() {
  const [, navigate] = useLocation();
  const { patientId } = useCurrentPatient();
  
  // Buscar APENAS exames de 2026 (ano vigente)
  const { data: recentExams = [], isLoading } = trpc.exams.listByPatientAndPeriod.useQuery(
    {
      patientId: patientId!,
      year: 2026
    },
    {
      enabled: !!patientId,
    }
  );

  // Função auxiliar para encontrar exame (dados de 2026 já estão filtrados)
  const findLatestExam = (searchTerm: string) => {
    const matches = recentExams
      .filter(e => e.examName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (matches.length === 0) return null;
    
    const value = parseFloat(String(matches[0].value));
    return isNaN(value) ? null : value;
  };

  // Análise de capacidade aeróbica
  const aerobicCapacity = useMemo(() => {
    const glicose = findLatestExam('Glicose');
    const hemoglobina = findLatestExam('Hemoglobina');
    const hematocrito = findLatestExam('Hematócrito');
    
    let capacity = 'Moderada';
    const recommendations = [];
    
    if (glicose) {
      if (glicose > 125) {
        capacity = 'Reduzida';
        recommendations.push('Iniciar com atividades de baixa intensidade (caminhada, ciclismo leve)');
        recommendations.push('Monitorar glicemia antes e após exercícios');
      } else if (glicose < 100) {
        capacity = 'Boa';
        recommendations.push('Pode realizar exercícios de intensidade moderada a alta');
        recommendations.push('Ideal para ciclismo MTB, corrida de rua e natação');
      }
    }
    
    if (hemoglobina) {
      if (hemoglobina < 12) {
        recommendations.push('Aumentar ingestão de ferro antes de exercícios intensos');
        recommendations.push('Considerar suplementação de ferro sob orientação médica');
      } else if (hemoglobina >= 14) {
        recommendations.push('Ótima capacidade de transporte de oxigênio');
        recommendations.push('Excelente para treinos de alta intensidade');
      }
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Capacidade aeróbica adequada para exercícios regulares');
      recommendations.push('Manter rotina de ciclismo, corrida, pilates e natação');
    }
    
    return { capacity, recommendations, glicose, hemoglobina };
  }, [recentExams]);

  // Análise de recuperação
  const recoveryAnalysis = useMemo(() => {
    const creatinina = findLatestExam('creatinina');
    const ureia = findLatestExam('ureia') || findLatestExam('uréia');
    const tgo = findLatestExam('tgo') || findLatestExam('ast');
    const tgp = findLatestExam('tgp') || findLatestExam('alt');
    
    let recovery = 'Boa';
    const recommendations = [];
    
    if (creatinina && creatinina > 1.2) {
      recovery = 'Comprometida';
      recommendations.push('Aumentar tempo de recuperação entre treinos (48-72h)');
      recommendations.push('Aumentar ingestão de água (3-4L/dia)');
    }
    
    if (ureia && ureia > 40) {
      recovery = 'Comprometida';
      recommendations.push('Reduzir intensidade dos treinos temporariamente');
      recommendations.push('Aumentar ingestão de eletrólitos');
    }
    
    if ((tgo && tgo > 40) || (tgp && tgp > 45)) {
      recommendations.push('Evitar overtraining - respeitar dias de descanso');
      recommendations.push('Considerar redução de volume de treino');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Recuperação adequada com 24-48h entre treinos intensos');
      recommendations.push('Pode manter frequência de 4-6 treinos por semana');
    }
    
    return { recovery, recommendations, creatinina, ureia };
  }, [recentExams]);

  // Análise de risco de lesão
  const injuryRisk = useMemo(() => {
    const potassio = findLatestExam('potássio');
    const sodio = findLatestExam('sódio');
    const calcio = findLatestExam('cálcio');
    const vitaminaD = findLatestExam('vitamina d');
    
    let risk = 'Baixo';
    const recommendations = [];
    
    if (potassio && potassio < 3.5) {
      risk = 'Alto';
      recommendations.push('Aumentar ingestão de potássio (banana, água de coco)');
      recommendations.push('Risco de cãibras - fazer aquecimento prolongado');
    }
    
    if (calcio && calcio < 8.5) {
      risk = 'Alto';
      recommendations.push('Aumentar ingestão de cálcio');
      recommendations.push('Risco de lesões ósseas - evitar impactos excessivos');
    }
    
    if (vitaminaD && vitaminaD < 30) {
      recommendations.push('Suplementar vitamina D para saúde óssea');
      recommendations.push('Exposição solar 15-20min/dia');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Eletrólitos em níveis adequados');
      recommendations.push('Manter rotina de alongamento e fortalecimento');
      recommendations.push('Baixo risco de lesões - pode intensificar treinos');
    }
    
    return { risk, recommendations, potassio, calcio };
  }, [recentExams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin" />
          <p className="text-slate-600">Analisando dados esportivos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-slate-900">Insights de Esportes</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {recentExams.length === 0 ? (
          <Card className="p-12 bg-white border-slate-200 text-center">
            <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">Nenhum exame recente encontrado para análise.</p>
            <p className="text-sm text-slate-500 mt-2">Exames dos últimos 2 anos são considerados para insights esportivos.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Capacidade Aeróbica */}
            <Card className={`p-6 border-2 ${
              aerobicCapacity.capacity === 'Boa' ? 'bg-green-50 border-green-200' :
              aerobicCapacity.capacity === 'Reduzida' ? 'bg-red-50 border-red-200' :
              'bg-yellow-50 border-yellow-200'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  aerobicCapacity.capacity === 'Boa' ? 'bg-green-100' :
                  aerobicCapacity.capacity === 'Reduzida' ? 'bg-red-100' :
                  'bg-yellow-100'
                }`}>
                  <Heart className={`w-6 h-6 ${
                    aerobicCapacity.capacity === 'Boa' ? 'text-green-600' :
                    aerobicCapacity.capacity === 'Reduzida' ? 'text-red-600' :
                    'text-yellow-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-2">Capacidade Aeróbica</h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${
                    aerobicCapacity.capacity === 'Boa' ? 'bg-green-200 text-green-900' :
                    aerobicCapacity.capacity === 'Reduzida' ? 'bg-red-200 text-red-900' :
                    'bg-yellow-200 text-yellow-900'
                  }`}>
                    {aerobicCapacity.capacity}
                  </div>
                  {aerobicCapacity.glicose && (
                    <p className="text-xs text-slate-600 mb-2">Glicose: {aerobicCapacity.glicose} mg/dL</p>
                  )}
                  {aerobicCapacity.hemoglobina && (
                    <p className="text-xs text-slate-600 mb-2">Hemoglobina: {aerobicCapacity.hemoglobina} g/dL</p>
                  )}
                  <ul className="text-sm text-slate-700 space-y-1 mt-2">
                    {aerobicCapacity.recommendations.map((rec, idx) => (
                      <li key={idx}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* Recuperação */}
            <Card className={`p-6 border-2 ${
              recoveryAnalysis.recovery === 'Boa' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  recoveryAnalysis.recovery === 'Boa' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <Zap className={`w-6 h-6 ${
                    recoveryAnalysis.recovery === 'Boa' ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-2">Recuperação</h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${
                    recoveryAnalysis.recovery === 'Boa' ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'
                  }`}>
                    {recoveryAnalysis.recovery}
                  </div>
                  {recoveryAnalysis.creatinina && (
                    <p className="text-xs text-slate-600 mb-2">Creatinina: {recoveryAnalysis.creatinina} mg/dL</p>
                  )}
                  {recoveryAnalysis.ureia && (
                    <p className="text-xs text-slate-600 mb-2">Ureia: {recoveryAnalysis.ureia} mg/dL</p>
                  )}
                  <ul className="text-sm text-slate-700 space-y-1 mt-2">
                    {recoveryAnalysis.recommendations.map((rec, idx) => (
                      <li key={idx}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* Risco de Lesão */}
            <Card className={`p-6 border-2 ${
              injuryRisk.risk === 'Baixo' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  injuryRisk.risk === 'Baixo' ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <Activity className={`w-6 h-6 ${
                    injuryRisk.risk === 'Baixo' ? 'text-green-600' : 'text-red-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-2">Risco de Lesão</h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${
                    injuryRisk.risk === 'Baixo' ? 'bg-green-200 text-green-900' : 'bg-red-200 text-red-900'
                  }`}>
                    {injuryRisk.risk}
                  </div>
                  {injuryRisk.potassio && (
                    <p className="text-xs text-slate-600 mb-2">Potássio: {injuryRisk.potassio} mEq/L</p>
                  )}
                  {injuryRisk.calcio && (
                    <p className="text-xs text-slate-600 mb-2">Cálcio: {injuryRisk.calcio} mg/dL</p>
                  )}
                  <ul className="text-sm text-slate-700 space-y-1 mt-2">
                    {injuryRisk.recommendations.map((rec, idx) => (
                      <li key={idx}>• {rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Recomendações de Exercícios */}
        {recentExams.length > 0 && (
          <Card className="mt-6 p-6 bg-white border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Activity className="w-6 h-6 text-green-600" />
              Recomendações de Exercícios
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">✅ Recomendados</h3>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• <strong>Ciclismo de Estrada:</strong> Excelente para capacidade aeróbica</li>
                  <li>• <strong>MTB (Mountain Bike):</strong> Alta intensidade com baixo impacto</li>
                  <li>• <strong>Corrida de Rua:</strong> Melhora resistência cardiovascular</li>
                  <li>• <strong>Pilates:</strong> Fortalecimento do core e flexibilidade</li>
                  <li>• <strong>Natação:</strong> Exercício completo de baixo impacto</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">⚠️ Evitar</h3>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• <strong>Musculação pesada:</strong> Não recomendado conforme perfil</li>
                  <li>• <strong>Exercícios de alto impacto:</strong> Se houver deficiência de cálcio</li>
                  <li>• <strong>Treinos muito longos:</strong> Se recuperação estiver comprometida</li>
                </ul>
              </div>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
