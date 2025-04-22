package com.dentalcare.dentalcaremanager.service;

import com.dentalcare.dentalcaremanager.patient.Patient;
import com.dentalcare.dentalcaremanager.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;
//Définit les fonctionnalités métier nécessaires+ intéragie avec PatientServiceImpl, PatientController
public interface PatientService {

    /**
     * 🔍 Recherche d’un patient par ID.
     */
    Optional<Patient> findById(Integer id);

    /**
     * 🔍 Recherche d’un patient via l’ID utilisateur lié.
     */
    Optional<Patient> findByUserId(Integer userId);

    /**
     * ✅ Crée automatiquement un patient à partir d’un utilisateur existant.
     * Utilisée pour les comptes utilisateurs enregistrés via l’interface publique.
     *
     * @param user l’utilisateur lié
     */
    void createPatientForUser(User user);

    /**
     * ✅ Variante pour créer un patient depuis l’ID d’un utilisateur.
     *
     * @param userId identifiant de l'utilisateur
     */
    void createPatientForUser(Integer userId);

    /**
     * 📋 Récupère tous les patients (admin).
     */
    List<Patient> findAll();

    /**
     * 💾 Sauvegarde ou met à jour un patient.
     */
    Patient save(Patient patient);

    /**
     * ❌ Supprime un patient par ID.
     */
    void deleteById(Integer id);

    /**
     * 🔍 Recherche avancée par nom, prénom ou email (partiel ou complet).
     */
    List<Patient> search(String keyword);

    /**
     * 👤 Recherche d’un utilisateur via son ID (utilisé dans RestService).
     */
    Optional<User> findUserById(Integer id);

    List<Patient> getPatientsWithUserAccount();
    int synchronizeAllPatientsFromUsers();
    Page<Patient> getFilteredPatients(Pageable pageable, String nom, Boolean createdByAdmin, Boolean enabled);

}
