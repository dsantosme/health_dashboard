import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Microscope, TrendingUp, Activity, AlertCircle, ChevronRight, Loader2, LogIn, Network } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { useCurrentPatient } from '@/hooks/useCurrentPatient';
import { getLoginUrl } from '@/const';
import AnthropometricCard from '@/components/AnthropometricCard';

export default function Home() {
  const { user, loading: authLoading, error, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  
  // Obter paciente do usuário autenticado (LGPD compliant)
  const { patient, patientId, loading: patientLoading } = useCurrentPatient();

  // Carregar APENAS exames de 2026 (ano vigente)
  const { data: exams = [], isLoading: examsLoading } = trpc.exams.listByPatientAndPeriod.useQuery(
    {
      patientId: patientId!,
      year: 2026
    },
    {
      enabled: !!patientId, // Só executa se tiver patientId
    }
  );

  const isLoading = patientLoading || examsLoading || authLoading;

  // Agrupar exames por status
  const normalExams = exams.filter(e => e.status === 'normal').length;
  const abnormalExams = exams.filter(e => ['low', 'high'].includes(e.status)).length;
  
  // Encontrar exames críticos (status = 'high')
  const criticalExams = exams.filter(e => e.status === 'high');
  
  // Últimos 5 exames de 2026 (mais recentes)
  const latestExams = exams
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA; // Mais recente primeiro
    })
    .slice(0, 5);
  
  // Total de exames de 2026
  const totalExams2026 = exams.length;

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

  // Tela de login para usuários não autenticados
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 bg-white border-slate-200 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Microscope className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Health Monitor</h1>
          <p className="text-slate-600 mb-6">Análise de Saúde Personalizada</p>
          <p className="text-sm text-slate-500 mb-6">
            Faça login para acessar seus exames médicos, histórico completo e insights personalizados.
          </p>
          <Button 
            onClick={() => window.location.href = getLoginUrl()}
            className="w-full gap-2"
            size="lg"
          >
            <LogIn className="w-5 h-5" />
            Fazer Login com Google
          </Button>
        </Card>
      </div>
    );
  }

  // Usuário autenticado mas sem paciente cadastrado
  if (!patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-6">
        <Card className="max-w-md w-full p-8 bg-white border-slate-200 text-center">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Nenhum Paciente Cadastrado</h2>
          <p className="text-slate-600 mb-4">
            Você está autenticado como <strong>{user?.email}</strong>, mas ainda não possui dados de paciente vinculados.
          </p>
          <p className="text-sm text-slate-500 mb-6">
            Entre em contato com o administrador para vincular seus dados médicos.
          </p>
          <Button 
            onClick={logout}
            variant="outline"
            className="w-full"
          >
            Sair
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 backdrop-blur-lg bg-card/80">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-xl flex items-center justify-center">
                <Microscope className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Health Monitor</h1>
                <p className="text-sm text-muted-foreground">Análise de Saúde Personalizada</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Paciente</p>
              <p className="text-lg font-semibold text-foreground">{patient.name}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Dados Antropométricos - Compacto */}
        <div className="mb-8">
          <AnthropometricCard 
            data={{
              weight: parseFloat(patient.weight?.toString() || '0'),
              height: parseInt(patient.height?.toString() || '0'),
              waist: parseInt(patient.waist?.toString() || '0'),
              bmi: parseFloat(patient.bmi?.toString() || '0')
            }}
          />
        </div>

        {/* Indicador de Período */}
        <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-xl">
          <p className="text-sm text-foreground">
            <strong>📊 Dados de 2026:</strong> Mostrando apenas exames do ano vigente. Para visualizar histórico completo (2022-2026), acesse a página de Histórico Completo.
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Total Exames de 2026 */}
          <Card className="p-6 bg-card border-border hover:shadow-lg transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Exames em 2026</p>
                <p className="text-3xl font-bold text-foreground">{totalExams2026}</p>
              </div>
              <Microscope className="w-10 h-10 text-primary opacity-20" />
            </div>
          </Card>

          {/* Normais */}
          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-400 mb-1">Normais</p>
                <p className="text-3xl font-bold text-green-300">{normalExams}</p>
              </div>
              <div className="text-3xl">✅</div>
            </div>
          </Card>

          {/* Anormais */}
          <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-400 mb-1">Anormais</p>
                <p className="text-3xl font-bold text-yellow-300">{abnormalExams}</p>
              </div>
              <div className="text-3xl">⚠️</div>
            </div>
          </Card>

          {/* Críticos */}
          <Card className="p-6 bg-gradient-to-br from-red-500/10 to-rose-500/10 border-red-500/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-400 mb-1">Críticos</p>
                <p className="text-3xl font-bold text-red-300">{criticalExams.length}</p>
              </div>
              <div className="text-3xl">🔴</div>
            </div>
          </Card>
        </div>

        {/* Critical Alerts */}
        {criticalExams.length > 0 && (
          <Card className="p-6 mb-8 bg-gradient-to-r from-red-500/10 to-rose-500/10 border-red-500/20">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-bold text-red-300 mb-2">⚠️ Alertas Críticos</h3>
                <div className="space-y-2">
                  {criticalExams.map(exam => (
                    <p key={exam.id} className="text-sm text-red-200">
                      <strong>{exam.examName}</strong>: {exam.value} {exam.unit} (Alto)
                    </p>
                  ))}
                </div>
                <p className="text-xs text-red-300 mt-3">⚠️ Acompanhamento recomendado</p>
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

          {/* Correlações de Exames */}
          <Card 
            className="p-8 bg-white border-slate-200 hover:shadow-lg transition cursor-pointer group"
            onClick={() => navigate('/correlations')}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition">
                <Network className="w-6 h-6 text-indigo-600" />
              </div>
              <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Correlações de Exames</h3>
            <p className="text-sm text-slate-600 mb-4">
              Análises automáticas que identificam padrões entre exames realizados no mesmo período
            </p>
            <Button className="w-full" variant="outline">
              Ver Correlações
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
          
          <div className="space-y-3">
            {latestExams.map(exam => (
              <div key={exam.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{exam.examName}</p>
                  <p className="text-sm text-slate-600">{new Date(exam.date).toLocaleDateString('pt-BR')}</p>
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
        </Card>
      </main>
    </div>
  );
}
