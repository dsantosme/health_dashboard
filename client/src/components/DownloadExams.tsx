import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, FileText, BarChart3 } from 'lucide-react';
import { usePatient } from '@/contexts/PatientContext';
import { getPatientExams, getPatient } from '@/data/patientsData';

export function DownloadExams() {
  const { selectedPatientId } = usePatient();
  const patient = getPatient(selectedPatientId);
  const exams = getPatientExams(selectedPatientId);

  const downloadCSV = () => {
    if (!patient) return;

    // Criar CSV
    const headers = ['Data', 'Exame', 'Valor', 'Unidade', 'Referência Min', 'Referência Max', 'Status', 'Categoria'];
    const rows = exams.map(exam => [
      exam.date,
      exam.name,
      exam.value,
      exam.unit,
      exam.referenceMin || '',
      exam.referenceMax || '',
      exam.status,
      exam.category
    ]);

    const csv = [
      [`Paciente: ${patient.name}`, `Data de Nascimento: ${patient.birthDate}`],
      ['Altura: 182 cm', 'Peso Atual: 107 kg'],
      [],
      headers,
      ...rows
    ]
      .map(row => row.join(','))
      .join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exames_${patient.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadJSON = () => {
    if (!patient) return;

    const data = {
      patient: {
        name: patient.name,
        birthDate: patient.birthDate,
        age: patient.age
      },
      exams,
      exportDate: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `exames_${patient.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    if (!patient) return;

    // Criar HTML para PDF
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Relatório de Exames - ${patient.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          h1 { color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px; }
          h2 { color: #1e40af; margin-top: 20px; }
          .patient-info { background: #f0f9ff; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
          th { background: #1e40af; color: white; }
          tr:nth-child(even) { background: #f9fafb; }
          .normal { color: #10b981; font-weight: bold; }
          .low { color: #f59e0b; font-weight: bold; }
          .high { color: #ef4444; font-weight: bold; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <h1>Relatório de Exames Médicos</h1>
        
        <div class="patient-info">
          <h2>Informações do Paciente</h2>
          <p><strong>Nome:</strong> ${patient.name}</p>
          <p><strong>Data de Nascimento:</strong> ${patient.birthDate}</p>
          <p><strong>Idade:</strong> ${patient.age} anos</p>
          <p><strong>Altura:</strong> 182 cm</p>
          <p><strong>Peso:</strong> 107 kg</p>
          <p><strong>Data do Relatório:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        <h2>Resultados de Exames</h2>
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Exame</th>
              <th>Resultado</th>
              <th>Referência</th>
              <th>Status</th>
              <th>Categoria</th>
            </tr>
          </thead>
          <tbody>
            ${exams
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(
                exam => `
              <tr>
                <td>${exam.date}</td>
                <td>${exam.name}</td>
                <td>${exam.value} ${exam.unit}</td>
                <td>${exam.referenceMin || '-'} a ${exam.referenceMax || '-'}</td>
                <td class="${exam.status}">${exam.status.toUpperCase()}</td>
                <td>${exam.category}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="footer">
          <p>Este relatório foi gerado automaticamente pelo Health Monitor.</p>
          <p>Para interpretação clínica, consulte seu médico.</p>
        </div>
      </body>
      </html>
    `;

    // Usar print para PDF (alternativa simples)
    const printWindow = window.open('', '', 'width=900,height=600');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <Card className="p-6 bg-white border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Download className="w-5 h-5" />
          Download de Dados
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Download CSV */}
        <Button
          onClick={downloadCSV}
          variant="outline"
          className="h-auto py-4 flex flex-col items-center gap-2"
        >
          <FileText className="w-6 h-6" />
          <span className="text-sm font-medium">Baixar CSV</span>
          <span className="text-xs text-slate-600">Para Excel/Planilhas</span>
        </Button>

        {/* Download JSON */}
        <Button
          onClick={downloadJSON}
          variant="outline"
          className="h-auto py-4 flex flex-col items-center gap-2"
        >
          <BarChart3 className="w-6 h-6" />
          <span className="text-sm font-medium">Baixar JSON</span>
          <span className="text-xs text-slate-600">Para APIs/Integração</span>
        </Button>

        {/* Download PDF */}
        <Button
          onClick={downloadPDF}
          variant="outline"
          className="h-auto py-4 flex flex-col items-center gap-2"
        >
          <FileText className="w-6 h-6" />
          <span className="text-sm font-medium">Imprimir/PDF</span>
          <span className="text-xs text-slate-600">Relatório formatado</span>
        </Button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>💡 Dica:</strong> Baixe seus dados regularmente para manter um backup seguro. 
          Compartilhe o PDF com seu médico para discussão dos resultados.
        </p>
      </div>
    </Card>
  );
}
