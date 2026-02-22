import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ExamChart } from '@/components/ExamChart';
import { ArrowLeft, Search, Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { DownloadExams } from '@/components/DownloadExams';
import { trpc } from '@/lib/trpc';
import { useCurrentPatient } from '@/hooks/useCurrentPatient';
import { getExamIcon } from '@/components/ExamIcons';
import { CorrelationSection } from '@/components/CorrelationSection';
import { MedicalAnalysisSection } from '@/components/MedicalAnalysisSection';

// Descrições dos exames
const examDescriptions: Record<string, { description: string; importance: string; interpretation: string }> = {
  'VITAMINA B12': {
    description: 'Vitamina essencial para formação de glóbulos vermelhos e função neurológica. Importante para energia e memória.',
    importance: 'Deficiência pode causar anemia, fadiga e problemas neurológicos.',
    interpretation: 'Valores baixos indicam deficiência; valores altos são raros e geralmente não prejudiciais.'
  },
  'FERRO SERICO': {
    description: 'Mineral essencial para transportar oxigênio no sangue. Componente chave da hemoglobina.',
    importance: 'Deficiência causa anemia e fadiga; excesso pode danificar órgãos.',
    interpretation: 'Valores baixos indicam anemia; valores altos podem indicar sobrecarga de ferro.'
  },
  'COLESTEROL TOTAL': {
    description: 'Gordura no sangue essencial para produção de hormônio e vitamina D. Indicador importante de saúde cardiovascular.',
    importance: 'Níveis altos aumentam risco de doença cardíaca e acidente vascular cerebral.',
    interpretation: 'Ideal manter abaixo de 200 mg/dL. Valores altos requerem mudanças no estilo de vida ou medicação.'
  },
  'GLICOSE JEJUM': {
    description: 'Nível de açúcar no sangue após 8-12 horas sem comer. Indicador principal de metabolismo de carboidratos.',
    importance: 'Valores altos indicam risco de diabetes; valores baixos podem causar tontura e confusão.',
    interpretation: 'Normal: 70-100 mg/dL; Pré-diabetes: 100-125 mg/dL; Diabetes: acima de 126 mg/dL.'
  },
  'CREATININA': {
    description: 'Produto do metabolismo muscular filtrado pelos rins. Indicador da função renal.',
    importance: 'Valores altos indicam problemas renais; valores baixos são raros e geralmente não significativos.',
    interpretation: 'Níveis normais indicam rins funcionando bem. Aumento gradual pode indicar declínio renal.'
  },
  'TSH ULTRA SENSIVEL': {
    description: 'Hormônio que controla a tireoide. Regulador do metabolismo, energia e temperatura corporal.',
    importance: 'Descontrole da tireoide afeta metabolismo, peso e energia.',
    interpretation: 'Valores altos indicam hipotireoidismo; valores baixos indicam hipertireoidismo.'
  },
  'COLESTEROL HDL': {
    description: 'Colesterol "bom" que remove gordura das artérias. Protege contra doença cardíaca.',
    importance: 'Níveis altos são protetores; níveis baixos aumentam risco cardiovascular.',
    interpretation: 'Quanto mais alto, melhor. Ideal acima de 40 mg/dL para homens, 50 mg/dL para mulheres.'
  },
  'COLESTEROL LDL': {
    description: 'Colesterol "ruim" que se acumula nas artérias. Principal fator de risco para doença cardíaca.',
    importance: 'Níveis altos aumentam significativamente o risco de infarto e AVC.',
    interpretation: 'Quanto mais baixo, melhor. Ideal abaixo de 100 mg/dL; ótimo abaixo de 70 mg/dL.'
  }
};

export default function ExamsDetail() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExamName, setSelectedExamName] = useState<string | null>(null);
  const [selectedExamsForAnalysis, setSelectedExamsForAnalysis] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'normal' | 'abnormal' | 'critical'>('all');
  const { patientId } = useCurrentPatient();
  const detailsRef = useRef<HTMLDivElement>(null);

  // Scroll automático para detalhes ao selecionar exame
  useEffect(() => {
    if (selectedExamName && detailsRef.current) {
      detailsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [selectedExamName]);

  // Carregar APENAS exames de 2026 (ano vigente)
  const { data: exams = [], isLoading } = trpc.exams.listByPatientAndPeriod.useQuery(
    {
      patientId: patientId!,
      year: 2026
    },
    {
      enabled: !!patientId,
    }
  );

  // Carregar histórico do exame selecionado
  const { data: examHistory = [] } = trpc.exams.getHistory.useQuery(
    {
      patientId: patientId!,
      examName: selectedExamName || ''
    },
    {
      enabled: !!selectedExamName && !!patientId
    }
  );

  // Função para calcular o status do exame
  const getExamStatus = (exam: typeof exams[0]): 'normal' | 'abnormal' | 'critical' => {
    const value = typeof exam.value === 'number' ? exam.value : parseFloat(String(exam.value));
    const min = typeof exam.referenceMin === 'number' ? exam.referenceMin : parseFloat(String(exam.referenceMin));
    const max = typeof exam.referenceMax === 'number' ? exam.referenceMax : parseFloat(String(exam.referenceMax));

    if (!min || !max) return 'normal';

    if (value < min || value > max) {
      const rangeSize = (max - min) || 1;
      const deviation = Math.abs(value < min ? (min - value) : (value - max));
      const deviationPercent = (deviation / rangeSize) * 100;
      
      if (deviationPercent > 50) return 'critical';
      return 'abnormal';
    }
    
    return 'normal';
  };

  // Agrupar exames por nome (pegar apenas o mais recente)
  const latestExams = exams.reduce((acc, exam) => {
    const existing = acc.find(e => e.examName === exam.examName);
    if (!existing || new Date(exam.date) > new Date(existing.date)) {
      return [...acc.filter(e => e.examName !== exam.examName), exam];
    }
    return acc;
  }, [] as typeof exams);

  // Filtrar exames
  const filteredExams = latestExams.filter(exam => {
    const matchesSearch = exam.examName.toLowerCase().includes(searchTerm.toLowerCase());
    const status = getExamStatus(exam);
    const matchesStatus = statusFilter === 'all' || status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Contar status
  const statusCounts = {
    all: latestExams.length,
    normal: latestExams.filter(e => getExamStatus(e) === 'normal').length,
    abnormal: latestExams.filter(e => getExamStatus(e) === 'abnormal').length,
    critical: latestExams.filter(e => getExamStatus(e) === 'critical').length
  };

  // Calcular tendência do exame selecionado
  const getTrend = () => {
    if (examHistory.length < 2) return null;
    const sorted = [...examHistory].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latest = typeof sorted[0].value === 'number' ? sorted[0].value : parseFloat(String(sorted[0].value));
    const previous = typeof sorted[1].value === 'number' ? sorted[1].value : parseFloat(String(sorted[1].value));
    const diff = latest - previous;
    const percentChange = ((diff / previous) * 100).toFixed(1);
    
    if (Math.abs(diff) < 0.01) return { type: 'stable', text: 'Estável', percent: '0.0' };
    if (diff > 0) return { type: 'up', text: 'Aumento', percent: `+${percentChange}` };
    return { type: 'down', text: 'Redução', percent: percentChange };
  };

  const trend = getTrend();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="text-foreground"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Exames Detalhados</h1>
              <p className="text-sm text-muted-foreground">Ano vigente: 2026</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container py-6 space-y-6">
        {/* Filtros e Busca */}
        <Card className="p-6 bg-card border-border">
          <div className="space-y-4">
            {/* Status Filters */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={statusFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('all')}
                className={statusFilter === 'all' ? '' : 'bg-transparent text-foreground border-border'}
              >
                Todos ({statusCounts.all})
              </Button>
              <Button
                variant={statusFilter === 'normal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('normal')}
                className={statusFilter === 'normal' ? 'bg-green-500 hover:bg-green-600' : 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20'}
              >
                ✓ Normais ({statusCounts.normal})
              </Button>
              <Button
                variant={statusFilter === 'abnormal' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('abnormal')}
                className={statusFilter === 'abnormal' ? 'bg-yellow-500 hover:bg-yellow-600' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20'}
              >
                ⚠ Anormais ({statusCounts.abnormal})
              </Button>
              <Button
                variant={statusFilter === 'critical' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter('critical')}
                className={statusFilter === 'critical' ? 'bg-red-500 hover:bg-red-600' : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'}
              >
                ● Críticos ({statusCounts.critical})
              </Button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar exame..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-background border-border text-foreground"
              />
            </div>
          </div>
        </Card>

        {/* Lista de Exames */}
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {filteredExams.map((exam) => {
            const status = getExamStatus(exam);
            const Icon = getExamIcon(exam.examName);
            const isSelected = selectedExamName === exam.examName;
            
            return (
              <Card
                key={exam.id}
                className={`p-4 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-primary/10 border-primary'
                    : 'bg-card border-border hover:border-primary/50'
                }`}
                onClick={() => setSelectedExamName(exam.examName)}
              >
                <div className="flex items-center gap-4">
                  {/* Ícone */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    status === 'normal' ? 'bg-green-500/10 text-green-400' :
                    status === 'abnormal' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-red-500/10 text-red-400'
                  }`}>
                    <Icon size={24} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-tight">{exam.examName}</h3>
                    <p className="text-xs text-muted-foreground">
                      {new Date(exam.date).toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  {/* Valor e Status */}
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">
                      {(() => {
                        const val = typeof exam.value === 'number' ? exam.value : parseFloat(String(exam.value));
                        return isNaN(val) ? exam.value : val.toFixed(2);
                      })()} {exam.unit}
                    </p>
                    <div className="flex items-center justify-end gap-1">
                      {status === 'normal' && <span className="text-xs text-green-400">✓ Normal</span>}
                      {status === 'abnormal' && <span className="text-xs text-yellow-400">⚠ Anormal</span>}
                      {status === 'critical' && <span className="text-xs text-red-400">● Crítico</span>}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}

          {filteredExams.length === 0 && (
            <Card className="p-8 bg-card border-border text-center">
              <p className="text-muted-foreground">Nenhum exame encontrado</p>
            </Card>
          )}
        </div>

        {/* Detalhes do Exame Selecionado */}
        {selectedExamName && (
          <Card ref={detailsRef} className="p-6 bg-card border-border space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">{selectedExamName}</h2>
                {trend && (
                  <div className="flex items-center gap-2 mt-2">
                    {trend.type === 'up' && <TrendingUp className="w-4 h-4 text-red-400" />}
                    {trend.type === 'down' && <TrendingDown className="w-4 h-4 text-green-400" />}
                    {trend.type === 'stable' && <Minus className="w-4 h-4 text-muted-foreground" />}
                    <span className={`text-sm font-medium ${
                      trend.type === 'up' ? 'text-red-400' :
                      trend.type === 'down' ? 'text-green-400' :
                      'text-muted-foreground'
                    }`}>
                      {trend.text} {trend.percent}%
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Descrição */}
            {examDescriptions[selectedExamName] && (
              <div className="space-y-3 p-4 bg-background/50 rounded-xl">
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">📋 O que é este exame?</h3>
                  <p className="text-sm text-muted-foreground">{examDescriptions[selectedExamName].description}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">⚠️ Importância</h3>
                  <p className="text-sm text-muted-foreground">{examDescriptions[selectedExamName].importance}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-1">🔍 Interpretação</h3>
                  <p className="text-sm text-muted-foreground">{examDescriptions[selectedExamName].interpretation}</p>
                </div>
              </div>
            )}

            {/* Análise de Correlações */}
            <CorrelationSection 
              patientId={patientId!} 
              examName={selectedExamName}
              onExamsSelected={(exams) => setSelectedExamsForAnalysis(exams)}
            />

            {/* Análise Médica Detalhada */}
            <MedicalAnalysisSection 
              patientId={patientId!} 
              examNames={selectedExamsForAnalysis.length > 0 ? selectedExamsForAnalysis : [selectedExamName]}
              correlationDate={exams.find(e => e.examName === selectedExamName)?.date?.toString()}
            />

            {/* Gráfico */}
            {examHistory.length > 0 && (
              <ExamChart
                data={examHistory}
                examName={selectedExamName}
                unit={examHistory[0]?.unit || ''}
                referenceMin={examHistory[0]?.referenceMin ? parseFloat(String(examHistory[0].referenceMin)) : undefined}
                referenceMax={examHistory[0]?.referenceMax ? parseFloat(String(examHistory[0].referenceMax)) : undefined}
              />
            )}
          </Card>
        )}

        {/* Download */}
        <DownloadExams />
      </main>
    </div>
  );
}
