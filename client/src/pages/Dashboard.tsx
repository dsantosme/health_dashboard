import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExamNavigator } from '@/components/ExamNavigator';
import { RecommendationsPanel } from '@/components/RecommendationsPanel';
import { ArrowLeft, Activity, Stethoscope } from 'lucide-react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('exams');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
        <div className="container max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Health Dashboard</h1>
              <p className="text-sm text-gray-600">Análise Completa de Exames Médicos</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Coleta 1</p>
            <p className="font-semibold text-gray-900">14 de Fevereiro, 2026</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-7xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="exams" className="flex items-center gap-2">
              <Stethoscope className="w-4 h-4" />
              Navegação de Exames
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Recomendações
            </TabsTrigger>
          </TabsList>

          {/* Aba de Exames */}
          <TabsContent value="exams" className="space-y-6">
            <ExamNavigator />
          </TabsContent>

          {/* Aba de Recomendações */}
          <TabsContent value="recommendations" className="space-y-6">
            <RecommendationsPanel />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-2">📊 Próximas Coletas</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Coleta 2: 14 de Maio, 2026</li>
                <li>• Coleta 3: 14 de Agosto, 2026</li>
                <li>• Coleta 4: 14 de Novembro, 2026</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-bold text-green-900 mb-2">✅ Próximos Passos</h3>
              <ul className="text-sm text-green-800 space-y-1">
                <li>1. Consultar Hematologista (URGENTE)</li>
                <li>2. Iniciar suplementação de ferro</li>
                <li>3. Agendar com Nutricionista</li>
              </ul>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg">
              <h3 className="font-bold text-orange-900 mb-2">⚠️ Alertas Críticos</h3>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>🚨 Ferro sérico: 1.0 mcg/dL</li>
                <li>⚠️ Peso: 107 kg (meta: 82 kg)</li>
                <li>⚠️ Circunferência: 111 cm (meta: 85 cm)</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
