package com.dentalcare.dentalcaremanager.rdv;

import com.dentalcare.dentalcaremanager.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;


@Entity
@Table(name = "rendezvous")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RendezVous {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private LocalDate date;

    private LocalTime heureDebut;

    private LocalTime heureFin;

    @Enumerated(EnumType.STRING)
    private StatusRdv status; // EN_ATTENTE, CONFIRME, ANNULE

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User patient;

    @Column(length = 512)
    private String motif;

    private boolean archive;
}

