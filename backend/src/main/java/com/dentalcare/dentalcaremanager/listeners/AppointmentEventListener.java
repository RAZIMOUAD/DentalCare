package com.dentalcare.dentalcaremanager.listeners;


import com.dentalcare.dentalcaremanager.events.AppointmentCreatedEvent;
import com.dentalcare.dentalcaremanager.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

/**
 * Listener qui capte les événements de création de rendez-vous
 * et déclenche l'envoi des notifications.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AppointmentEventListener {

    private final NotificationService notificationService;

    /**
     * Méthode qui écoute l'événement de création de RDV et déclenche les notifications.
     *
     * @param event l'événement de création de rendez-vous capté
     */
    @EventListener
    public void handleAppointmentCreatedEvent(AppointmentCreatedEvent event) {
        try {
            log.info("Événement capté : Nouveau rendez-vous pour patient {}", event.getPatient().getEmail());

            notificationService.sendNewAppointmentNotification(
                    event.getPatient(),
                    event.getRendezVous(),
                    event.getCreatedBy()
            );

        } catch (Exception e) {
            log.error("Erreur lors de l'envoi de la notification pour patient {}", event.getPatient().getEmail(), e);
        }
    }
}

