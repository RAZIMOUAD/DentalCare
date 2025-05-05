package com.dentalcare.dentalcaremanager.websocket;

import com.dentalcare.dentalcaremanager.dto.NotificationResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

/**
 * Contrôleur WebSocket dédié à l'envoi en temps réel des notifications
 * vers le frontend Angular via /topic/notifications.
 */
@Slf4j
@Controller
@RequiredArgsConstructor
public class NotificationSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Diffuse une notification à tous les abonnés du topic WebSocket.
     *
     * @param response l'objet NotificationResponse à envoyer
     */
    public void broadcastNotification(NotificationResponse response) {
        try {
            messagingTemplate.convertAndSend("/topic/notifications", response);
            log.info("📡 Notification WebSocket envoyée à /topic/notifications pour {}", response.getRecipientEmail());
        } catch (Exception e) {
            log.error("❌ Échec d'envoi de la notification WebSocket : {}", e.getMessage(), e);
        }
    }
}
