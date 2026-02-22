import { Card } from '@/components/ui/card';
import { Microscope } from 'lucide-react';

interface ExamStats {
  total: number;
  normal: number;
  abnormal: number;
  critical: number;
}

interface Props {
  stats: ExamStats;
  year: number;
}

export default function ExamStatsCard({ stats, year }: Props) {
  return (
    <Card className="p-6 bg-gradient-to-br from-card via-card to-card/80 border-border/50">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-1">Resumo de Exames</h3>
          <p className="text-sm text-muted-foreground">Ano {year}</p>
        </div>
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Microscope className="w-6 h-6 text-primary" />
        </div>
      </div>

      {/* Grid de estatísticas */}
      <div className="grid grid-cols-2 gap-4">
        {/* Total */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-bold text-foreground">{stats.total}</p>
          </div>
        </div>

        {/* Normais */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
            <span className="text-2xl">✅</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Normais</p>
            <p className="text-lg font-bold text-green-400">{stats.normal}</p>
          </div>
        </div>

        {/* Anormais */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50">
          <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Anormais</p>
            <p className="text-lg font-bold text-yellow-400">{stats.abnormal}</p>
          </div>
        </div>

        {/* Críticos */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-background/50">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
            <span className="text-2xl">🔴</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Críticos</p>
            <p className="text-lg font-bold text-red-400">{stats.critical}</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
