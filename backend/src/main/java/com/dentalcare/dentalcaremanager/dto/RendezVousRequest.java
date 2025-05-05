package com.dentalcare.dentalcaremanager.dto;

import com.dentalcare.dentalcaremanager.rdv.RendezVous;
import com.dentalcare.dentalcaremanager.rdv.StatusRdv;
import com.dentalcare.dentalcaremanager.rdv.TypeRdv;
import com.dentalcare.dentalcaremanager.user.User;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * DTO utilisé pour créer un rendez-vous
 * toEntity est utilisée asidi dans la methode create de RendezvousServiceImpl pour alléger le code la bas
 * Reçoit uniquement les informations nécessaires depuis le frontend
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RendezVousRequest {

    @NotNull(message = "La date est obligatoire")
    @FutureOrPresent(message = "La date du rendez-vous doit être future ou aujourd’hui")
    private LocalDate date;

    @NotNull(message = "L'heure de début est obligatoire")
    private LocalTime heureDebut;

    @NotNull(message = "L'heure de fin est obligatoire")
    private LocalTime heureFin;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Le type de rendez-vous est requis")
    private TypeRdv type; // ex: "CONSULTATION" "SUIVI", etc.

    private String motif;        // ex: "Urgence", "Contrôle", etc.


    public RendezVous toEntity(User patient) {
        return RendezVous.builder()
                .date(this.date)
                .heureDebut(this.heureDebut)
                .heureFin(this.heureFin)
                .status(StatusRdv.EN_ATTENTE)
                .archive(false)
                .motif(this.motif)
                .type(this.type != null ? this.type : TypeRdv.CONSULTATION)
                .patient(patient)
                .build();
    }


}
