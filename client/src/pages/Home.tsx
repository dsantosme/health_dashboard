import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Activity, Microscope, TrendingUp, Heart, Beaker } from "lucide-react";

/**
 * Home page - Introduction and navigation to health dashboard
 * Design: Professional medical dashboard with emphasis on health monitoring
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Health Dashboard</h1>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium">
                Recursos
              </a>
              <a href="#exams" className="text-gray-600 hover:text-gray-900 font-medium">
                Exames
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Monitore Sua Saúde com Precisão
              </h2>
              <p className="text-xl text-gray-600">
                Análise completa de exames médicos com explicações detalhadas, descobertas, correlações
                e recomendações personalizadas para seu bem-estar.
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <p className="text-gray-700">
                <strong>Dados Atuais:</strong>
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Peso</p>
                  <p className="text-2xl font-bold text-blue-600">107 kg</p>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-600">Ferro Sérico</p>
                  <p className="text-2xl font-bold text-red-600">1.0 mcg/dL</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/laboratory">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white gap-2 w-full">
                  <Microscope className="w-5 h-5" />
                  Lab Dashboard
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="gap-2 w-full">
                  <Activity className="w-5 h-5" />
                  Health Dashboard
                </Button>
              </Link>
            </div>
          </div>

          <div className="hidden md:grid grid-cols-2 gap-4">
            <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <Microscope className="w-8 h-8 text-green-600 mb-3" />
              <h3 className="font-bold text-green-900 mb-2">20 Exames</h3>
              <p className="text-sm text-green-700">Análise completa com dados históricos</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <TrendingUp className="w-8 h-8 text-blue-600 mb-3" />
              <h3 className="font-bold text-blue-900 mb-2">Tendências</h3>
              <p className="text-sm text-blue-700">Acompanhe evolução ao longo do tempo</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <Activity className="w-8 h-8 text-purple-600 mb-3" />
              <h3 className="font-bold text-purple-900 mb-2">Exercícios</h3>
              <p className="text-sm text-purple-700">Programa personalizado com progressão</p>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <Heart className="w-8 h-8 text-orange-600 mb-3" />
              <h3 className="font-bold text-orange-900 mb-2">Recomendações</h3>
              <p className="text-sm text-orange-700">Especialistas e exames sugeridos</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white border-y border-gray-200">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Recursos Principais</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Microscope className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Navegação de Exames</h3>
              <p className="text-gray-600">
                Explore todos os 20 exames realizados com explicações detalhadas, faixas de referência
                e histórico de coletas.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Descobertas & Correlações</h3>
              <p className="text-gray-600">
                Entenda as descobertas de cada exame e como eles se correlacionam entre si para uma
                visão holística da sua saúde.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Programa de Exercícios</h3>
              <p className="text-gray-600">
                Programa personalizado com ciclismo, MTB, corrida, pilates e natação, adaptado ao seu
                nível e objetivos.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Alertas Temporais</h3>
              <p className="text-gray-600">
                Receba alertas com urgência apropriada sobre indicadores críticos e ações imediatas
                necessárias.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Microscope className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Recomendações Médicas</h3>
              <p className="text-gray-600">
                Lista de especialistas recomendados, exames de recorrência e frequência de
                acompanhamento.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold mb-3">Histórico & Tendências</h3>
              <p className="text-gray-600">
                Acompanhe a evolução dos seus exames ao longo do tempo com gráficos e análises de
                tendências.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Exams Summary */}
      <section id="exams" className="py-16">
        <div className="container max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Exames Realizados</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50">
              <p className="text-sm text-gray-600">Exames Normais</p>
              <p className="text-3xl font-bold text-green-600">14</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-orange-50 to-yellow-50">
              <p className="text-sm text-gray-600">Acima do Normal</p>
              <p className="text-3xl font-bold text-orange-600">0</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-red-50 to-pink-50">
              <p className="text-sm text-gray-600">Críticos</p>
              <p className="text-3xl font-bold text-red-600">1</p>
            </Card>
            <Card className="p-4 bg-gradient-to-br from-gray-50 to-slate-50">
              <p className="text-sm text-gray-600">Sem Referência</p>
              <p className="text-3xl font-bold text-gray-600">5</p>
            </Card>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h3 className="font-bold text-red-900 mb-3">🚨 Alerta Crítico</h3>
            <p className="text-red-800 mb-3">
              <strong>Ferro Sérico: 1.0 mcg/dL</strong> - Anemia severa detectada. Requer investigação
              urgente e intervenção médica imediata.
            </p>
            <p className="text-sm text-red-700">
              ⏰ Próximas ações: Consultar Hematologista nos próximos 2-3 dias
            </p>
          </div>

          <Link href="/dashboard">
            <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600">
              Explorar Todos os Exames
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 border-t border-gray-800">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-3">Health Dashboard</h3>
              <p className="text-sm">Análise completa de exames médicos com recomendações personalizadas.</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-3">Próximas Coletas</h3>
              <ul className="text-sm space-y-1">
                <li>• Coleta 2: 14 de Maio, 2026</li>
                <li>• Coleta 3: 14 de Agosto, 2026</li>
                <li>• Coleta 4: 14 de Novembro, 2026</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-3">Informações</h3>
              <p className="text-sm">
                Este dashboard é uma ferramenta de acompanhamento de saúde. Sempre consulte um médico
                para diagnóstico e tratamento.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2026 Health Dashboard. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
