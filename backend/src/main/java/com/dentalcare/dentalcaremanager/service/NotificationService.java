package com.dentalcare.dentalcaremanager.service;

import com.dentalcare.dentalcaremanager.dto.NotificationResponse;
import com.dentalcare.dentalcaremanager.notifications.NotificationEntity;
import com.dentalcare.dentalcaremanager.notifications.NotificationRepository;
import com.dentalcare.dentalcaremanager.rdv.RendezVous;
import com.dentalcare.dentalcaremanager.user.User;
import com.dentalcare.dentalcaremanager.websocket.NotificationSocketController;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationSocketController notificationSocketController;

    public void sendNewAppointmentNotification(User patient, RendezVous rendezVous, String createdBy) {
        try {
            String subject = "Confirmation de votre rendez-vous chez DentalCare";
            String message = buildNewAppointmentMessage(patient, rendezVous, createdBy);

            sendEmail(patient.getEmail(), subject, message);

            // ✅ Enregistrer + envoyer via WebSocket
            sendAndBroadcast(patient.getEmail(), "NEW_APPOINTMENT", "SUCCESS", message, null, rendezVous);

            log.info("Notification de création de rendez-vous envoyée à {}", patient.getEmail());
        } catch (Exception e) {
            log.error("Erreur lors de l'envoi de la notification de création de RDV à {}", patient.getEmail(), e);
            throw e;
        }
    }

    public void sendReminderNotification(User patient, RendezVous rendezVous) {
        try {
            String subject = "Rappel : Rendez-vous DentalCare demain";
            String message = buildReminderMessage(patient, rendezVous);

            sendEmail(patient.getEmail(), subject, message);

            // ✅ Enregistrer + envoyer via WebSocket
            sendAndBroadcast(patient.getEmail(), "REMINDER", "SUCCESS", message, null, rendezVous);

            log.info("Notification de rappel de rendez-vous envoyée à {}", patient.getEmail());
        } catch (Exception e) {
            log.error("Erreur lors de l'envoi de la notification de rappel de RDV à {}", patient.getEmail(), e);
            throw e;
        }
    }

    // ============================================

    public void sendAndBroadcast(String recipientEmail, String type, String status, String message, String errorMessage, RendezVous rendezVous) {
        String trimmedMessage = (message != null && message.length() > 1000)
                ? message.substring(0, 1000) + "..."
                : message;

        NotificationEntity notification = NotificationEntity.builder()
                .recipientEmail(recipientEmail)
                .notificationType(type)
                .status(status)
                .message(trimmedMessage)
                .attemptedAt(LocalDateTime.now())
                .errorMessage(errorMessage)
                .rendezVousId(rendezVous != null ? rendezVous.getId() : null)
                .build();

        notificationRepository.save(notification);

        // 📡 Broadcast WebSocket
        notificationSocketController.broadcastNotification(
                NotificationResponse.builder()
                        .id(notification.getId())
                        .recipientEmail(notification.getRecipientEmail())
                        .notificationType(notification.getNotificationType())
                        .status(notification.getStatus())
                        .message(notification.getMessage())
                        .attemptedAt(notification.getAttemptedAt())
                        .build()
        );
    }

    private String buildNewAppointmentMessage(User patient, RendezVous rendezVous, String createdBy) {
        String intro = (createdBy != null)
                ? "Votre rendez-vous a été pris par " + createdBy + "."
                : "Vous avez réservé un nouveau rendez-vous.";

        return String.format(
                "Bonjour %s,\n\n%s\n\nDétails du rendez-vous :\n- Date : %s\n- Heure : %s\n- Motif : %s\n\nÀ bientôt chez DentalCare !",
                patient.getFirstname(),
                intro,
                rendezVous.getDate(),
                rendezVous.getHeureDebut(),
                rendezVous.getMotif()
        );
    }

    private String buildReminderMessage(User patient, RendezVous rendezVous) {
        return String.format(
                "Bonjour %s,\n\nCeci est un rappel pour votre rendez-vous de demain :\n- Date : %s\n- Heure : %s\n- Motif : %s\n\nMerci et à bientôt chez DentalCare !",
                patient.getFirstname(),
                rendezVous.getDate(),
                rendezVous.getHeureDebut(),
                rendezVous.getMotif()
        );
    }

    private void sendEmail(String to, String subject, String message) {
        // Simulation d'envoi d'email
        log.info("=== Envoi Email ===\nÀ: {}\nSujet: {}\nMessage:\n{}\n", to, subject, message);
    }
}
