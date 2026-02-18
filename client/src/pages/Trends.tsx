import { Button } from "@/components/ui/button";
import { TrendVisualization } from "@/components/TrendVisualization";
import { PatientSelector } from "@/components/PatientSelector";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

export default function Trends() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">📈 Análise de Tendências</h1>
            <p className="text-sm text-slate-600 mt-1">Evolução dos exames ao longo de 1 ano (06/01/2023 - 16/01/2024)</p>
          </div>
          <div className="flex items-center gap-4">
            <PatientSelector />
            <Button 
              variant="outline" 
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <TrendVisualization />
      </div>
    </div>
  );
}
