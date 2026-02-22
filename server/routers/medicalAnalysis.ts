import { z } from 'zod';
import { router, ownershipProcedure } from '../_core/trpc';
import { generateMedicalAnalysis } from '../services/medicalAnalysisService';

export const medicalAnalysisRouter = router({
  /**
   * Gera análise médica em linguagem natural para um conjunto de exames correlacionados
   */
  generate: ownershipProcedure
    .input(
      z.object({
        patientId: z.string(),
        examNames: z.array(z.string()),
        correlationDate: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const analysis = await generateMedicalAnalysis({
        patientId: input.patientId,
        userId: ctx.user.id,
        examNames: input.examNames,
        correlationDate: input.correlationDate,
      });

      return analysis;
    }),
});
