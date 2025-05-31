package com.dentalcare.dentalcaremanager.service;

import com.dentalcare.dentalcaremanager.admin.RendezVousAdminResponse;
import com.dentalcare.dentalcaremanager.dto.RendezVousRequest;
import com.dentalcare.dentalcaremanager.dto.RendezVousResponse;
import com.dentalcare.dentalcaremanager.events.AppointmentCreatedEvent;
import com.dentalcare.dentalcaremanager.exception.InvalidRendezVousRequestException;
import com.dentalcare.dentalcaremanager.exception.RendezVousNotFoundException;
import com.dentalcare.dentalcaremanager.exception.SlotConflictException;
import com.dentalcare.dentalcaremanager.rdv.RendezVous;
import com.dentalcare.dentalcaremanager.rdv.StatusRdv;
import com.dentalcare.dentalcaremanager.user.User;
import com.dentalcare.dentalcaremanager.rdv.RendezVousRepository;
import com.dentalcare.dentalcaremanager.user.UserRepository;
import com.dentalcare.dentalcaremanager.websocket.RendezVousSocketController;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.context.ApplicationEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;
@Slf4j
@Service
@RequiredArgsConstructor
public class RendezVousServiceImpl implements RendezVousService {

    private final ApplicationEventPublisher eventPublisher;
    private final RendezVousRepository rendezVousRepository;
    private final UserRepository userRepository;
    private final RendezVousSocketController rendezVousSocketController;


    @Override
    @Transactional
    public RendezVousResponse create(RendezVousRequest request) {

        // 🔐 Étape 1 : Authentification sécurisée
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new SecurityException("Utilisateur non authentifié");
        }

        // Récupérer l'utilisateur connecté
        String email = authentication.getName();
        Integer userId = getUserIdByEmail(email);

        // 🔍 Étape 2 : Validation
        validateRdvRequest(request);

        // ⚠️ Étape 3 : Vérification de conflits
        boolean conflict = rendezVousRepository.existsSlotConflict(
                request.getDate(), request.getHeureDebut(), request.getHeureFin());

        if (conflict) {
            throw new SlotConflictException("Ce créneau est déjà réservé pour cette plage horaire.");
        }

        // 👤 Étape 4 : Chargement du patient
        User patient = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable"));

        // 🧠 Étape 5 : Construction de l'objet RendezVous
        RendezVous rdv = request.toEntity(patient);

        // 💾 Étape 6 : Sauvegarde
        RendezVous saved = rendezVousRepository.save(rdv);
        RendezVousResponse response = RendezVousResponse.fromEntity(saved);

        // 📢 Étape 7 : WebSocket
        rendezVousSocketController.broadcastRdvCreated(response);

        // 📣 Étape 8 : Publier l'événement Spring pour déclencher la notification
        eventPublisher.publishEvent(new AppointmentCreatedEvent(this, patient, saved, email));

        log.info("📅 Nouveau RDV pour l'utilisateur {}", email);
        return response;
    }

    //Méthode used dans la méthode create : centraliser la validation
    private void validateRdvRequest(RendezVousRequest request) {
        if (request.getDate() == null || request.getHeureDebut() == null || request.getHeureFin() == null) {
            throw new InvalidRendezVousRequestException("Date et heures du rendez-vous sont obligatoires.");
        }
        // 🔐 3. Vérifier que l'heure de début est bien avant l'heure de fin
        if (!request.getHeureDebut().isBefore(request.getHeureFin())) {
            throw new InvalidRendezVousRequestException("L'heure de début doit précéder l'heure de fin.");
        }
        if (request.getHeureDebut().isBefore(LocalTime.of(8, 0)) ||
                request.getHeureFin().isAfter(LocalTime.of(18, 0))) {
            throw new InvalidRendezVousRequestException("Les rendez-vous doivent être entre 08:00 et 18:00.");
        }
    }

    @Override
    public Integer getUserIdByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"))
                .getId();
    }

    @Override
    public RendezVousResponse getById(Integer id) {
        return rendezVousRepository.findById(id)
                .map(RendezVousResponse::fromEntity)
                .orElseThrow(() -> new RendezVousNotFoundException(id));
    }


    @Override
    public List<RendezVousResponse> getAll() {
        return rendezVousRepository.findAll().stream()
                .map(RendezVousResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<RendezVousResponse> getByDate(LocalDate date) {
        return rendezVousRepository.findByDate(date).stream()
                .map(RendezVousResponse::fromEntity)
                .collect(Collectors.toList());
    }
    @Override
    public List<RendezVousResponse> getByMonth(int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        return rendezVousRepository.findByDateBetween(start, end).stream()
                .map(RendezVousResponse::fromEntity)
                .collect(Collectors.toList());
    }
//cette méthode fait exactement le même job que getByMonth(year, month) mais de manière plus naturelle à appeler via une seule LocalDate

    public List<RendezVousResponse> findAllByMonth(LocalDate dateInMonth) {
        LocalDate start = dateInMonth.withDayOfMonth(1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        return rendezVousRepository.findAllByMonth(start, end).stream()
                .map(RendezVousResponse::fromEntity)
                .collect(Collectors.toList());
    }


    @Override
    public List<RendezVousResponse> getByUserId(Integer userId) {
        return rendezVousRepository.findByPatientId(userId).stream()
                .map(RendezVousResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Integer id) {
        rendezVousRepository.deleteById(id);
        log.info("🗑️ Rendez-vous ID={} supprimé", id);
    }

    // METHODE LIEES A RendezVousRepository
    @Override
    public List<RendezVousResponse> findByStatus(StatusRdv status) {
        return rendezVousRepository.findByStatus(status).stream()
                .map(RendezVousResponse::fromEntity)
                .collect(Collectors.toList());
    }
//Permettre à l’admin de confirmer un rendez-vous (passer son statut de EN_ATTENTE → CONFIRME).
@Override
@Transactional
public void confirmRendezVous(Integer id) {
    RendezVous rdv = rendezVousRepository.findById(id)
            .orElseThrow(() -> new RendezVousNotFoundException(id));

    if (rdv.getStatus() == StatusRdv.ANNULE) {
        throw new InvalidRendezVousRequestException("Ce rendez-vous a été annulé et ne peut pas être confirmé.");
    }

    rdv.setStatus(StatusRdv.CONFIRME);
    RendezVous saved = rendezVousRepository.save(rdv);
    RendezVousResponse response = RendezVousResponse.fromEntity(saved);
    log.info("✅ Rendez-vous ID={} confirmé", id);
    rendezVousSocketController.broadcastRdvConfirmed(response);
}
//Permettre à l’admin de refuser un rendez-vous, en le passant à StatusRdv.ANNULE.
@Override
@Transactional
public void rejectRendezVous(Integer id) {
    RendezVous rdv = rendezVousRepository.findById(id)
            .orElseThrow(() -> new RendezVousNotFoundException(id));

    if (rdv.getStatus() == StatusRdv.CONFIRME) {
        throw new InvalidRendezVousRequestException("Ce rendez-vous est déjà confirmé et ne peut pas être annulé.");
    }

    rdv.setStatus(StatusRdv.ANNULE);
    RendezVous saved = rendezVousRepository.save(rdv);
    RendezVousResponse response = RendezVousResponse.fromEntity(saved);
    log.info("❌ Rendez-vous ID={} rejeté", id);
    rendezVousSocketController.broadcastRdvRejected(response);
}
    @Override
    public List<RendezVousResponse> getConfirmedByMonth(int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        return rendezVousRepository.findConfirmedBetweenDates(StatusRdv.CONFIRME, start, end)
                .stream()
                .map(RendezVousResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public List<RendezVousAdminResponse> getAllForAdminByMonth(int year, int month) {
        LocalDate start = LocalDate.of(year, month, 1);
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        return rendezVousRepository.findByDateBetween(start, end).stream()
                .map(RendezVousAdminResponse::fromEntity)
                .collect(Collectors.toList());
    }
    @Override
    @Transactional
    public RendezVousResponse update(Integer id, RendezVousRequest request) {

        // 🔍 1. Charger le rendez-vous existant
        RendezVous rendezVous = rendezVousRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Rendez-vous introuvable avec ID: " + id));

        // 🔐 2. (Optionnel) Contrôle d’accès → à activer si besoin
        // Vérifier si l'utilisateur courant est autorisé à modifier ce RDV (Admin ou le patient lui-même)

        // ⚠️ 3. Vérification de conflits si demande de confirmation
        if (request.getStatus() == StatusRdv.CONFIRME) {
            boolean conflict = rendezVousRepository.existsConflictExcludingId(
                    id,
                    request.getDate(),
                    request.getHeureDebut(),
                    request.getHeureFin(),
                    StatusRdv.CONFIRME
            );

            if (conflict) {
                throw new SlotConflictException("⛔ Ce créneau est déjà occupé par un autre rendez-vous confirmé.");
            }
        }

        // ✅ 4. Mise à jour des champs
        rendezVous.setDate(request.getDate());
        rendezVous.setHeureDebut(request.getHeureDebut());
        rendezVous.setHeureFin(request.getHeureFin());
        rendezVous.setType(request.getType());
        rendezVous.setMotif(request.getMotif());
        rendezVous.setStatus(request.getStatus());

        // 💾 5. Sauvegarde avec persistance JPA
        RendezVous updated = rendezVousRepository.save(rendezVous);

        // 🎯 6. Conversion vers DTO
        return RendezVousResponse.fromEntity(updated);
    }
    public List<RendezVousResponse> getAppointmentsForDay(LocalDate date) {
        List<RendezVous> rdvs = rendezVousRepository.findByDateOrderByHeureDebutAsc(date);
        return rdvs.stream().map(RendezVousResponse::fromEntity).limit(5).toList();
    }

    @Override
    public List<RendezVous> searchByNomOrEmail(String query) {
        System.out.println("🔍 Recherche backend : " + query);
        return rendezVousRepository.searchByNomOrEmail(query);
    }
    @Override
    public List<RendezVous> searchByDate(LocalDate date) {
        System.out.println("🔍 Recherche backend : " + date);
        return rendezVousRepository.findByDate(date);
    }

}
