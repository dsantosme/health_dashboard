import React, { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LabSidebar } from '@/components/LabSidebar';
import { LabExamsList } from '@/components/LabExamsList';
import { CorrelationAnalysis } from '@/components/CorrelationAnalysis';
import { LabExam, labCategories } from '@/data/labExamsData';
import { ArrowLeft, Microscope } from 'lucide-react';

export default function Laboratory() {
  const [selectedCategory, setSelectedCategory] = useState<string>(labCategories[0]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState<LabExam | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between h-20 px-4 lg:px-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Voltar
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Microscope className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Lab Dashboard</h1>
                <p className="text-xs text-gray-600">Análise Completa de Exames</p>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 text-right">
            <div>
              <p className="text-xs text-gray-600">Data da Coleta</p>
              <p className="font-semibold text-gray-900">14 de Fevereiro, 2026</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Sidebar */}
        <LabSidebar
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8 max-w-7xl mx-auto">
            <Tabs defaultValue="exams" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="exams">📋 Exames</TabsTrigger>
                <TabsTrigger value="correlations">🔗 Correlações</TabsTrigger>
              </TabsList>

              {/* Exams Tab */}
              <TabsContent value="exams" className="space-y-6">
                <LabExamsList category={selectedCategory} onSelectExam={setSelectedExam} />
              </TabsContent>

              {/* Correlations Tab */}
              <TabsContent value="correlations" className="space-y-6">
                <CorrelationAnalysis />
              </TabsContent>
            </Tabs>

            {/* Footer */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h3 className="font-bold text-blue-900 mb-2">📊 Próximas Coletas</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Coleta 2: 14 de Maio, 2026</li>
                    <li>• Coleta 3: 14 de Agosto, 2026</li>
                    <li>• Coleta 4: 14 de Novembro, 2026</li>
                  </ul>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h3 className="font-bold text-green-900 mb-2">✅ Próximos Passos</h3>
                  <ul className="text-sm text-green-800 space-y-1">
                    <li>1. Consultar Hematologista (URGENTE)</li>
                    <li>2. Iniciar suplementação de ferro</li>
                    <li>3. Agendar com Nutricionista</li>
                  </ul>
                </div>

                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h3 className="font-bold text-orange-900 mb-2">⚠️ Alertas Críticos</h3>
                  <ul className="text-sm text-orange-800 space-y-1">
                    <li>🚨 Ferro sérico: 1.0 mcg/dL</li>
                    <li>⚠️ Peso: 107 kg (meta: 82 kg)</li>
                    <li>⚠️ Circunferência: 111 cm (meta: 85 cm)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
