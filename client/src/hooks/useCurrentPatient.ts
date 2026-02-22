import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

/**
 * Hook para obter o paciente do usuário autenticado
 * Retorna o primeiro paciente da lista (assumindo 1 paciente por usuário)
 */
export function useCurrentPatient() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  
  const { data: patients, isLoading: patientsLoading, error } = trpc.patients.list.useQuery(
    undefined,
    {
      enabled: isAuthenticated && !!user,
    }
  );

  const patient = patients && patients.length > 0 ? patients[0] : null;
  const loading = authLoading || patientsLoading;

  return {
    patient,
    patientId: patient?.id,
    loading,
    error,
    isAuthenticated,
  };
}
