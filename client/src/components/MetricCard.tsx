import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface MetricCardProps {
  icon: LucideIcon;
  iconColor?: string;
  iconBgColor?: string;
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  badge?: ReactNode;
  onClick?: () => void;
}

export function MetricCard({
  icon: Icon,
  iconColor = 'text-cyan-400',
  iconBgColor = 'bg-cyan-500/20',
  title,
  value,
  unit,
  subtitle,
  badge,
  onClick
}: MetricCardProps) {
  return (
    <Card
      className={`p-5 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/70 transition-all ${onClick ? 'cursor-pointer active:scale-[0.98]' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-12 h-12 rounded-2xl ${iconBgColor} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        {badge && <div>{badge}</div>}
      </div>
      
      <h3 className="text-sm text-muted-foreground mb-1">{title}</h3>
      
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        {unit && <span className="text-lg text-muted-foreground">{unit}</span>}
      </div>
      
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
      )}
    </Card>
  );
}
