import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, AlertCircle, TrendingDown, TrendingUp, Heart, Zap, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useMemo } from 'react';
import { useCurrentPatient } from '@/hooks/useCurrentPatient';

export default function MedicalInsights() {
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

  // Análise de risco cardiovascular
  const cardiovascularRisk = useMemo(() => {
    const hdl = findLatestExam('HDL');
    const ldl = findLatestExam('LDL');
    const glicose = findLatestExam('Glicose');
    const colesterolTotal = findLatestExam('Colesterol Total');
    
    let risk = 0;
    const factors = [];
    
    if (ldl && ldl > 130) {
      risk += 2;
      factors.push(`LDL elevado (${ldl} mg/dL)`);
    }
    if (hdl && hdl < 40) {
      risk += 2;
      factors.push(`HDL baixo (${hdl} mg/dL)`);
    }
    if (glicose && glicose > 125) {
      risk += 1;
      factors.push(`Glicose elevada (${glicose} mg/dL)`);
    }
    if (colesterolTotal && colesterolTotal > 240) {
      risk += 1;
      factors.push(`Colesterol total elevado (${colesterolTotal} mg/dL)`);
    }
    
    return { 
      risk, 
      level: risk >= 4 ? 'Alto' : risk >= 2 ? 'Moderado' : 'Baixo',
      factors
    };
  }, [recentExams]);

  // Análise de risco metabólico
  const metabolicRisk = useMemo(() => {
    const glicose = findLatestExam('Glicose');
    const triglicerideos = findLatestExam('Triglicérideos');
    const imc = findLatestExam('IMC');
    
    let risk = 0;
    const factors = [];
    
    if (glicose && glicose > 100) {
      risk += 2;
      factors.push(`Glicose elevada (${glicose} mg/dL)`);
    }
    if (triglicerideos && triglicerideos > 150) {
      risk += 2;
      factors.push(`Triglicerídeos elevados (${triglicerideos} mg/dL)`);
    }
    if (imc && imc > 30) {
      risk += 1;
      factors.push(`IMC elevado (${imc})`);
    }
    
    return { 
      risk, 
      level: risk >= 3 ? 'Alto' : risk >= 1 ? 'Moderado' : 'Baixo',
      factors
    };
  }, [recentExams]);
  // Análise de função renal
  const renalFunction = useMemo(() => {
    const creatinina = findLatestExam('Creatinina');
    const ureia = findLatestExam('Ureia');
    const tgf = findLatestExam('Filtração Glomerular');
    
    let status = 'Normal';
    const indicators = [];
    
    if (creatinina) {
      indicators.push(`Creatinina: ${creatinina} mg/dL`);
      if (creatinina > 1.2) status = 'Comprometida';
    }
    if (ureia) {
      indicators.push(`Ureia: ${ureia} mg/dL`);
      if (ureia > 40) status = 'Comprometida';
    }
    if (tgf) {
      indicators.push(`TFG: ${tgf} mL/min/1.73m²`);
      if (tgf < 60) status = 'Comprometida';
    }
    
    return { status, indicators };
  }, [recentExams]);

  //  // Análise de função hepática
  const hepaticFunction = useMemo(() => {
    const tgo = findLatestExam('TGO');
    const tgp = findLatestExam('TGP');
    const gamaGt = findLatestExam('Gama GT');
    const gamaGT = findLatestExam('gama gt');
    
    let status = 'Normal';
    const indicators = [];
    
    if (tgo) {
      indicators.push(`TGO/AST: ${tgo} U/L`);
      if (tgo > 40) status = 'Alterada';
    }
    if (tgp) {
      indicators.push(`TGP/ALT: ${tgp} U/L`);
      if (tgp > 58) status = 'Alterada';
    }
    if (gamaGT) {
      indicators.push(`Gama GT: ${gamaGT} U/L`);
      if (gamaGT > 55) status = 'Alterada';
    }
    
    return { status, indicators };
  }, [recentExams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
          <p className="text-slate-600">Analisando dados médicos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-100">
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
          <h1 className="text-2xl font-bold text-slate-900">Insights Médicos</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {recentExams.length === 0 ? (
          <Card className="p-12 bg-white border-slate-200 text-center">
            <AlertCircle className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">Nenhum exame recente encontrado para análise.</p>
            <p className="text-sm text-slate-500 mt-2">Exames dos últimos 2 anos são considerados para insights médicos.</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risco Cardiovascular */}
            <Card className={`p-6 border-2 ${
              cardiovascularRisk.level === 'Alto' ? 'bg-red-50 border-red-200' :
              cardiovascularRisk.level === 'Moderado' ? 'bg-yellow-50 border-yellow-200' :
              'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  cardiovascularRisk.level === 'Alto' ? 'bg-red-100' :
                  cardiovascularRisk.level === 'Moderado' ? 'bg-yellow-100' :
                  'bg-green-100'
                }`}>
                  <Heart className={`w-6 h-6 ${
                    cardiovascularRisk.level === 'Alto' ? 'text-red-600' :
                    cardiovascularRisk.level === 'Moderado' ? 'text-yellow-600' :
                    'text-green-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-2">Risco Cardiovascular</h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${
                    cardiovascularRisk.level === 'Alto' ? 'bg-red-200 text-red-900' :
                    cardiovascularRisk.level === 'Moderado' ? 'bg-yellow-200 text-yellow-900' :
                    'bg-green-200 text-green-900'
                  }`}>
                    {cardiovascularRisk.level}
                  </div>
                  {cardiovascularRisk.factors.length > 0 ? (
                    <ul className="text-sm text-slate-700 space-y-1">
                      {cardiovascularRisk.factors.map((factor, idx) => (
                        <li key={idx}>• {factor}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-700">Todos os indicadores dentro da faixa normal.</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Risco Metabólico */}
            <Card className={`p-6 border-2 ${
              metabolicRisk.level === 'Alto' ? 'bg-red-50 border-red-200' :
              metabolicRisk.level === 'Moderado' ? 'bg-yellow-50 border-yellow-200' :
              'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  metabolicRisk.level === 'Alto' ? 'bg-red-100' :
                  metabolicRisk.level === 'Moderado' ? 'bg-yellow-100' :
                  'bg-green-100'
                }`}>
                  <Zap className={`w-6 h-6 ${
                    metabolicRisk.level === 'Alto' ? 'text-red-600' :
                    metabolicRisk.level === 'Moderado' ? 'text-yellow-600' :
                    'text-green-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-2">Risco Metabólico</h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${
                    metabolicRisk.level === 'Alto' ? 'bg-red-200 text-red-900' :
                    metabolicRisk.level === 'Moderado' ? 'bg-yellow-200 text-yellow-900' :
                    'bg-green-200 text-green-900'
                  }`}>
                    {metabolicRisk.level}
                  </div>
                  {metabolicRisk.factors.length > 0 ? (
                    <ul className="text-sm text-slate-700 space-y-1">
                      {metabolicRisk.factors.map((factor, idx) => (
                        <li key={idx}>• {factor}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-700">Todos os indicadores dentro da faixa normal.</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Função Renal */}
            <Card className={`p-6 border-2 ${
              renalFunction.status === 'Comprometida' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  renalFunction.status === 'Comprometida' ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  <AlertCircle className={`w-6 h-6 ${
                    renalFunction.status === 'Comprometida' ? 'text-red-600' : 'text-green-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-2">Função Renal</h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${
                    renalFunction.status === 'Comprometida' ? 'bg-red-200 text-red-900' : 'bg-green-200 text-green-900'
                  }`}>
                    {renalFunction.status}
                  </div>
                  {renalFunction.indicators.length > 0 ? (
                    <ul className="text-sm text-slate-700 space-y-1">
                      {renalFunction.indicators.map((indicator, idx) => (
                        <li key={idx}>• {indicator}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-700">Nenhum indicador renal disponível.</p>
                  )}
                </div>
              </div>
            </Card>

            {/* Função Hepática */}
            <Card className={`p-6 border-2 ${
              hepaticFunction.status === 'Alterada' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  hepaticFunction.status === 'Alterada' ? 'bg-red-100' : 'bg-green-100'
                }`}>
                  <TrendingUp className={`w-6 h-6 ${
                    hepaticFunction.status === 'Alterada' ? 'text-red-600' : 'text-green-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 mb-2">Função Hepática</h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mb-3 ${
                    hepaticFunction.status === 'Alterada' ? 'bg-red-200 text-red-900' : 'bg-green-200 text-green-900'
                  }`}>
                    {hepaticFunction.status}
                  </div>
                  {hepaticFunction.indicators.length > 0 ? (
                    <ul className="text-sm text-slate-700 space-y-1">
                      {hepaticFunction.indicators.map((indicator, idx) => (
                        <li key={idx}>• {indicator}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-slate-700">Nenhum indicador hepático disponível.</p>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Recomendações */}
        {recentExams.length > 0 && (
          <Card className="mt-6 p-6 bg-white border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <AlertCircle className="w-6 h-6 text-blue-600" />
              Recomendações
            </h2>
            <div className="space-y-3 text-slate-700">
              {(cardiovascularRisk.level === 'Alto' || metabolicRisk.level === 'Alto') && (
                <p>• Consultar cardiologista para avaliação detalhada do risco cardiovascular e metabólico.</p>
              )}
              {renalFunction.status === 'Comprometida' && (
                <p>• Agendar consulta com nefrologista para avaliação da função renal.</p>
              )}
              {hepaticFunction.status === 'Alterada' && (
                <p>• Consultar hepatologista ou gastroenterologista para investigação da função hepática.</p>
              )}
              <p>• Manter acompanhamento médico regular com exames a cada 3-6 meses.</p>
              <p>• Praticar exercícios regularmente (ciclismo, corrida, pilates, natação).</p>
              <p>• Manter alimentação balanceada e hidratação adequada.</p>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
