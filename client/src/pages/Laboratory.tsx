import { useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LabExamsList } from '@/components/LabExamsList';
import { CorrelationAnalysis } from '@/components/CorrelationAnalysis';
import { PatientSelector } from '@/components/PatientSelector';
import { ArrowLeft, Microscope } from 'lucide-react';

export default function Laboratory() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

          <div className="flex items-center gap-4">
            <PatientSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 lg:p-8 max-w-7xl mx-auto">
        <Tabs defaultValue="exams" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="exams">📋 Exames</TabsTrigger>
            <TabsTrigger value="correlations">🔗 Correlações</TabsTrigger>
          </TabsList>

          {/* Exams Tab */}
          <TabsContent value="exams" className="space-y-6">
            <LabExamsList />
          </TabsContent>

          {/* Correlations Tab */}
          <TabsContent value="correlations" className="space-y-6">
            <CorrelationAnalysis />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
