import { useState } from 'react';
import { trpc } from '@/lib/trpc';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, AlertCircle, CheckCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

interface CorrelationsTimelineProps {
  patientId: string;
}

export function CorrelationsTimeline({ patientId }: CorrelationsTimelineProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  
  const { data: correlations, isLoading, error } = trpc.correlations.listByPatient.useQuery({
    patientId,
    limit: 20
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-slate-600">Carregando correlações...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 bg-red-50 border-red-200">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-6 h-6 text-red-600" />
          <div>
            <p className="font-semibold text-red-900">Erro ao carregar correlações</p>
            <p className="text-sm text-red-700">{error.message}</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!correlations || correlations.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-slate-600">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-400" />
          <p className="font-semibold mb-1">Nenhuma correlação encontrada</p>
          <p className="text-sm">As correlações serão geradas automaticamente quando novos exames forem inseridos.</p>
        </div>
      </Card>
    );
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'good':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'attention':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'urgent':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-600" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'good':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Bom</Badge>;
      case 'attention':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Atenção</Badge>;
      case 'urgent':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Urgente</Badge>;
      default:
        return <Badge className="bg-slate-100 text-slate-800 border-slate-200">Desconhecido</Badge>;
    }
  };

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-slate-900">Histórico de Correlações</h2>
        <Badge variant="outline" className="text-sm">
          {correlations.length} análise(s)
        </Badge>
      </div>

      <div className="space-y-3">
        {correlations.map((correlation: any) => {
          const isExpanded = expandedId === correlation.id;
          const examsInvolved = JSON.parse(correlation.examsInvolved);
          const specialists = JSON.parse(correlation.specialists);

          return (
            <Card key={correlation.id} className="overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    {getSeverityIcon(correlation.severity)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="font-semibold text-slate-900">
                          {formatDate(correlation.correlationDate)}
                        </p>
                        {getSeverityBadge(correlation.severity)}
                      </div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {examsInvolved.map((exam: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {exam}
                          </Badge>
                        ))}
                      </div>
                      {!isExpanded && (
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {correlation.analysis}
                        </p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedId(isExpanded ? null : correlation.id)}
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </Button>
                </div>

                {isExpanded && (
                  <div className="mt-4 space-y-4 border-t pt-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">📊 Análise Detalhada</h4>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">
                        {correlation.analysis}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">💡 Recomendações</h4>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">
                        {correlation.recommendations}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">👨‍⚕️ Especialistas Recomendados</h4>
                      <div className="flex flex-wrap gap-2">
                        {specialists.map((specialist: string, idx: number) => (
                          <Badge key={idx} className="bg-blue-100 text-blue-800 border-blue-200">
                            {specialist}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs text-slate-500">
                      Análise gerada em: {new Date(correlation.createdAt).toLocaleString('pt-BR')}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
