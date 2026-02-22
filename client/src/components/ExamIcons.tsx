import { LucideIcon, Droplet, Activity, Zap, Heart, Brain, Bone, Pill, TestTube, Scale, Ruler } from 'lucide-react';

/**
 * Biblioteca de ícones SVG personalizados para tipos de exames
 * Sem emojis, apenas ícones SVG customizados
 */

export const examIconMap: Record<string, LucideIcon> = {
  // Lipídios (Colesterol, Triglicerídeos)
  'COLESTEROL TOTAL': Heart,
  'COLESTEROL HDL': Heart,
  'COLESTEROL LDL': Heart,
  'COLESTEROL VLDL': Heart,
  'TRIGLICERIDEOS': Droplet,
  'TRIGLICERÍDEOS': Droplet,
  
  // Glicose e Metabolismo
  'GLICOSE': Zap,
  'GLICOSE JEJUM': Zap,
  'HEMOGLOBINA GLICADA': Zap,
  'HBA1C': Zap,
  
  // Função Renal
  'CREATININA': Droplet,
  'UREIA': Droplet,
  'ACIDO URICO': Droplet,
  'ÁCIDO ÚRICO': Droplet,
  
  // Função Hepática
  'TGO': TestTube,
  'TGP': TestTube,
  'GAMA GT': TestTube,
  'BILIRRUBINA': TestTube,
  
  // Hormônios
  'TSH': Brain,
  'TSH ULTRA SENSIVEL': Brain,
  'T3': Brain,
  'T4': Brain,
  'T4 LIVRE': Brain,
  'TESTOSTERONA': Activity,
  'ESTRADIOL': Activity,
  'PROGESTERONA': Activity,
  'CORTISOL': Brain,
  
  // Vitaminas e Minerais
  'VITAMINA B12': Pill,
  'VITAMINA D': Pill,
  'FERRO': Droplet,
  'FERRO SERICO': Droplet,
  'FERRITINA': Droplet,
  'CALCIO': Bone,
  'CÁLCIO': Bone,
  'MAGNESIO': Bone,
  'MAGNÉSIO': Bone,
  
  // Hemograma
  'HEMOGLOBINA': Droplet,
  'HEMATOCRITO': Droplet,
  'LEUCOCITOS': TestTube,
  'LEUCÓCITOS': TestTube,
  'PLAQUETAS': TestTube,
  
  // Antropométricos
  'PESO': Scale,
  'ALTURA': Ruler,
  'IMC': Activity,
  'CIRCUNFERENCIA': Ruler,
  'CIRCUNFERÊNCIA': Ruler,
  
  // Default
  'DEFAULT': TestTube
};

/**
 * Retorna o ícone apropriado para um exame
 */
export function getExamIcon(examName: string): LucideIcon {
  const normalizedName = examName.toUpperCase().trim();
  
  // Busca exata
  if (examIconMap[normalizedName]) {
    return examIconMap[normalizedName];
  }
  
  // Busca parcial (contém)
  for (const [key, icon] of Object.entries(examIconMap)) {
    if (normalizedName.includes(key) || key.includes(normalizedName)) {
      return icon;
    }
  }
  
  // Default
  return examIconMap.DEFAULT;
}
