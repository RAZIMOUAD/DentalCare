package com.dentalcare.dentalcaremanager.service;

import com.dentalcare.dentalcaremanager.dto.RendezVousRequest;
import com.dentalcare.dentalcaremanager.dto.RendezVousResponse;
import com.dentalcare.dentalcaremanager.rdv.RendezVous;
import com.dentalcare.dentalcaremanager.rdv.StatusRdv;
import com.dentalcare.dentalcaremanager.user.User;
import com.dentalcare.dentalcaremanager.rdv.RendezVousRepository;
import com.dentalcare.dentalcaremanager.user.UserRepository;
import jakarta.persistence.EntityNotFoundException;
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

    private final RendezVousRepository rendezVousRepository;
    private final UserRepository userRepository;

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
        // Utilise la méthode personnalisée pour récupérer l'ID
        Integer userId = getUserIdByEmail(email);

        // 🔍 Étape 2 : Validation des données de date/heure
        validateRdvRequest(request);

        // ⚠️ Étape 3 : Vérification de conflits
        boolean conflict = rendezVousRepository.existsConflict(
                userId, request.getDate(), request.getHeureDebut(), request.getHeureFin());

        if (conflict) {
            throw new IllegalStateException("Ce créneau est déjà réservé.");
        }

        // 👤 Étape 4 : Chargement du patient
        User patient = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable"));
        // 🧠 Étape 5 : Construction de l'objet RendezVous
        RendezVous rdv =request.toEntity(patient);

        // Sauvegarde et réponse
        RendezVous saved = rendezVousRepository.save(rdv);
        log.info("📅 Nouveau RDV pour l'utilisateur {}", email);
        return RendezVousResponse.fromEntity(saved);

    }
    //Méthode used dans la méthode create : centraliser la validation
    private void validateRdvRequest(RendezVousRequest request) {
        if (request.getDate() == null || request.getHeureDebut() == null || request.getHeureFin() == null  ) {
            throw new IllegalArgumentException("Date et heures du rendez-vous sont obligatoires.");
        }
        // 🔐 3. Vérifier que l'heure de début est bien avant l'heure de fin
        if (!request.getHeureDebut().isBefore(request.getHeureFin())) {
            throw new IllegalArgumentException("L'heure de début doit être inférieure à l'heure de fin.");
        }
        if (request.getHeureDebut().isBefore(LocalTime.of(8, 0)) ||
                request.getHeureFin().isAfter(LocalTime.of(18, 0))) {
            throw new IllegalArgumentException("Les rendez-vous doivent être entre 08:00 et 20:00.");
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
                .orElseThrow(() -> new EntityNotFoundException("Aucun rendez-vous trouvé avec l'ID : " + id));
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
                .orElseThrow(() -> new EntityNotFoundException("Aucun rendez-vous trouvé avec l'ID : " + id));

        if (rdv.getStatus() == StatusRdv.ANNULE) {
            throw new IllegalStateException("Ce rendez-vous a été annulé et ne peut pas être confirmé.");
        }

        rdv.setStatus(StatusRdv.CONFIRME);
        rendezVousRepository.save(rdv);
    }
//Permettre à l’admin de refuser un rendez-vous, en le passant à StatusRdv.ANNULE.
    @Override
    @Transactional
    public void rejectRendezVous(Integer id) {
        RendezVous rdv = rendezVousRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Aucun rendez-vous trouvé avec l'ID : " + id));

        if (rdv.getStatus() == StatusRdv.CONFIRME) {
            throw new IllegalStateException("Ce rendez-vous est déjà confirmé et ne peut pas être annulé ici.");
        }

        rdv.setStatus(StatusRdv.ANNULE);
        rendezVousRepository.save(rdv);
    }


}
