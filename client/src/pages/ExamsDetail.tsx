import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExamChart } from '@/components/ExamChart';
import { ArrowLeft, Search, Loader2, Info } from 'lucide-react';
import { DownloadExams } from '@/components/DownloadExams';
import { trpc } from '@/lib/trpc';

// Descricoes dos exames
const examDescriptions: Record<string, { description: string; importance: string; interpretation: string }> = {
  'VITAMINA B12': {
    description: 'Vitamina essencial para formacao de globulos vermelhos e funcao neurologica. Importante para energia e memoria.',
    importance: 'Deficiencia pode causar anemia, fadiga e problemas neurologicos.',
    interpretation: 'Valores baixos indicam deficiencia; valores altos sao raros e geralmente nao prejudiciais.'
  },
  'FERRO SERICO': {
    description: 'Mineral essencial para transportar oxigenio no sangue. Componente chave da hemoglobina.',
    importance: 'Deficiencia causa anemia e fadiga; excesso pode danificar orgaos.',
    interpretation: 'Valores baixos indicam anemia; valores altos podem indicar sobrecarga de ferro.'
  },
  'COLESTEROL TOTAL': {
    description: 'Gordura no sangue essencial para producao de hormonio e vitamina D. Indicador importante de saude cardiovascular.',
    importance: 'Niveis altos aumentam risco de doenca cardiaca e acidente vascular cerebral.',
    interpretation: 'Ideal manter abaixo de 200 mg/dL. Valores altos requerem mudancas no estilo de vida ou medicacao.'
  },
  'GLICOSE JEJUM': {
    description: 'Nivel de acucar no sangue apos 8-12 horas sem comer. Indicador principal de metabolismo de carboidratos.',
    importance: 'Valores altos indicam risco de diabetes; valores baixos podem causar tontura e confusao.',
    interpretation: 'Normal: 70-100 mg/dL; Pre-diabetes: 100-125 mg/dL; Diabetes: acima de 126 mg/dL.'
  },
  'CREATININA': {
    description: 'Produto do metabolismo muscular filtrado pelos rins. Indicador da funcao renal.',
    importance: 'Valores altos indicam problemas renais; valores baixos sao raros e geralmente nao significativos.',
    interpretation: 'Niveis normais indicam rins funcionando bem. Aumento gradual pode indicar declinio renal.'
  },
  'TSH ULTRA SENSIVEL': {
    description: 'Hormonio que controla a tireoide. Regulador do metabolismo, energia e temperatura corporal.',
    importance: 'Descontrole da tireoide afeta metabolismo, peso e energia.',
    interpretation: 'Valores altos indicam hipotireoidismo; valores baixos indicam hipertireoidismo.'
  },
  'COLESTEROL HDL': {
    description: 'Colesterol "bom" que remove gordura das arterias. Protege contra doenca cardiaca.',
    importance: 'Niveis altos sao protetores; niveis baixos aumentam risco cardiovascular.',
    interpretation: 'Quanto mais alto, melhor. Ideal acima de 40 mg/dL para homens, 50 mg/dL para mulheres.'
  },
  'COLESTEROL LDL': {
    description: 'Colesterol "ruim" que se acumula nas arterias. Principal fator de risco para doenca cardiaca.',
    importance: 'Niveis altos aumentam significativamente o risco de infarto e AVC.',
    interpretation: 'Quanto mais baixo, melhor. Ideal abaixo de 100 mg/dL; otimo abaixo de 70 mg/dL.'
  }
};

export default function ExamsDetail() {
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExamName, setSelectedExamName] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'normal' | 'abnormal' | 'critical'>('all');
  const [selectedYears, setSelectedYears] = useState<number[]>([2026]); // Por padrão, mostrar 2026

  // Carregar APENAS exames de 2026 (ano vigente)
  const { data: exams = [], isLoading } = trpc.exams.listByPatientAndPeriod.useQuery({
    patientId: 'denis-santos',
    year: 2026
  });

  // Carregar historico do exame selecionado
  const { data: examHistory = [] } = trpc.exams.getHistory.useQuery(
    {
      patientId: 'denis-santos',
      examName: selectedExamName || ''
    },
    {
      enabled: !!selectedExamName
    }
  );

  // Filtrar historico por anos selecionados
  const filteredExamHistory = examHistory.filter(exam => {
    const year = new Date(exam.date).getFullYear();
    return selectedYears.includes(year);
  });

  // Funcao para calcular o status do exame
  const getExamStatus = (exam: typeof exams[0]): 'normal' | 'abnormal' | 'critical' => {
    const value = typeof exam.value === 'number' ? exam.value : parseFloat(String(exam.value));
    const min = typeof exam.referenceMin === 'number' ? exam.referenceMin : parseFloat(String(exam.referenceMin));
    const max = typeof exam.referenceMax === 'number' ? exam.referenceMax : parseFloat(String(exam.referenceMax));

    if (!min || !max) return 'normal';

    if (value < min || value > max) {
      const rangeSize = (max - min) || 1;
      const deviation = value < min ? min - value : value - max;
      return deviation > rangeSize * 0.2 ? 'critical' : 'abnormal';
    }
    return 'normal';
  };

  // Agrupar por nome de exame
  const examsByName = exams.reduce((acc, exam) => {
    const name = exam.examName;
    if (!acc[name]) {
      acc[name] = [];
    }
    acc[name].push(exam);
    return acc;
  }, {} as Record<string, typeof exams>);

  // Filtrar por busca e status
  const filteredExams = Object.entries(examsByName).filter(([name]) => {
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
    if (statusFilter === 'all') return matchesSearch;
    
    const exam = examsByName[name][examsByName[name].length - 1];
    const status = getExamStatus(exam);
    return matchesSearch && status === statusFilter;
  });

  const selectedExam = selectedExamName ? examsByName[selectedExamName] : null;
  const selectedExamData = selectedExam ? selectedExam[selectedExam.length - 1] : null;

  const examsWithHistory = selectedExam ? selectedExam.filter(e => {
    return filteredExamHistory.length > 1;
  }) : [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-slate-600">Carregando exames...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">

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
          <h1 className="text-2xl font-bold text-slate-900">Exames Detalhados</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Indicador de Periodo */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Dados de 2026:</strong> Exibindo apenas exames do ano vigente. Selecione um exame para ver o historico completo de evolucao.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Exames */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white border-slate-200 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Exames ({filteredExams.length})</h2>
              
              {/* Filtros de Status */}
              <div className="mb-4 flex gap-2 flex-wrap">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    statusFilter === 'all'
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setStatusFilter('normal')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    statusFilter === 'normal'
                      ? 'bg-green-600 text-white'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  ✓ Normais
                </button>
                <button
                  onClick={() => setStatusFilter('abnormal')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    statusFilter === 'abnormal'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  }`}
                >
                  ⚠ Anormais
                </button>
                <button
                  onClick={() => setStatusFilter('critical')}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                    statusFilter === 'critical'
                      ? 'bg-red-600 text-white'
                      : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
                >
                  🔴 Criticos
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar exame..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Exam List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredExams.map(([name]) => {
                  const exam = examsByName[name][examsByName[name].length - 1];
                  const status = getExamStatus(exam);
                  const statusColors = {
                    normal: 'bg-green-50 border-green-200 hover:bg-green-100',
                    abnormal: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
                    critical: 'bg-red-50 border-red-200 hover:bg-red-100'
                  };
                  const statusIcons = {
                    normal: '✓',
                    abnormal: '⚠',
                    critical: '🔴'
                  };

                  return (
                    <button
                      key={name}
                      onClick={() => setSelectedExamName(name)}
                      className={`w-full text-left p-3 rounded-lg transition border ${
                        selectedExamName === name
                          ? 'bg-blue-100 border-2 border-blue-500 text-blue-900'
                          : `border-slate-200 text-slate-700 ${statusColors[status]}`
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{name}</p>
                          <p className="text-xs text-slate-600 mt-1">
                            {examsByName[name].length} coleta{examsByName[name].length > 1 ? 's' : ''}
                          </p>
                        </div>
                        <span className="text-lg ml-2">{statusIcons[status]}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Detalhes do Exame */}
          <div className="lg:col-span-2 space-y-6">
            {selectedExamData ? (
              <>
                {/* Header com Titulo */}
                <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{selectedExamData.examName}</h3>
                      <p className="text-sm text-slate-600 mt-1">{selectedExamData.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-blue-600">
                        {selectedExamData?.value}
                      </p>
                      <p className="text-sm text-slate-600">{selectedExamData?.unit}</p>
                    </div>
                  </div>
                </Card>

                {/* Box Descritivo */}
                {examDescriptions[selectedExamData.examName] && (
                  <Card className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
                    <div className="flex gap-4">
                      <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h4 className="font-bold text-indigo-900 mb-2">O que e este exame?</h4>
                        <p className="text-sm text-indigo-800 mb-3">
                          {examDescriptions[selectedExamData.examName].description}
                        </p>
                        <p className="text-sm text-indigo-800 mb-2">
                          <strong>Importancia:</strong> {examDescriptions[selectedExamData.examName].importance}
                        </p>
                        <p className="text-sm text-indigo-800">
                          <strong>Interpretacao:</strong> {examDescriptions[selectedExamData.examName].interpretation}
                        </p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Faixa de Referencia */}
                {(selectedExamData.referenceMin || selectedExamData.referenceMax) && (
                  <Card className="p-6 bg-white border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-4">Faixa de Referencia</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedExamData.referenceMin && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-xs text-green-700 mb-1">Minimo</p>
                          <p className="text-2xl font-bold text-green-900">{selectedExamData.referenceMin}</p>
                        </div>
                      )}
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700 mb-1">Atual</p>
                        <p className="text-2xl font-bold text-blue-900">{selectedExamData?.value}</p>
                      </div>
                      {selectedExamData.referenceMax && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-xs text-green-700 mb-1">Maximo</p>
                          <p className="text-2xl font-bold text-green-900">{selectedExamData.referenceMax}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Filtro de Anos */}
                {examHistory.length > 0 && (
                  <Card className="p-6 bg-white border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-4">Filtrar por Anos</h4>
                    <div className="flex flex-wrap gap-3">
                      {[2022, 2023, 2024, 2025, 2026].map(year => {
                        const hasDataForYear = examHistory.some(exam => new Date(exam.date).getFullYear() === year);
                        if (!hasDataForYear) return null;
                        return (
                          <button
                            key={year}
                            onClick={() => {
                              setSelectedYears(prev => 
                                prev.includes(year)
                                  ? prev.filter(y => y !== year)
                                  : [...prev, year]
                              );
                            }}
                            className={`px-4 py-2 rounded-lg font-medium transition ${
                              selectedYears.includes(year)
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {year}
                          </button>
                        );
                      })}
                    </div>
                  </Card>
                )}

                {/* Grafico Temporal */}
                <Card className="p-6 bg-white border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-4">Evolucao Temporal ({selectedYears.join(', ')})</h4>
                  {filteredExamHistory.length > 0 ? (
                    <ExamChart 
                      data={filteredExamHistory}
                      examName={selectedExamName || ''}
                      unit={selectedExamData?.unit || ''}
                    />
                  ) : (
                    <p className="text-center text-slate-500 py-8">Sem dados historicos disponiveis</p>
                  )}
                </Card>

                {/* Historico Detalhado */}
                <Card className="p-6 bg-white border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-4">Historico Completo</h4>
                  <div className="space-y-3">
                    {filteredExamHistory.length > 0 ? (
                      filteredExamHistory
                        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                        .map((exam, idx) => {
                          const value = typeof exam.value === 'number' ? exam.value : parseFloat(String(exam.value));
                          const prevValue = idx < filteredExamHistory.length - 1 
                            ? (typeof filteredExamHistory[idx + 1].value === 'number' 
                                ? filteredExamHistory[idx + 1].value 
                                : parseFloat(String(filteredExamHistory[idx + 1].value)))
                            : null;
                          
                          return (
                            <div key={exam.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                              <div className="flex-1">
                                <p className="font-medium text-slate-900">
                                  {new Date(exam.date).toLocaleDateString('pt-BR')}
                                </p>
                                <p className="text-sm text-slate-600 mt-1">
                                  {exam.value} {exam.unit}
                                  {exam.referenceMin && exam.referenceMax && (
                                    <span className="ml-2 text-xs text-slate-500">
                                      (Ref: {exam.referenceMin}-{exam.referenceMax})
                                    </span>
                                  )}
                                </p>
                              </div>
                              <div className="flex items-center gap-3">
                                {prevValue !== null && typeof prevValue === 'number' && (
                                  <div className="text-xs text-slate-600">
                                    {value > prevValue ? (
                                      <span className="text-red-600">↑ +{(value - prevValue).toFixed(2)}</span>
                                    ) : value < prevValue ? (
                                      <span className="text-green-600">↓ -{(prevValue - value).toFixed(2)}</span>
                                    ) : (
                                      <span className="text-gray-600">→ Estavel</span>
                                    )}
                                  </div>
                                )}
                                {exam.status === 'normal' && <span className="text-lg">✅</span>}
                                {exam.status === 'low' && <span className="text-lg">⬇️</span>}
                                {exam.status === 'high' && <span className="text-lg">⬆️</span>}
                              </div>
                            </div>
                          );
                        })
                    ) : (
                      <p className="text-center text-slate-500 py-8">Nenhum historico disponivel</p>
                    )}
                  </div>
                </Card>
              </>
            ) : (
              <Card className="p-12 bg-white border-slate-200 text-center">
                <p className="text-slate-600">Selecione um exame para ver detalhes</p>
              </Card>
            )}

            {/* Download */}
            <DownloadExams />
          </div>
        </div>
      </main>
    </div>
  );
}
