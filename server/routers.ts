import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";

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
    list: publicProcedure.query(async () => {
      return await db.getAllPatients();
    }),
    getById: publicProcedure
      .input(z.object({ patientId: z.string() }))
      .query(async ({ input }) => {
        return await db.getPatientById(input.patientId);
      }),
  }),

  // Rotas de Exames
  exams: router({
    listByPatient: publicProcedure
      .input(z.object({ patientId: z.string() }))
      .query(async ({ input }) => {
        return await db.getExamsByPatientId(input.patientId);
      }),
    listByPatientAndPeriod: publicProcedure
      .input(z.object({ patientId: z.string(), year: z.number() }))
      .query(async ({ input }) => {
        return await db.getExamsByPatientIdAndPeriod(input.patientId, input.year);
      }),
    getHistory: publicProcedure
      .input(z.object({ patientId: z.string(), examName: z.string() }))
      .query(async ({ input }) => {
        return await db.getExamHistoryByName(input.patientId, input.examName);
      }),
  }),

  // Rotas de Histórico de Exames
  examHistory: router({
    listByPatient: publicProcedure
      .input(z.object({ patientId: z.string() }))
      .query(async ({ input }) => {
        return await db.getExamHistoryByPatientId(input.patientId);
      }),
  }),
});

export type AppRouter = typeof appRouter;
