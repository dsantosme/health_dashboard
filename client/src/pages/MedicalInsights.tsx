import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePatient } from '@/contexts/PatientContext';
import { getPatientExams, getPatient } from '@/data/patientsData';
import { ArrowLeft, AlertCircle, TrendingDown, TrendingUp, Heart, Zap } from 'lucide-react';

export default function MedicalInsights() {
  const [, navigate] = useLocation();
  const { selectedPatientId } = usePatient();
  const patient = getPatient(selectedPatientId);
  const exams = getPatientExams(selectedPatientId);

  // Análise de risco cardiovascular
  const cardiovascularRisk = () => {
    const hdl = exams.find(e => e.name.includes('HDL'))?.value as number;
    const ldl = exams.find(e => e.name.includes('LDL'))?.value as number;
    const glicose = exams.find(e => e.name.includes('Glicose'))?.value as number;
    
    let risk = 0;
    if (ldl && ldl > 130) risk += 2;
    if (hdl && hdl < 40) risk += 2;
    if (glicose && glicose > 125) risk += 1;
    
    return { risk, level: risk >= 4 ? 'Alto' : risk >= 2 ? 'Moderado' : 'Baixo' };
  };

  // Análise de risco metabólico
  const metabolicRisk = () => {
    const glicose = exams.find(e => e.name.includes('Glicose'))?.value as number;
    const peso = exams.find(e => e.name === 'Peso')?.value as number;
    const circunferencia = exams.find(e => e.name === 'Circunferência Abdominal')?.value as number;
    
    let risk = 0;
    if (glicose && glicose > 100) risk += 2;
    if (circunferencia && circunferencia > 102) risk += 2;
    
    return { risk, level: risk >= 3 ? 'Alto' : risk >= 1 ? 'Moderado' : 'Baixo' };
  };

  // Análise de função renal
  const renalFunction = () => {
    const creatinina = exams.find(e => e.name.includes('Creatinina'))?.value as number;
    const ureia = exams.find(e => e.name.includes('Ureia'))?.value as number;
    
    let status = 'Normal';
    if (creatinina && creatinina > 1.2) status = 'Comprometida';
    if (ureia && ureia > 40) status = 'Comprometida';
    
    return { status };
  };

  // Análise de função hepática
  const hepaticFunction = () => {
    const tgo = exams.find(e => e.name.includes('TGO'))?.value as number;
    const tgp = exams.find(e => e.name.includes('TGP'))?.value as number;
    
    let status = 'Normal';
    if ((tgo && tgo > 40) || (tgp && tgp > 58)) status = 'Alterada';
    
    return { status };
  };

  const cardioRisk = cardiovascularRisk();
  const metabRisk = metabolicRisk();
  const renalFunc = renalFunction();
  const hepaticFunc = hepaticFunction();

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Risco Cardiovascular */}
          <Card className={`p-6 border-2 ${
            cardioRisk.level === 'Alto' ? 'bg-red-50 border-red-200' :
            cardioRisk.level === 'Moderado' ? 'bg-yellow-50 border-yellow-200' :
            'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                cardioRisk.level === 'Alto' ? 'bg-red-100' :
                cardioRisk.level === 'Moderado' ? 'bg-yellow-100' :
                'bg-green-100'
              }`}>
                <Heart className={`w-6 h-6 ${
                  cardioRisk.level === 'Alto' ? 'text-red-600' :
                  cardioRisk.level === 'Moderado' ? 'text-yellow-600' :
                  'text-green-600'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Risco Cardiovascular</h3>
                <p className={`text-sm font-semibold mb-3 ${
                  cardioRisk.level === 'Alto' ? 'text-red-700' :
                  cardioRisk.level === 'Moderado' ? 'text-yellow-700' :
                  'text-green-700'
                }`}>
                  Nível: {cardioRisk.level}
                </p>
                <div className="space-y-2 text-sm text-slate-700">
                  <p>• Monitorar colesterol LDL e HDL regularmente</p>
                  <p>• Manter glicose em jejum abaixo de 100 mg/dL</p>
                  <p>• Realizar exercício aeróbico 150 min/semana</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Risco Metabólico */}
          <Card className={`p-6 border-2 ${
            metabRisk.level === 'Alto' ? 'bg-red-50 border-red-200' :
            metabRisk.level === 'Moderado' ? 'bg-yellow-50 border-yellow-200' :
            'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                metabRisk.level === 'Alto' ? 'bg-red-100' :
                metabRisk.level === 'Moderado' ? 'bg-yellow-100' :
                'bg-green-100'
              }`}>
                <Zap className={`w-6 h-6 ${
                  metabRisk.level === 'Alto' ? 'text-red-600' :
                  metabRisk.level === 'Moderado' ? 'text-yellow-600' :
                  'text-green-600'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Risco Metabólico</h3>
                <p className={`text-sm font-semibold mb-3 ${
                  metabRisk.level === 'Alto' ? 'text-red-700' :
                  metabRisk.level === 'Moderado' ? 'text-yellow-700' :
                  'text-green-700'
                }`}>
                  Nível: {metabRisk.level}
                </p>
                <div className="space-y-2 text-sm text-slate-700">
                  <p>• Reduzir circunferência abdominal para menos de 102 cm</p>
                  <p>• Controlar ingestão de carboidratos refinados</p>
                  <p>• Aumentar atividade física diária</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Função Renal */}
          <Card className={`p-6 border-2 ${
            renalFunc.status === 'Comprometida' ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                renalFunc.status === 'Comprometida' ? 'bg-red-100' : 'bg-green-100'
              }`}>
                <AlertCircle className={`w-6 h-6 ${
                  renalFunc.status === 'Comprometida' ? 'text-red-600' : 'text-green-600'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Função Renal</h3>
                <p className={`text-sm font-semibold mb-3 ${
                  renalFunc.status === 'Comprometida' ? 'text-red-700' : 'text-green-700'
                }`}>
                  Status: {renalFunc.status}
                </p>
                <div className="space-y-2 text-sm text-slate-700">
                  <p>• Manter hidratação adequada (2-3 litros/dia)</p>
                  <p>• Limitar sódio na alimentação</p>
                  <p>• Monitorar creatinina e ureia regularmente</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Função Hepática */}
          <Card className={`p-6 border-2 ${
            hepaticFunc.status === 'Alterada' ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                hepaticFunc.status === 'Alterada' ? 'bg-yellow-100' : 'bg-green-100'
              }`}>
                <AlertCircle className={`w-6 h-6 ${
                  hepaticFunc.status === 'Alterada' ? 'text-yellow-600' : 'text-green-600'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Função Hepática</h3>
                <p className={`text-sm font-semibold mb-3 ${
                  hepaticFunc.status === 'Alterada' ? 'text-yellow-700' : 'text-green-700'
                }`}>
                  Status: {hepaticFunc.status}
                </p>
                <div className="space-y-2 text-sm text-slate-700">
                  <p>• Evitar álcool e alimentos gordurosos</p>
                  <p>• Aumentar consumo de frutas e vegetais</p>
                  <p>• Realizar exames de função hepática a cada 6 meses</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Recomendações Gerais */}
        <Card className="mt-8 p-6 bg-white border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">📋 Recomendações Gerais</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="font-semibold text-blue-900 mb-2">Consultas Médicas</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Clínico geral: a cada 6 meses</li>
                <li>• Cardiologista: anualmente</li>
                <li>• Endocrinologista: se necessário</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="font-semibold text-green-900 mb-2">Exames Periódicos</p>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• Hemograma: anualmente</li>
                <li>• Perfil lipídico: anualmente</li>
                <li>• Glicose: a cada 3 meses</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <p className="font-semibold text-purple-900 mb-2">Estilo de Vida</p>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Exercício: 150 min/semana</li>
                <li>• Sono: 7-8 horas/noite</li>
                <li>• Estresse: técnicas de relaxamento</li>
              </ul>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
