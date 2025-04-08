package com.dentalcare.dentalcaremanager.dto;

import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * DTO utilisé pour créer un rendez-vous
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

}
