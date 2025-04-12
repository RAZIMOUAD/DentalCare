export interface RendezVousResponse {
  id: number;
  date: string;             // 'YYYY-MM-DD'
  heureDebut: string;       // 'HH:mm'
  heureFin: string;         // 'HH:mm'
  status: string;           // e.g. "EN_ATTENTE"
  patientFullName: string;  // Construit côté backend
  description?: string;
}
