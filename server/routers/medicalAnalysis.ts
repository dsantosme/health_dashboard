import { z } from 'zod';
import { router, ownershipProcedure } from '../_core/trpc';
import { MedicalAnalysisServiceFactory } from '../adapters/MedicalAnalysisServiceFactory';

export const medicalAnalysisRouter = router({
  /**
   * Gera análise médica em linguagem natural para um conjunto de exames correlacionados
   * 
   * Usa Arquitetura Hexagonal: Factory Pattern decide se usa adapter interno ou MCP
   */
  generate: ownershipProcedure
    .input(
      z.object({
        patientId: z.string(),
        examNames: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      // Factory creates the appropriate service implementation (internal or MCP)
      const deploymentMode = MedicalAnalysisServiceFactory.getDeploymentMode();
      const service = MedicalAnalysisServiceFactory.create(deploymentMode);

      const analysis = await service.generateAnalysis({
        patientId: input.patientId,
        examNames: input.examNames,
      });

      return analysis;
    }),
});
