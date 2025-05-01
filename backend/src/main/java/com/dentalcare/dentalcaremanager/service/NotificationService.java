package com.dentalcare.dentalcaremanager.service;


import com.dentalcare.dentalcaremanager.notifications.NotificationEntity;
import com.dentalcare.dentalcaremanager.notifications.NotificationRepository;
import com.dentalcare.dentalcaremanager.rdv.RendezVous;
import com.dentalcare.dentalcaremanager.user.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public void sendNewAppointmentNotification(User patient, RendezVous rendezVous, String createdBy) {
        try {
            String subject = "Confirmation de votre rendez-vous chez DentalCare";
            String message = buildNewAppointmentMessage(patient, rendezVous, createdBy);

            sendEmail(patient.getEmail(), subject, message);

            // 🔥 Enregistrer le succès
            saveNotification(patient.getEmail(), "NEW_APPOINTMENT", "SUCCESS", message, null);

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

            // 🔥 Enregistrer le succès
            saveNotification(patient.getEmail(), "REMINDER", "SUCCESS", message, null);

            log.info("Notification de rappel de rendez-vous envoyée à {}", patient.getEmail());
        } catch (Exception e) {
            log.error("Erreur lors de l'envoi de la notification de rappel de RDV à {}", patient.getEmail(), e);
            throw e;
        }
    }

    // ============================================

    private void saveNotification(String recipient, String type, String status, String message, String errorMessage) {
        NotificationEntity notification = NotificationEntity.builder()
                .recipientEmail(recipient)
                .notificationType(type)
                .status(status)
                .message(message.length() > 500 ? message.substring(0, 500) + "..." : message)
                .attemptedAt(LocalDateTime.now())
                .errorMessage(errorMessage)
                .build();

        notificationRepository.save(notification);
    }

    private String buildNewAppointmentMessage(User patient, RendezVous rendezVous, String createdBy) {
        String intro = (createdBy != null) ?
                "Votre rendez-vous a été pris par " + createdBy + "." :
                "Vous avez réservé un nouveau rendez-vous.";

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
