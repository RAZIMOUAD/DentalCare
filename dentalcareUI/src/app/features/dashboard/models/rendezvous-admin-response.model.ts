export interface RendezVousAdminResponse {
  id: number;
  date: string; // format 'YYYY-MM-DD'
  heureDebut: string; // format 'HH:mm:ss'
  heureFin: string;

  type: string;       // Ex: "CONSULTATION", "SUIVI", etc.
  status: string;     // Ex: "EN_ATTENTE", "CONFIRME", etc.

  motif: string;
  praticien: string;

  patientId: number | null;
  nomPatient: string;
  emailPatient: string;

  patientEnabled: boolean;
  createdByAdmin: boolean;

  version: number;
}
