package com.dentalcare.dentalcaremanager.dto;

import com.dentalcare.dentalcaremanager.rdv.RendezVous;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
/**
 * DTO exposé côté frontend pour afficher les rendez-vous
 * sans exposer d’informations sensibles liées au patient.
 */

@Builder
@Getter
@AllArgsConstructor
@NoArgsConstructor
    public class RendezVousResponse {


        private Integer id;
        private LocalDate date;
        private LocalTime heureDebut;
        private LocalTime heureFin;
        private String status;

        private String nomPatient;
        // ✅ On extrait seulement le nom complet


    public static RendezVousResponse fromEntity(RendezVous rdv) {
        return RendezVousResponse.builder()
                .id(rdv.getId())
                .date(rdv.getDate())
                .heureDebut(rdv.getHeureDebut())
                .heureFin(rdv.getHeureFin())
                .status(rdv.getStatus().name())
                .nomPatient(rdv.getPatient() != null ? rdv.getPatient().getFullName() : "Inconnu")
                .build();
    }

}
