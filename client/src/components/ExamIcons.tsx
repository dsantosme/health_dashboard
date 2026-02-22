/**
 * Biblioteca de ícones SVG personalizados para tipos de exames
 * Design minimalista, flat, monocromático
 */

interface IconProps {
  className?: string;
  size?: number;
}

// Ícone de Lipídios (Colesterol, Triglicerídeos, HDL, LDL)
export function LipidsIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="12" cy="12" r="4" fill="currentColor" />
      <path d="M12 4 L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 16 L12 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 12 L8 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 12 L20 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// Ícone de Glicose (Glicemia, HbA1c)
export function GlucoseIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 3 L15 8 L21 9 L16.5 13.5 L17.5 19.5 L12 17 L6.5 19.5 L7.5 13.5 L3 9 L9 8 Z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" fill="currentColor" />
    </svg>
  );
}

// Ícone de Hormônios (Testosterona, Estradiol, TSH, T4)
export function HormoneIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 3 C12 3 8 6 8 10 C8 13 10 15 12 15 C14 15 16 13 16 10 C16 6 12 3 12 3 Z" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M12 15 L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="10" r="2" fill="currentColor" />
    </svg>
  );
}

// Ícone de Função Renal (Creatinina, Ureia)
export function KidneyIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M10 4 C8 4 6 6 6 8 L6 16 C6 18 8 20 10 20 C11 20 12 19 12 18 L12 6 C12 5 11 4 10 4 Z" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M14 4 C16 4 18 6 18 8 L18 16 C18 18 16 20 14 20 C13 20 12 19 12 18 L12 6 C12 5 13 4 14 4 Z" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="10" cy="12" r="1.5" fill="currentColor" />
      <circle cx="14" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

// Ícone de Função Hepática (TGO, TGP, GGT)
export function LiverIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M4 10 C4 8 6 6 8 6 L12 6 C14 6 16 7 17 9 C18 7 20 6 22 8 L22 14 C22 16 20 18 18 18 L6 18 C4 18 4 16 4 14 Z" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M12 6 L12 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="9" cy="12" r="1.5" fill="currentColor" />
      <circle cx="15" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

// Ícone de Hemograma (Hemoglobina, Leucócitos, Plaquetas)
export function BloodIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 3 C12 3 7 8 7 13 C7 17 9 20 12 20 C15 20 17 17 17 13 C17 8 12 3 12 3 Z" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="12" cy="13" r="3" fill="currentColor" />
    </svg>
  );
}

// Ícone de Vitaminas (Vitamina D, B12)
export function VitaminIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M12 6 L12 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 14 L12 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6 12 L10 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M14 12 L18 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}

// Ícone de Minerais (Cálcio, Ferro, Magnésio)
export function MineralIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="6" y="6" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M6 10 L18 10" stroke="currentColor" strokeWidth="2" />
      <path d="M6 14 L18 14" stroke="currentColor" strokeWidth="2" />
      <path d="M10 6 L10 18" stroke="currentColor" strokeWidth="2" />
      <path d="M14 6 L14 18" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  );
}

// Ícone de Tireoide (TSH, T3, T4)
export function ThyroidIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12 4 L12 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="9" cy="13" rx="3" ry="5" stroke="currentColor" strokeWidth="2" fill="none" />
      <ellipse cx="15" cy="13" rx="3" ry="5" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M9 10 C9 10 10.5 9 12 9 C13.5 9 15 10 15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="9" cy="13" r="1.5" fill="currentColor" />
      <circle cx="15" cy="13" r="1.5" fill="currentColor" />
    </svg>
  );
}

// Ícone Genérico (para exames não categorizados)
export function GenericExamIcon({ className = '', size = 24 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
      <path d="M9 8 L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 12 L15 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 16 L12 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Retorna o ícone apropriado baseado no nome/categoria do exame
 */
export function getExamIcon(examName: string): React.ComponentType<IconProps> {
  const name = examName.toUpperCase();
  
  // Lipídios
  if (name.includes('COLESTEROL') || name.includes('TRIGLICERID') || name.includes('HDL') || name.includes('LDL')) {
    return LipidsIcon;
  }
  
  // Glicose
  if (name.includes('GLICOSE') || name.includes('GLICEMIA') || name.includes('HBA1C') || name.includes('HEMOGLOBINA GLICADA')) {
    return GlucoseIcon;
  }
  
  // Hormônios
  if (name.includes('TESTOSTERONA') || name.includes('ESTRADIOL') || name.includes('PROGESTERONA') || name.includes('CORTISOL')) {
    return HormoneIcon;
  }
  
  // Função Renal
  if (name.includes('CREATININA') || name.includes('UREIA') || name.includes('ACIDO URICO')) {
    return KidneyIcon;
  }
  
  // Função Hepática
  if (name.includes('TGO') || name.includes('TGP') || name.includes('GGT') || name.includes('BILIRRUBINA') || name.includes('FOSFATASE')) {
    return LiverIcon;
  }
  
  // Hemograma
  if (name.includes('HEMOGLOBINA') || name.includes('HEMATOCRITO') || name.includes('LEUCOCITO') || name.includes('PLAQUETA') || name.includes('HEMACIA')) {
    return BloodIcon;
  }
  
  // Vitaminas
  if (name.includes('VITAMINA') || name.includes('B12') || name.includes('FOLATO')) {
    return VitaminIcon;
  }
  
  // Minerais
  if (name.includes('CALCIO') || name.includes('FERRO') || name.includes('MAGNESIO') || name.includes('POTASSIO') || name.includes('SODIO')) {
    return MineralIcon;
  }
  
  // Tireoide
  if (name.includes('TSH') || name.includes('T3') || name.includes('T4') || name.includes('TIREOIDE')) {
    return ThyroidIcon;
  }
  
  // Genérico
  return GenericExamIcon;
}
