import { usePatient } from '@/contexts/PatientContext';
import { CorrelationsTimeline } from '@/components/CorrelationsTimeline';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { RefreshCw, Sparkles } from 'lucide-react';
import { useState } from 'react';

export default function Correlations() {
  const { selectedPatientId } = usePatient();
  const [isProcessing, setIsProcessing] = useState(false);
  
  const processAllMutation = trpc.correlations.processAll.useMutation();
  const utils = trpc.useUtils();

  const handleProcessAll = async () => {
    if (!selectedPatientId) return;
    
    setIsProcessing(true);
    try {
      await processAllMutation.mutateAsync({ patientId: selectedPatientId });
      // Invalidar cache para recarregar correlações
      await utils.correlations.listByPatient.invalidate();
      alert('✅ Correlações processadas com sucesso!');
    } catch (error) {
      console.error('Erro ao processar correlações:', error);
      alert('❌ Erro ao processar correlações. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!selectedPatientId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-slate-600">Selecione um paciente para visualizar correlações.</p>
          </div>
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
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Correlações de Exames</h1>
              <p className="text-sm text-slate-600">Análises automáticas baseadas em exames realizados</p>
            </div>
            <Button
              onClick={handleProcessAll}
              disabled={isProcessing}
              className="flex items-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Gerar Correlações
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-blue-900 font-semibold mb-1">
                Correlações Automáticas
              </p>
              <p className="text-sm text-blue-800">
                As correlações são geradas automaticamente quando novos exames são inseridos.
                Exames realizados na mesma semana são analisados em conjunto para identificar
                padrões e fornecer recomendações personalizadas.
              </p>
            </div>
          </div>
        </div>

        <CorrelationsTimeline patientId={selectedPatientId} />
      </main>
    </div>
  );
}
