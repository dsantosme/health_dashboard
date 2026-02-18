import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  specialistRecommendations,
  examRecommendations,
  exercisePrograms,
  weeklySchedule
} from '@/data/recommendationsData';
import { AlertCircle, Dumbbell, Stethoscope, Microscope, Calendar } from 'lucide-react';

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'critical':
      return 'bg-red-100 text-red-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getUrgencyIcon = (urgency: string) => {
  switch (urgency) {
    case 'critical':
      return '🚨';
    case 'high':
      return '⚠️';
    case 'medium':
      return '⏱️';
    case 'low':
      return 'ℹ️';
    default:
      return '•';
  }
};

export function RecommendationsPanel() {
  const [selectedExercise, setSelectedExercise] = useState<string | null>(null);
  const selectedExerciseData = selectedExercise
    ? exercisePrograms.find(e => e.id === selectedExercise)
    : null;

  return (
    <div className="w-full space-y-6">
      <Tabs defaultValue="specialists" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="specialists" className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4" />
            <span className="hidden sm:inline">Especialistas</span>
          </TabsTrigger>
          <TabsTrigger value="exams" className="flex items-center gap-2">
            <Microscope className="w-4 h-4" />
            <span className="hidden sm:inline">Exames</span>
          </TabsTrigger>
          <TabsTrigger value="exercises" className="flex items-center gap-2">
            <Dumbbell className="w-4 h-4" />
            <span className="hidden sm:inline">Exercícios</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Agenda</span>
          </TabsTrigger>
        </TabsList>

        {/* Especialistas */}
        <TabsContent value="specialists" className="space-y-4">
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">Recomendações de Especialistas</h2>
            <p className="text-gray-600">
              Consulte os especialistas abaixo para avaliação e acompanhamento
            </p>
          </div>

          <div className="space-y-4">
            {specialistRecommendations.map(specialist => (
              <Card key={specialist.id} className="p-6 border-l-4 border-blue-500">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Stethoscope className="w-5 h-5" />
                      {specialist.specialty}
                    </h3>
                    <p className="text-gray-600 mt-1">{specialist.reason}</p>
                  </div>
                  <Badge className={getPriorityColor(specialist.urgency)}>
                    {getUrgencyIcon(specialist.urgency)} {specialist.urgency.toUpperCase()}
                  </Badge>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold text-gray-700 mb-2">Frequência recomendada:</p>
                  <p className="text-lg font-bold text-blue-600">{specialist.frequency}</p>
                </div>

                <div>
                  <p className="font-semibold text-gray-700 mb-2">Ações sugeridas:</p>
                  <ul className="space-y-2">
                    {specialist.suggestedActions.map((action, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-1">→</span>
                        <span className="text-gray-700">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Exames */}
        <TabsContent value="exams" className="space-y-4">
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">Exames Recomendados</h2>
            <p className="text-gray-600">
              Próximos exames a realizar com frequência de recorrência
            </p>
          </div>

          <div className="space-y-4">
            {examRecommendations.map(exam => (
              <Card key={exam.id} className="p-6 border-l-4 border-green-500">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2">
                      <Microscope className="w-5 h-5" />
                      {exam.name}
                    </h3>
                    <p className="text-gray-600 mt-1">{exam.reason}</p>
                  </div>
                  <Badge className={getPriorityColor(exam.urgency)}>
                    {getUrgencyIcon(exam.urgency)} {exam.urgency.toUpperCase()}
                  </Badge>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold text-gray-700 mb-2">Frequência:</p>
                  <p className="text-lg font-bold text-green-600">{exam.frequency}</p>
                </div>

                {exam.relatedExams && exam.relatedExams.length > 0 && (
                  <div>
                    <p className="font-semibold text-gray-700 mb-2">Exames relacionados:</p>
                    <div className="flex flex-wrap gap-2">
                      {exam.relatedExams.map((relatedExam, idx) => (
                        <Badge key={idx} variant="secondary">
                          {relatedExam}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Exercícios */}
        <TabsContent value="exercises" className="space-y-4">
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">Programa de Exercícios Personalizado</h2>
            <p className="text-gray-600">
              Exercícios adaptados às suas preferências: ciclismo, MTB, corrida, pilates e natação
            </p>
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-700">
                <strong>IMPORTANTE:</strong> Corrigir anemia (ferro sérico) ANTES de intensificar
                exercício. Comece com intensidade baixa e aumente gradualmente.
              </p>
            </div>
          </div>

          {/* Seleção de Exercício */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {exercisePrograms.map(program => (
              <Card
                key={program.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-lg ${
                  selectedExercise === program.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedExercise(program.id)}
              >
                <h3 className="font-bold text-lg mb-2">{program.name}</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Intensidade:</span>{' '}
                    <Badge variant="outline">{program.intensity.toUpperCase()}</Badge>
                  </div>
                  <div>
                    <span className="text-gray-600">Duração:</span> {program.duration}
                  </div>
                  <div>
                    <span className="text-gray-600">Frequência:</span> {program.frequency}
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Detalhes do Exercício Selecionado */}
          {selectedExerciseData && (
            <Card className="p-6 border-2 border-blue-500 mt-6">
              <h2 className="text-2xl font-bold mb-4">{selectedExerciseData.name}</h2>

              <Tabs defaultValue="benefits" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="benefits">Benefícios</TabsTrigger>
                  <TabsTrigger value="precautions">Precauções</TabsTrigger>
                  <TabsTrigger value="progression">Progressão</TabsTrigger>
                </TabsList>

                {/* Benefícios */}
                <TabsContent value="benefits" className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg mb-3">Benefícios</h3>
                    <ul className="space-y-2">
                      {selectedExerciseData.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-green-600 mt-1">✓</span>
                          <span className="text-gray-700">{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                {/* Precauções */}
                <TabsContent value="precautions" className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg mb-3">Precauções e Recomendações</h3>
                    <ul className="space-y-2">
                      {selectedExerciseData.precautions.map((precaution, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-orange-600 mt-1">⚠️</span>
                          <span className="text-gray-700">{precaution}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </TabsContent>

                {/* Progressão */}
                <TabsContent value="progression" className="space-y-4">
                  <div>
                    <h3 className="font-bold text-lg mb-3">Programa de Progressão (8 Semanas)</h3>
                    <div className="space-y-3">
                      {selectedExerciseData.progressionWeeks.map((week, idx) => (
                        <Card key={idx} className="p-4 bg-blue-50">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-blue-900">Semana {week.week}</h4>
                            <Badge variant="outline">{week.intensity}</Badge>
                          </div>
                          <p className="text-gray-700">{week.description}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-700">
                  <strong>💡 Dica:</strong> Comece com a Semana 1 e progresse gradualmente. Respeite
                  seu corpo e não se force além de suas capacidades.
                </p>
              </div>
            </Card>
          )}
        </TabsContent>

        {/* Agenda Semanal */}
        <TabsContent value="schedule" className="space-y-4">
          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-2">Agenda Semanal Recomendada</h2>
            <p className="text-gray-600">{weeklySchedule.description}</p>
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{weeklySchedule.note}</p>
            </div>
          </div>

          <div className="space-y-6">
            {weeklySchedule.weeks.map((week, weekIdx) => (
              <Card key={weekIdx} className="p-6">
                <h3 className="text-xl font-bold mb-4">{week.title}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-2">
                  {week.activities.map((activity, actIdx) => (
                    <Card
                      key={actIdx}
                      className={`p-3 text-center ${
                        activity.intensity === 'low'
                          ? 'bg-green-50 border-green-200'
                          : activity.intensity === 'moderate'
                            ? 'bg-yellow-50 border-yellow-200'
                            : 'bg-orange-50 border-orange-200'
                      }`}
                    >
                      <p className="font-bold text-sm mb-1">{activity.day}</p>
                      <p className="text-xs text-gray-700">{activity.activity}</p>
                    </Card>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-6 bg-blue-50 border-blue-200">
            <h3 className="font-bold text-lg mb-3">Notas Importantes</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Comece com a Semana 1 e progresse gradualmente</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Respeite os dias de repouso - são essenciais para recuperação</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Monitore sua frequência cardíaca durante exercício</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Hidrate-se adequadamente antes, durante e após exercício</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Consulte seu médico ou educador físico se tiver dúvidas</span>
              </li>
            </ul>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
