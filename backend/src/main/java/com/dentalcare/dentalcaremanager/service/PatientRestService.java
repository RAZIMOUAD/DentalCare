package com.dentalcare.dentalcaremanager.service;

import com.dentalcare.dentalcaremanager.dto.PatientRequest;
import com.dentalcare.dentalcaremanager.dto.PatientResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface PatientRestService {

    /**
     * 🔄 Crée un nouveau patient (utilisé côté admin).
     */
    PatientResponse createPatient(PatientRequest request);

    /**
     * 🔍 Récupère tous les patients.
     */
    List<PatientResponse> getAllPatients();

    /**
     * 🔍 Récupère un patient par son ID.
     */
    PatientResponse getPatientById(Integer id);

    /**
     * ♻️ Met à jour un patient existant.
     */
    PatientResponse updatePatient(Integer id, PatientRequest request);

    /**
     * ❌ Supprime un patient par son ID.
     */
    void deletePatient(Integer id);

    /**
     * 🔍 Recherche de patients selon plusieurs critères.
     */
    List<PatientResponse> searchPatients(String nom, String email, Integer userId);

    List<PatientResponse> getPatientsWithUserAccount();
    Page<PatientResponse> getPaginatedPatients(int page, int size, String nom, Boolean createdByAdmin, Boolean enabled);
    PatientResponse getPatientByEmail(String email);
    PatientResponse getCurrentPatient();


}
