package com.dentalcare.dentalcaremanager.admin;

import com.dentalcare.dentalcaremanager.rdv.RendezVous;
import com.dentalcare.dentalcaremanager.user.User;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RendezVousAdminResponse {

    private Integer id;
    private LocalDate date;
    private LocalTime heureDebut;
    private LocalTime heureFin;

    private String type;       // CONSULTATION, SUIVI, etc.
    private String status;     // EN_ATTENTE, CONFIRME, etc.

    private String motif;
    private String praticien;

    private Integer patientId;
    private String nomPatient;
    private String emailPatient;

    private boolean patientEnabled;
    private boolean createdByAdmin;

    private Long version; // pour optimistic locking

    public static RendezVousAdminResponse fromEntity(RendezVous rdv) {
        User patient = rdv.getPatient();

        return RendezVousAdminResponse.builder()
                .id(rdv.getId())
                .date(rdv.getDate())
                .heureDebut(rdv.getHeureDebut())
                .heureFin(rdv.getHeureFin())
                .type(rdv.getType() != null ? rdv.getType().name() : null)
                .status(rdv.getStatus() != null ? rdv.getStatus().name() : null)
                .motif(rdv.getMotif())
                .praticien(rdv.getPraticien())

                .patientId(patient != null ? patient.getId() : null)
                .nomPatient(patient != null ? patient.getFullName() : "Inconnu")
                .emailPatient(patient != null ? patient.getEmail() : "non communiqué")
                .patientEnabled(patient != null && patient.isEnabled())
                .createdByAdmin(patient != null && patient.isCreatedByAdmin())

                .version(rdv.getVersion())
                .build();
    }
}
