export interface NotificationResponse {
  id: number;
  recipientEmail: string;
  notificationType: string; // ex: "RDV_CONFIRMATION", "RAPPEL", etc.
  status: string;           // ex: "SUCCES", "ECHEC"
  message: string;
  attemptedAt: string;      // LocalDateTime → ISO string

}
