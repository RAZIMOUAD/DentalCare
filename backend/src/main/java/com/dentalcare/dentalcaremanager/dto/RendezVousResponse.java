package com.dentalcare.dentalcaremanager.dto;

import com.dentalcare.dentalcaremanager.rdv.RendezVous;
import com.dentalcare.dentalcaremanager.rdv.StatusRdv;
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
    private String motif;
        private String nomPatient;
        // ✅ On extrait seulement le nom complet
        private String type;
    private String praticien;
    private boolean isConfirmed;
    private boolean canBeCancelled;


    public static RendezVousResponse fromEntity(RendezVous rdv) {
        boolean isConfirmed = rdv.getStatus() == StatusRdv.CONFIRME;
        boolean canBeCancelled = rdv.getStatus() == StatusRdv.EN_ATTENTE;

        return RendezVousResponse.builder()
                .id(rdv.getId())
                .date(rdv.getDate())
                .heureDebut(rdv.getHeureDebut())
                .heureFin(rdv.getHeureFin())
                .status(rdv.getStatus().name())
                .motif(rdv.getMotif())
                .type(rdv.getType() != null ? rdv.getType().name() : null)
                .praticien(rdv.getPraticien())
                .nomPatient(rdv.getPatient() != null ? rdv.getPatient().getFullName() : "Inconnu")
                .isConfirmed(isConfirmed)
                .canBeCancelled(canBeCancelled)
                .build();
    }

}
