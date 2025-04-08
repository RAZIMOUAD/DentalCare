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
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RendezVousServiceImpl implements RendezVousService {

    private final RendezVousRepository rendezVousRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public RendezVousResponse create(RendezVousRequest request) {
        // Récupérer l'utilisateur connecté
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        // Utilise la méthode personnalisée pour récupérer l'ID
        Integer userId = getUserIdByEmail(email);
        // 🔐 1. Vérifier que l'heure de début est bien avant l'heure de fin
        if (!request.getHeureDebut().isBefore(request.getHeureFin())) {
            throw new IllegalArgumentException("L'heure de début doit être inférieure à l'heure de fin.");
        }
        if (rendezVousRepository.existsConflict(userId, request.getDate(), request.getHeureDebut(), request.getHeureFin())) {
            throw new IllegalStateException("Un autre rendez-vous est déjà prévu pour ce créneau.");
        }

        // Créer le rendez-vous
        RendezVous rdv = RendezVous.builder()
                .date(request.getDate())
                .heureDebut(request.getHeureDebut())
                .heureFin(request.getHeureFin())
                .status(StatusRdv.EN_ATTENTE)
                .build();

        User patient = userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));

        rdv.setPatient(patient);
        // Sauvegarde et réponse
        RendezVous saved = rendezVousRepository.save(rdv);
        return RendezVousResponse.fromEntity(saved);
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
    public List<RendezVousResponse> getByUserId(Integer userId) {
        return rendezVousRepository.findByPatientId(userId).stream()
                .map(RendezVousResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteById(Integer id) {
        rendezVousRepository.deleteById(id);
    }
}
