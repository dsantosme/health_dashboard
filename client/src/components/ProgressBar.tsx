interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  colors?: string[]; // Array de cores para gradiente
  showPercentage?: boolean;
  height?: string;
}

export function ProgressBar({
  value,
  max = 100,
  colors = ['#00d4ff', '#00b8d4'], // ciano por padrão
  showPercentage = false,
  height = 'h-2'
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const gradientColors = colors.length > 1
    ? `linear-gradient(to right, ${colors.join(', ')})`
    : colors[0];

  return (
    <div className="flex items-center gap-3">
      <div className={`flex-1 bg-muted rounded-full overflow-hidden ${height}`}>
        <div
          className={`${height} rounded-full transition-all duration-500 ease-out`}
          style={{
            width: `${percentage}%`,
            background: gradientColors
          }}
        />
      </div>
      
      {showPercentage && (
        <span className="text-sm font-semibold text-muted-foreground min-w-[3ch]">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
}
