import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { allExamsData, examCategories, anthropometricData } from '@/data/allExamsData';
import { examsData } from '@/data/examsData';
import { AlertCircle, TrendingDown, TrendingUp, Info } from 'lucide-react';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'normal':
      return 'bg-green-100 text-green-800';
    case 'low':
      return 'bg-orange-100 text-orange-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'critical':
      return 'bg-red-100 text-red-800';
    case 'unknown':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'normal':
      return '✅ Normal';
    case 'low':
      return '⬇️ Abaixo do Normal';
    case 'high':
      return '⬆️ Acima do Normal';
    case 'critical':
      return '🚨 Crítico';
    case 'unknown':
      return '❓ Sem Referência';
    default:
      return status;
  }
};

export function ExamNavigator() {
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('Metabolismo de Glicose');

  const filteredExams = allExamsData.filter(exam => exam.category === selectedCategory);
  const selectedExamData = selectedExam ? allExamsData.find(e => e.id === selectedExam) : null;
  const selectedExamDetail = selectedExam ? examsData.find(e => e.id === selectedExam) : null;

  return (
    <div className="w-full space-y-6">
      {/* Dados Antropométricos */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <h2 className="text-2xl font-bold mb-4">Dados Antropométricos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {anthropometricData.map((data, idx) => (
            <div key={idx} className="space-y-2">
              <div className="text-sm text-gray-600">Peso</div>
              <div className="text-3xl font-bold text-red-600">{data.weight} kg</div>
              <div className="text-xs text-gray-500">Meta: 82 kg</div>
            </div>
          ))}
          {anthropometricData.map((data, idx) => (
            <div key={`height-${idx}`} className="space-y-2">
              <div className="text-sm text-gray-600">Altura</div>
              <div className="text-3xl font-bold text-blue-600">{data.height} cm</div>
            </div>
          ))}
          {anthropometricData.map((data, idx) => (
            <div key={`waist-${idx}`} className="space-y-2">
              <div className="text-sm text-gray-600">Circunferência Abdominal</div>
              <div className="text-3xl font-bold text-orange-600">{data.waistCircumference} cm</div>
              <div className="text-xs text-gray-500">Meta: 85 cm</div>
            </div>
          ))}
          {anthropometricData.map((data, idx) => (
            <div key={`bmi-${idx}`} className="space-y-2">
              <div className="text-sm text-gray-600">IMC</div>
              <div className="text-3xl font-bold text-red-600">{data.bmi}</div>
              <div className="text-xs text-red-500">{data.bmiStatus}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Navegação de Exames */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Navegação de Exames</h2>

        {/* Tabs de Categorias */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 w-full">
            {examCategories.map(category => (
              <TabsTrigger key={category} value={category} className="text-xs md:text-sm">
                {category.split(' ')[0]}
              </TabsTrigger>
            ))}
          </TabsList>

          {examCategories.map(category => (
            <TabsContent key={category} value={category} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allExamsData
                  .filter(exam => exam.category === category)
                  .map(exam => (
                    <Card
                      key={exam.id}
                      className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                        selectedExam === exam.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedExam(exam.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-sm">{exam.name}</h3>
                        <Badge className={getStatusColor(exam.status)}>
                          {getStatusLabel(exam.status)}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 text-sm">Valor:</span>
                          <span className="font-bold text-lg">
                            {exam.currentValue !== null ? exam.currentValue : 'N/A'} {exam.unit}
                          </span>
                        </div>

                        {exam.referenceMin !== undefined && exam.referenceMax !== undefined && (
                          <div className="text-xs text-gray-500">
                            Referência: {exam.referenceMin} - {exam.referenceMax} {exam.unit}
                          </div>
                        )}

                        {exam.referenceText && (
                          <div className="text-xs text-gray-500">
                            {exam.referenceText}
                          </div>
                        )}

                        <div className="text-xs text-gray-400 mt-2">
                          Coleta: {exam.collectionDate}
                        </div>
                      </div>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Detalhes do Exame Selecionado */}
      {selectedExamData && selectedExamDetail && (
        <Card className="p-6 border-2 border-blue-500">
          <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-bold">{selectedExamData.name}</h2>
                <p className="text-gray-600">{selectedExamData.category}</p>
              </div>
              <Badge className={`${getStatusColor(selectedExamData.status)} text-lg px-4 py-2`}>
                {getStatusLabel(selectedExamData.status)}
              </Badge>
            </div>

            {/* Valor Atual */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Valor Atual</div>
                  <div className="text-3xl font-bold">
                    {selectedExamData.currentValue} {selectedExamData.unit}
                  </div>
                </div>
                {selectedExamData.referenceMin !== undefined && (
                  <div>
                    <div className="text-sm text-gray-600">Mínimo</div>
                    <div className="text-2xl font-semibold text-green-600">
                      {selectedExamData.referenceMin}
                    </div>
                  </div>
                )}
                {selectedExamData.referenceMax !== undefined && (
                  <div>
                    <div className="text-sm text-gray-600">Máximo</div>
                    <div className="text-2xl font-semibold text-green-600">
                      {selectedExamData.referenceMax}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Abas de Detalhes */}
            <Tabs defaultValue="explanation" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="explanation">Explicação</TabsTrigger>
                <TabsTrigger value="findings">Descobertas</TabsTrigger>
                <TabsTrigger value="articles">Artigos</TabsTrigger>
                <TabsTrigger value="recommendations">Recomendações</TabsTrigger>
              </TabsList>

              {/* Explicação */}
              <TabsContent value="explanation" className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg mb-2">O que é?</h3>
                    <p className="text-gray-700">{selectedExamDetail.explanation}</p>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg mb-2">O que significa seu resultado?</h3>
                    <p className="text-gray-700">{selectedExamDetail.whatItMeans}</p>
                  </div>
                </div>
              </TabsContent>

              {/* Descobertas e Correlações */}
              <TabsContent value="findings" className="space-y-4">
                <div>
                  <h3 className="font-bold text-lg mb-3">Descobertas</h3>
                  <ul className="space-y-2">
                    {selectedExamDetail.findings.map((finding, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-600 mt-1">✓</span>
                        <span className="text-gray-700">{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-3">Correlações com Outros Exames</h3>
                  <div className="space-y-2">
                    {selectedExamDetail.correlations.map((corr, idx) => (
                      <div key={idx} className="bg-blue-50 p-3 rounded-lg">
                        <p className="font-semibold text-blue-900">{corr.exam}</p>
                        <p className="text-sm text-blue-700">{corr.relationship}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Artigos */}
              <TabsContent value="articles" className="space-y-4">
                {selectedExamDetail.articles.map((article, idx) => (
                  <Card key={idx} className="p-4 border-l-4 border-blue-500">
                    <h4 className="font-bold text-lg mb-2">{article.title}</h4>
                    <p className="text-gray-700 mb-3">{article.summary}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Fonte: {article.source}</span>
                      <Badge variant="outline">
                        Relevância: {article.relevance === 'high' ? 'Alta' : 'Média'}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </TabsContent>

              {/* Recomendações */}
              <TabsContent value="recommendations" className="space-y-4">
                {selectedExamDetail.alerts.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg flex items-center gap-2">
                      <AlertCircle className="text-red-600" />
                      Alertas
                    </h3>
                    {selectedExamDetail.alerts.map((alert, idx) => (
                      <Card
                        key={idx}
                        className={`p-4 border-l-4 ${
                          alert.severity === 'danger'
                            ? 'border-red-500 bg-red-50'
                            : alert.severity === 'warning'
                              ? 'border-orange-500 bg-orange-50'
                              : 'border-blue-500 bg-blue-50'
                        }`}
                      >
                        <p className="font-semibold mb-2">{alert.message}</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">Prazo:</span>{' '}
                            <span className="font-semibold">{alert.timeframe}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Ação:</span>{' '}
                            <span className="font-semibold">{alert.action}</span>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}

                <div>
                  <h3 className="font-bold text-lg mb-3">Recomendações</h3>
                  <div className="space-y-2">
                    {selectedExamDetail.recommendations.map((rec, idx) => (
                      <Card key={idx} className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-semibold">{rec.description}</p>
                          <Badge
                            variant={
                              rec.priority === 'critical'
                                ? 'destructive'
                                : rec.priority === 'high'
                                  ? 'default'
                                  : 'secondary'
                            }
                          >
                            {rec.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">Tipo: {rec.type}</p>
                        {rec.frequency && (
                          <p className="text-sm text-gray-600">Frequência: {rec.frequency}</p>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Histórico */}
            {selectedExamData.history.length > 0 && (
              <div>
                <h3 className="font-bold text-lg mb-3">Histórico de Coletas</h3>
                <div className="space-y-2">
                  {selectedExamData.history.map((h, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <span className="font-semibold">{h.date}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">{h.value}</span>
                        <Badge className={getStatusColor(h.status)}>
                          {getStatusLabel(h.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}
