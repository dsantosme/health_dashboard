import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { labCategories, labExamsData } from '@/data/labExamsData';
import {
  Microscope,
  TrendingUp,
  AlertCircle,
  Heart,
  Zap,
  Droplet,
  Bone,
  Beaker,
  Filter,
  Menu,
  X
} from 'lucide-react';

interface LabSidebarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const categoryIcons: { [key: string]: React.ReactNode } = {
  'Metabolismo de Glicose': <TrendingUp className="w-5 h-5" />,
  'Lipídios': <Heart className="w-5 h-5" />,
  'Hematologia': <Droplet className="w-5 h-5" />,
  'Hormônios': <Zap className="w-5 h-5" />,
  'Tireoide': <Zap className="w-5 h-5" />,
  'Minerais e Eletrólitos': <Bone className="w-5 h-5" />,
  'Função Hepática': <Beaker className="w-5 h-5" />,
  'Função Renal': <Filter className="w-5 h-5" />
};

const getCategoryColor = (category: string) => {
  const colors: { [key: string]: string } = {
    'Metabolismo de Glicose': 'bg-blue-50 hover:bg-blue-100 border-blue-200',
    'Lipídios': 'bg-red-50 hover:bg-red-100 border-red-200',
    'Hematologia': 'bg-purple-50 hover:bg-purple-100 border-purple-200',
    'Hormônios': 'bg-pink-50 hover:bg-pink-100 border-pink-200',
    'Tireoide': 'bg-orange-50 hover:bg-orange-100 border-orange-200',
    'Minerais e Eletrólitos': 'bg-green-50 hover:bg-green-100 border-green-200',
    'Função Hepática': 'bg-amber-50 hover:bg-amber-100 border-amber-200',
    'Função Renal': 'bg-cyan-50 hover:bg-cyan-100 border-cyan-200'
  };
  return colors[category] || 'bg-gray-50 hover:bg-gray-100 border-gray-200';
};

const getStatusCount = (category: string) => {
  const exams = labExamsData.filter(e => e.category === category);
  return {
    critical: exams.filter(e => e.status === 'critical').length,
    high: exams.filter(e => e.status === 'high').length,
    normal: exams.filter(e => e.status === 'normal').length,
    unknown: exams.filter(e => e.status === 'unknown').length
  };
};

export function LabSidebar({
  selectedCategory,
  onSelectCategory,
  isOpen,
  onToggle
}: LabSidebarProps) {
  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-20 left-4 z-40">
        <Button
          variant="outline"
          size="sm"
          onClick={onToggle}
          className="gap-2"
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 
          overflow-y-auto transition-all duration-300 z-30
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          lg:translate-x-0
        `}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Microscope className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">Lab Dashboard</h2>
            </div>
            <p className="text-sm text-gray-600">Análise de Exames</p>
          </div>

          {/* Status Overview */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-sm text-gray-900 mb-3">Status Geral</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total de Exames</span>
                <Badge variant="outline">{labExamsData.length}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600 font-semibold">🚨 Críticos</span>
                <Badge className="bg-red-100 text-red-800">
                  {labExamsData.filter(e => e.status === 'critical').length}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-orange-600 font-semibold">⚠️ Altos</span>
                <Badge className="bg-orange-100 text-orange-800">
                  {labExamsData.filter(e => e.status === 'high').length}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600 font-semibold">✅ Normais</span>
                <Badge className="bg-green-100 text-green-800">
                  {labExamsData.filter(e => e.status === 'normal').length}
                </Badge>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide px-2">
              Categorias
            </h3>
            <div className="space-y-2">
              {labCategories.map(category => {
                const counts = getStatusCount(category);
                const isSelected = selectedCategory === category;

                return (
                  <button
                    key={category}
                    onClick={() => {
                      onSelectCategory(category);
                      onToggle(); // Close sidebar on mobile
                    }}
                    className={`
                      w-full text-left p-3 rounded-lg border-2 transition-all
                      ${isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : `border-transparent ${getCategoryColor(category)}`
                      }
                    `}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2 flex-1">
                        <div className="text-gray-600 mt-0.5">
                          {categoryIcons[category]}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm text-gray-900">
                            {category}
                          </p>
                          <p className="text-xs text-gray-600 mt-1">
                            {counts.normal + counts.high + counts.critical + counts.unknown} exames
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {counts.critical > 0 && (
                          <Badge className="bg-red-100 text-red-800 text-xs px-1.5">
                            {counts.critical}
                          </Badge>
                        )}
                        {counts.high > 0 && (
                          <Badge className="bg-orange-100 text-orange-800 text-xs px-1.5">
                            {counts.high}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2 pt-4 border-t border-gray-200">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide px-2">
              Ações Rápidas
            </h3>
            <Button variant="outline" className="w-full justify-start gap-2" size="sm">
              <AlertCircle className="w-4 h-4" />
              Ver Alertas
            </Button>
            <Button variant="outline" className="w-full justify-start gap-2" size="sm">
              <TrendingUp className="w-4 h-4" />
              Correlações
            </Button>
          </div>

          {/* Info */}
          <div className="p-3 bg-gray-50 rounded-lg text-xs text-gray-600 space-y-1 border-t border-gray-200 pt-4">
            <p>
              <strong>Data da Coleta:</strong> 14/02/2026
            </p>
            <p>
              <strong>Hora:</strong> 06:35
            </p>
            <p>
              <strong>Coleta:</strong> 1 de 4
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
}
