export interface RendezVousResponse {
  id: number;
  date: string;
  heureDebut: string;
  heureFin: string;
  status: string;
  motif?: string;
  nomPatient: string;
  type?: string;
  praticien: string;
  confirmed: boolean;       // ✔ correspond au JSON
  canBeCancelled: boolean;
}
