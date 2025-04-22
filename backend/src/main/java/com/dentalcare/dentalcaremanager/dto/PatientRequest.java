package com.dentalcare.dentalcaremanager.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class PatientRequest {

    @NotBlank(message = "Le prénom est requis")
    @Size(max = 50, message = "Le prénom ne doit pas dépasser 50 caractères")
    private String prenom;

    @NotBlank(message = "Le nom est requis")
    @Size(max = 50, message = "Le nom ne doit pas dépasser 50 caractères")
    private String nom;

    @NotBlank(message = "L’email est requis")
    @Email(message = "L’email est invalide")
    private String email;

    private String cin;

    private LocalDate dateNaissance; // format ISO-8601, ex: "2000-05-12"

    private String adresse;

    private String genre; // Ex: "Homme", "Femme", "Autre"

    private boolean enabled = true;

    // Ce champ est utile si on souhaite associer un User existant
    private Integer userId;
}
