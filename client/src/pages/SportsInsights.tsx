import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePatient } from '@/contexts/PatientContext';
import { getPatientExams } from '@/data/patientsData';
import { ArrowLeft, Activity, Zap, Heart, AlertCircle } from 'lucide-react';

export default function SportsInsights() {
  const [, navigate] = useLocation();
  const { selectedPatientId } = usePatient();
  const exams = getPatientExams(selectedPatientId);

  // Análise de capacidade aeróbica
  const aerobicCapacity = () => {
    const glicose = exams.find(e => e.name.includes('Glicose'))?.value as number;
    const hemoglobina = exams.find(e => e.name.includes('Hemoglobina'))?.value as number;
    
    let capacity = 'Moderada';
    let recommendations = [];
    
    if (glicose && glicose > 125) {
      capacity = 'Reduzida';
      recommendations.push('Iniciar com atividades de baixa intensidade');
    } else if (glicose && glicose < 100) {
      capacity = 'Boa';
      recommendations.push('Pode realizar exercícios de intensidade moderada a alta');
    }
    
    if (!hemoglobina || hemoglobina < 12) {
      recommendations.push('Aumentar ingestão de ferro antes de exercícios intensos');
    }
    
    return { capacity, recommendations };
  };

  // Análise de recuperação
  const recoveryAnalysis = () => {
    const creatinina = exams.find(e => e.name.includes('Creatinina'))?.value as number;
    const ureia = exams.find(e => e.name.includes('Ureia'))?.value as number;
    
    let recovery = 'Boa';
    let recommendations = [];
    
    if ((creatinina && creatinina > 1.2) || (ureia && ureia > 40)) {
      recovery = 'Comprometida';
      recommendations.push('Aumentar tempo de recuperação entre treinos');
      recommendations.push('Aumentar ingestão de água e eletrólitos');
    } else {
      recommendations.push('Recuperação adequada com 24-48h entre treinos intensos');
    }
    
    return { recovery, recommendations };
  };

  // Análise de risco de lesão
  const injuryRisk = () => {
    const potassio = exams.find(e => e.name.includes('Potássio'))?.value as number;
    const magnesio = exams.find(e => e.name.includes('Magnésio'))?.value as number;
    
    let risk = 'Baixo';
    let recommendations = [];
    
    if ((potassio && potassio < 3.5) || (magnesio && magnesio < 1.7)) {
      risk = 'Alto';
      recommendations.push('Aumentar ingestão de eletrólitos');
      recommendations.push('Fazer aquecimento prolongado antes de exercícios');
    } else {
      recommendations.push('Eletrólitos em níveis adequados');
      recommendations.push('Manter rotina de alongamento');
    }
    
    return { risk, recommendations };
  };

  const aerobic = aerobicCapacity();
  const recovery = recoveryAnalysis();
  const injury = injuryRisk();

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Capacidade Aeróbica */}
          <Card className={`p-6 border-2 ${
            aerobic.capacity === 'Boa' ? 'bg-green-50 border-green-200' :
            aerobic.capacity === 'Moderada' ? 'bg-yellow-50 border-yellow-200' :
            'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                aerobic.capacity === 'Boa' ? 'bg-green-100' :
                aerobic.capacity === 'Moderada' ? 'bg-yellow-100' :
                'bg-red-100'
              }`}>
                <Activity className={`w-6 h-6 ${
                  aerobic.capacity === 'Boa' ? 'text-green-600' :
                  aerobic.capacity === 'Moderada' ? 'text-yellow-600' :
                  'text-red-600'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Capacidade Aeróbica</h3>
                <p className={`text-sm font-semibold mb-3 ${
                  aerobic.capacity === 'Boa' ? 'text-green-700' :
                  aerobic.capacity === 'Moderada' ? 'text-yellow-700' :
                  'text-red-700'
                }`}>
                  {aerobic.capacity}
                </p>
              </div>
            </div>
          </Card>

          {/* Recuperação */}
          <Card className={`p-6 border-2 ${
            recovery.recovery === 'Boa' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                recovery.recovery === 'Boa' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <Zap className={`w-6 h-6 ${
                  recovery.recovery === 'Boa' ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Recuperação</h3>
                <p className={`text-sm font-semibold mb-3 ${
                  recovery.recovery === 'Boa' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {recovery.recovery}
                </p>
              </div>
            </div>
          </Card>

          {/* Risco de Lesão */}
          <Card className={`p-6 border-2 ${
            injury.risk === 'Baixo' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                injury.risk === 'Baixo' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <Heart className={`w-6 h-6 ${
                  injury.risk === 'Baixo' ? 'text-green-600' : 'text-red-600'
                }`} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-2">Risco de Lesão</h3>
                <p className={`text-sm font-semibold mb-3 ${
                  injury.risk === 'Baixo' ? 'text-green-700' : 'text-red-700'
                }`}>
                  {injury.risk}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Recomendações Detalhadas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Capacidade Aeróbica */}
          <Card className="p-6 bg-white border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4">💨 Recomendações Aeróbicas</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              {aerobic.recommendations.map((rec, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-green-600">✓</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Recuperação */}
          <Card className="p-6 bg-white border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4">🔄 Recomendações de Recuperação</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              {recovery.recommendations.map((rec, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Prevenção de Lesões */}
          <Card className="p-6 bg-white border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4">🛡️ Prevenção de Lesões</h3>
            <ul className="space-y-2 text-sm text-slate-700">
              {injury.recommendations.map((rec, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-orange-600">✓</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Programa de Exercícios Personalizado */}
        <Card className="p-6 bg-white border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">🏋️ Programa Personalizado</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Ciclismo */}
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-bold text-blue-900 mb-3">🚴 Ciclismo de Estrada</h4>
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>Frequência:</strong> 3-4x por semana</p>
                <p><strong>Duração:</strong> 45-90 minutos</p>
                <p><strong>Intensidade:</strong> Moderada a Alta (70-85% FC máx)</p>
                <p><strong>Benefícios:</strong> Melhora cardiovascular, queima de calorias</p>
                <p><strong>Precauções:</strong> Aquecimento de 10 min, alongamento pós-treino</p>
              </div>
            </div>

            {/* MTB */}
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-bold text-green-900 mb-3">🚵 Mountain Bike</h4>
              <div className="space-y-2 text-sm text-green-800">
                <p><strong>Frequência:</strong> 2-3x por semana</p>
                <p><strong>Duração:</strong> 60-120 minutos</p>
                <p><strong>Intensidade:</strong> Variável (intervalos)</p>
                <p><strong>Benefícios:</strong> Força, resistência, coordenação</p>
                <p><strong>Precauções:</strong> Proteção adequada, terreno apropriado</p>
              </div>
            </div>

            {/* Corrida */}
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-bold text-orange-900 mb-3">🏃 Corrida de Rua</h4>
              <div className="space-y-2 text-sm text-orange-800">
                <p><strong>Frequência:</strong> 2-3x por semana</p>
                <p><strong>Duração:</strong> 30-60 minutos</p>
                <p><strong>Intensidade:</strong> Moderada (60-75% FC máx)</p>
                <p><strong>Benefícios:</strong> Resistência cardiovascular, queima de gordura</p>
                <p><strong>Precauções:</strong> Sapatos adequados, superfícies macias</p>
              </div>
            </div>

            {/* Pilates */}
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h4 className="font-bold text-purple-900 mb-3">🧘 Pilates</h4>
              <div className="space-y-2 text-sm text-purple-800">
                <p><strong>Frequência:</strong> 2-3x por semana</p>
                <p><strong>Duração:</strong> 45-60 minutos</p>
                <p><strong>Intensidade:</strong> Moderada (controle e precisão)</p>
                <p><strong>Benefícios:</strong> Força, flexibilidade, postura</p>
                <p><strong>Precauções:</strong> Técnica correta, instrutor qualificado</p>
              </div>
            </div>

            {/* Natação */}
            <div className="p-4 bg-cyan-50 rounded-lg border border-cyan-200">
              <h4 className="font-bold text-cyan-900 mb-3">🏊 Natação</h4>
              <div className="space-y-2 text-sm text-cyan-800">
                <p><strong>Frequência:</strong> 2-3x por semana</p>
                <p><strong>Duração:</strong> 30-45 minutos</p>
                <p><strong>Intensidade:</strong> Moderada a Alta</p>
                <p><strong>Benefícios:</strong> Aeróbico, baixo impacto, força</p>
                <p><strong>Precauções:</strong> Aulas com instrutor, progressão gradual</p>
              </div>
            </div>

            {/* Recuperação */}
            <div className="p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-bold text-red-900 mb-3">🌴 Recuperação Ativa</h4>
              <div className="space-y-2 text-sm text-red-800">
                <p><strong>Frequência:</strong> 1-2x por semana</p>
                <p><strong>Duração:</strong> 20-30 minutos</p>
                <p><strong>Intensidade:</strong> Baixa (caminhada, yoga)</p>
                <p><strong>Benefícios:</strong> Reduz fadiga, melhora flexibilidade</p>
                <p><strong>Precauções:</strong> Não substituir treino principal</p>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
