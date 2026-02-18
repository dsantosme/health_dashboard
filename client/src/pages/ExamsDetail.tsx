import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { usePatient } from '@/contexts/PatientContext';
import { getPatientExams } from '@/data/patientsData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, ReferenceLine } from 'recharts';
import { ArrowLeft, Search } from 'lucide-react';
import { DownloadExams } from '@/components/DownloadExams';

export default function ExamsDetail() {
  const [, navigate] = useLocation();
  const { selectedPatientId } = usePatient();
  const exams = getPatientExams(selectedPatientId);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExamName, setSelectedExamName] = useState<string | null>(null);

  // Agrupar por nome de exame
  const examsByName = exams.reduce((acc, exam) => {
    if (!acc[exam.name]) {
      acc[exam.name] = [];
    }
    acc[exam.name].push(exam);
    return acc;
  }, {} as Record<string, typeof exams>);

  // Filtrar por busca
  const filteredExams = Object.entries(examsByName).filter(([name]) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedExam = selectedExamName ? examsByName[selectedExamName] : null;
  const selectedExamData = selectedExam ? selectedExam[0] : null;

  // Preparar dados para gráfico
  const chartData = selectedExam
    ? selectedExam
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(e => ({
          date: e.date,
          value: typeof e.value === 'number' ? e.value : 0,
          referenceMin: e.referenceMin,
          referenceMax: e.referenceMax
        }))
    : [];

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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Exames */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-white border-slate-200 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-4">Exames ({filteredExams.length})</h2>
              
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
                {filteredExams.map(([name]) => (
                  <button
                    key={name}
                    onClick={() => setSelectedExamName(name)}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedExamName === name
                        ? 'bg-blue-100 border-2 border-blue-500 text-blue-900'
                        : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <p className="font-medium text-sm">{name}</p>
                    <p className="text-xs text-slate-600 mt-1">
                      {examsByName[name].length} coleta{examsByName[name].length > 1 ? 's' : ''}
                    </p>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Detalhes do Exame */}
          <div className="lg:col-span-2 space-y-6">
            {selectedExamData ? (
              <>
                {/* Header */}
                <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{selectedExamData.name}</h3>
                      <p className="text-sm text-slate-600 mt-1">{selectedExamData.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-blue-600">
                        {selectedExam?.[selectedExam.length - 1]?.value}
                      </p>
                      <p className="text-sm text-slate-600">{selectedExamData.unit}</p>
                    </div>
                  </div>
                </Card>

                {/* Faixa de Referência */}
                {(selectedExamData.referenceMin || selectedExamData.referenceMax) && (
                  <Card className="p-6 bg-white border-slate-200">
                    <h4 className="font-bold text-slate-900 mb-4">Faixa de Referência</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedExamData.referenceMin && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-xs text-green-700 mb-1">Mínimo</p>
                          <p className="text-2xl font-bold text-green-900">{selectedExamData.referenceMin}</p>
                        </div>
                      )}
                      <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-700 mb-1">Atual</p>
                        <p className="text-2xl font-bold text-blue-900">{selectedExam?.[selectedExam.length - 1]?.value}</p>
                      </div>
                      {selectedExamData.referenceMax && (
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-xs text-green-700 mb-1">Máximo</p>
                          <p className="text-2xl font-bold text-green-900">{selectedExamData.referenceMax}</p>
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Gráfico Temporal */}
                <Card className="p-6 bg-white border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-4">Evolução Temporal</h4>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="date" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}
                        formatter={(value) => [`${value} ${selectedExamData.unit}`, 'Valor']}
                      />
                      {selectedExamData.referenceMin && (
                        <ReferenceLine
                          y={selectedExamData.referenceMin}
                          stroke="#10b981"
                          strokeDasharray="5 5"
                          label={{ value: 'Mín', position: 'right', fill: '#10b981' }}
                        />
                      )}
                      {selectedExamData.referenceMax && (
                        <ReferenceLine
                          y={selectedExamData.referenceMax}
                          stroke="#10b981"
                          strokeDasharray="5 5"
                          label={{ value: 'Máx', position: 'right', fill: '#10b981' }}
                        />
                      )}
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ fill: '#3b82f6', r: 5 }}
                        activeDot={{ r: 7 }}
                        name="Valor"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                {/* Histórico Detalhado */}
                <Card className="p-6 bg-white border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-4">Histórico Completo</h4>
                  <div className="space-y-3">
                    {selectedExam
                      ?.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((exam, idx) => (
                        <div key={exam.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-slate-900">{exam.date}</p>
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
                            {idx < selectedExam.length - 1 && (
                              <div className="text-xs text-slate-600">
                                {typeof exam.value === 'number' && typeof selectedExam[idx + 1]?.value === 'number' ? (
                                  (exam.value as number) > (selectedExam[idx + 1].value as number) ? (
                                    <span className="text-red-600">↑ +{((exam.value as number) - (selectedExam[idx + 1].value as number)).toFixed(2)}</span>
                                  ) : (exam.value as number) < (selectedExam[idx + 1].value as number) ? (
                                    <span className="text-green-600">↓ -{((selectedExam[idx + 1].value as number) - (exam.value as number)).toFixed(2)}</span>
                                  ) : (
                                    <span className="text-gray-600">→ Estável</span>
                                  )
                                ) : null}
                              </div>
                            )}
                            {exam.status === 'normal' && <span className="text-lg">✅</span>}
                            {exam.status === 'low' && <span className="text-lg">⬇️</span>}
                            {exam.status === 'high' && <span className="text-lg">⬆️</span>}
                            {exam.status === 'critical' && <span className="text-lg">🔴</span>}
                          </div>
                        </div>
                      ))}
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
