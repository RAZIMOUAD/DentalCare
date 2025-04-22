package com.dentalcare.dentalcaremanager.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

//Sert à retourner des données au frontend (GET)+ interagie avec PatientServiceImpl, PatientController
@Data
@Builder
public class PatientResponse {

    private Integer id;

    private String nom;

    private String prenom;

    private String email;

    private String cin;

    private LocalDate dateNaissance;

    private String adresse;

    private String genre;

    private Boolean enabled;

    private Boolean createdByAdmin;

    private LocalDate dateDesactivation;

    private Integer userId; // null si non lié
}