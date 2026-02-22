import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, ownershipProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import * as correlationEngine from "./correlationEngine";
import { medicalAnalysisRouter } from "./routers/medicalAnalysis";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Rotas de Pacientes
  patients: router({
    list: ownershipProcedure.query(async ({ ctx }) => {
      return await db.getAllPatients(ctx.user.id);
    }),
    getById: ownershipProcedure
      .input(z.object({ patientId: z.string() }))
      .query(async ({ input, ctx }) => {
        return await db.getPatientById(input.patientId, ctx.user.id);
      }),
    getAnthropometricData: ownershipProcedure
      .input(z.object({ patientId: z.string() }))
      .query(async ({ input, ctx }) => {
        const patient = await db.getPatientById(input.patientId, ctx.user.id);
        if (!patient) {
          return null;
        }
        return {
          weight: patient.weight ? parseFloat(String(patient.weight)) : null,
          height: patient.height,
          bmi: patient.bmi ? parseFloat(String(patient.bmi)) : null,
          waist: patient.waist,
        };
      }),
  }),

  // Rotas de Exames
  exams: router({
    listByPatient: ownershipProcedure
      .input(z.object({ patientId: z.string() }))
      .query(async ({ input, ctx }) => {
        return await db.getExamsByPatientId(input.patientId, ctx.user.id);
      }),
    listByPatientAndPeriod: ownershipProcedure
      .input(z.object({ patientId: z.string(), year: z.number() }))
      .query(async ({ input, ctx }) => {
        return await db.getExamsByPatientIdAndPeriod(input.patientId, input.year, ctx.user.id);
      }),
    getHistory: ownershipProcedure
      .input(z.object({ patientId: z.string(), examName: z.string() }))
      .query(async ({ input, ctx }) => {
        return await db.getExamHistoryByName(input.patientId, input.examName, ctx.user.id);
      }),
  }),

  // Rotas de Histórico de Exames
  examHistory: router({
    listByPatient: ownershipProcedure
      .input(z.object({ patientId: z.string() }))
      .query(async ({ input, ctx }) => {
        return await db.getExamHistoryByPatientId(input.patientId, ctx.user.id);
      }),
  }),

  // Rotas de Análise Médica
  medicalAnalysis: medicalAnalysisRouter,

  // Rotas de Correlações de Exames
  correlations: router({
    // Buscar correlações de um paciente (mais recente primeiro)
    listByPatient: publicProcedure
      .input(z.object({ patientId: z.string(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await correlationEngine.getPatientCorrelations(input.patientId, input.limit);
      }),
    
    // Buscar correlações com análise médica personalizada
    getWithMedicalAnalysis: ownershipProcedure
      .input(z.object({ patientId: z.string(), date: z.string() }))
      .query(async ({ input, ctx }) => {
        return await correlationEngine.getCorrelationsWithMedicalAnalysis(input.patientId, input.date, ctx.user.id);
      }),
    
    // Buscar correlação específica por ID
    getById: publicProcedure
      .input(z.object({ correlationId: z.number() }))
      .query(async ({ input }) => {
        return await correlationEngine.getCorrelationById(input.correlationId);
      }),
    
    // Processar correlações para uma data específica
    processForDate: ownershipProcedure
      .input(z.object({ patientId: z.string(), date: z.string() }))
      .mutation(async ({ input, ctx }) => {
        await correlationEngine.processCorrelationsForDate(input.patientId, input.date, ctx.user.id);
        return { success: true };
      }),
    
    // Processar todas as correlações de um paciente (histórico completo)
    processAll: ownershipProcedure
      .input(z.object({ patientId: z.string() }))
      .mutation(async ({ input, ctx }) => {
        await correlationEngine.processAllCorrelationsForPatient(input.patientId, ctx.user.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
