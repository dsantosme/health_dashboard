import { useAuth } from '@/_core/hooks/useAuth';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Microscope, TrendingUp, Activity, AlertCircle, ChevronRight, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';

export default function Home() {
  const { user, loading: authLoading, error, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  
  // Carregar paciente do banco
  const { data: patient, isLoading: patientLoading } = trpc.patients.getById.useQuery({
    patientId: 'denis-santos'
  });

  // Carregar todos os exames do paciente do banco
  const { data: exams = [], isLoading: examsLoading } = trpc.exams.listByPatient.useQuery({
    patientId: 'denis-santos'
  });

  const isLoading = patientLoading || examsLoading;

  // Agrupar exames por status
  const normalExams = exams.filter(e => e.status === 'normal').length;
  const abnormalExams = exams.filter(e => ['low', 'high'].includes(e.status)).length;
  
  // Encontrar exames críticos (status = 'high')
  const criticalExams = exams.filter(e => e.status === 'high');
  
  // Últimos exames (mais recentes) - priorizar 2026
  const latestExams = exams
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA; // Mais recente primeiro
    })
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-slate-600">Carregando dados do paciente...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-slate-900 font-semibold">Paciente não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Microscope className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Health Monitor</h1>
                <p className="text-sm text-slate-600">Análise de Saúde Personalizada</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Paciente</p>
              <p className="text-lg font-semibold text-slate-900">{patient.name}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Total Exames */}
          <Card className="p-6 bg-white border-slate-200 hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total de Exames</p>
                <p className="text-3xl font-bold text-slate-900">{exams.length}</p>
              </div>
              <Microscope className="w-10 h-10 text-blue-600 opacity-20" />
            </div>
          </Card>

          {/* Normais */}
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 mb-1">Normais</p>
                <p className="text-3xl font-bold text-green-900">{normalExams}</p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </Card>

          {/* Anormais */}
          <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 mb-1">Anormais</p>
                <p className="text-3xl font-bold text-yellow-900">{abnormalExams}</p>
              </div>
              <div className="text-3xl">⚠️</div>
            </div>
          </Card>

          {/* Críticos */}
          <Card className="p-6 bg-gradient-to-br from-red-50 to-rose-50 border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-700 mb-1">Críticos</p>
                <p className="text-3xl font-bold text-red-900">{criticalExams.length}</p>
              </div>
              <div className="text-3xl">🔴</div>
            </div>
          </Card>
        </div>

        {/* Critical Alerts */}
        {criticalExams.length > 0 && (
          <Card className="p-6 mb-8 bg-gradient-to-r from-red-50 to-rose-50 border-red-200">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-red-900 mb-2">⚠️ Alertas Críticos</h3>
                <div className="space-y-2">
                  {criticalExams.map(exam => (
                    <p key={exam.id} className="text-sm text-red-800">
                      <strong>{exam.examName}</strong>: {exam.value} {exam.unit} (Alto)
                    </p>
                  ))}
                </div>
                <p className="text-xs text-red-700 mt-3">⚠️ Acompanhamento recomendado</p>
              </div>
            </div>
          </Card>
        )}

        {/* Main Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Exames Detalhados */}
          <Card 
            className="p-8 bg-white border-slate-200 hover:shadow-lg transition cursor-pointer group"
            onClick={() => navigate('/exams')}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
                <Microscope className="w-6 h-6 text-blue-600" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Exames Detalhados</h3>
            <p className="text-sm text-slate-600 mb-4">
              Histórico completo com faixas de referência, gráficos temporais e análise de tendências
            </p>
            <Button className="w-full" variant="outline">
              Explorar Exames
            </Button>
          </Card>

          {/* Histórico Completo */}
          <Card 
            className="p-8 bg-white border-slate-200 hover:shadow-lg transition cursor-pointer group"
            onClick={() => navigate('/history')}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Histórico Completo</h3>
            <p className="text-sm text-slate-600 mb-4">
              Todos os períodos (2022-2026) com análise de tendências e evolução temporal
            </p>
            <Button className="w-full" variant="outline">
              Ver Histórico
            </Button>
          </Card>

          {/* Insights Médicos */}
          <Card 
            className="p-8 bg-white border-slate-200 hover:shadow-lg transition cursor-pointer group"
            onClick={() => navigate('/medical-insights')}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition">
                <AlertCircle className="w-6 h-6 text-purple-600" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 transition" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Insights Médicos</h3>
            <p className="text-sm text-slate-600 mb-4">
              Análise de correlações, riscos de saúde e recomendações médicas personalizadas
            </p>
            <Button className="w-full" variant="outline">
              Ver Insights
            </Button>
          </Card>

          {/* Insights de Esportes */}
          <Card 
            className="p-8 bg-white border-slate-200 hover:shadow-lg transition cursor-pointer group"
            onClick={() => navigate('/sports-insights')}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-green-600 transition" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Insights de Esportes</h3>
            <p className="text-sm text-slate-600 mb-4">
              Recomendações de exercícios, intensidade e recuperação baseadas em indicadores
            </p>
            <Button className="w-full" variant="outline">
              Ver Recomendações
            </Button>
          </Card>
        </div>

        {/* Últimos Exames */}
        <Card className="p-6 bg-white border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-slate-900">Últimos Exames</h2>
            <Button variant="ghost" size="sm" onClick={() => navigate('/exams')}>
              Ver Todos →
            </Button>
          </div>
          
          {latestExams.length === 0 ? (
            <p className="text-center text-slate-500 py-8">Nenhum exame encontrado</p>
          ) : (
            <div className="space-y-3">
              {latestExams.map(exam => (
                <div key={exam.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">{exam.examName}</p>
                    <p className="text-sm text-slate-600">
                      {new Date(exam.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{exam.value} {exam.unit}</p>
                    <p className="text-xs text-slate-600">{exam.category}</p>
                  </div>
                  <div className="ml-4">
                    {exam.status === 'normal' && <span className="text-lg">✅</span>}
                    {exam.status === 'low' && <span className="text-lg">⬇️</span>}
                    {exam.status === 'high' && <span className="text-lg">⬆️</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}
