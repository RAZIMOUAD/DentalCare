package com.dentalcare.dentalcaremanager.controller;

import com.dentalcare.dentalcaremanager.dto.PatientRequest;
import com.dentalcare.dentalcaremanager.dto.PatientResponse;
import com.dentalcare.dentalcaremanager.service.PatientRestService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PagedResourcesAssembler;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.hateoas.PagedModel;
import java.util.List;

//	Gère les requêtes HTTP (GET, POST, etc.) +Appelle PatientRestService, reçoit/retourne des DTOs
@RestController
@RequestMapping("/patients")
@RequiredArgsConstructor
public class PatientController {

    private final PatientRestService patientRestService;

    /** 🔍 Récupérer tous les patients */
    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<PatientResponse>> getAll() {
        return ResponseEntity.ok(patientRestService.getAllPatients());
    }

    /** 🔍 Rechercher des patients intelligemment */
    @GetMapping("/search")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<PatientResponse>> search(
            @RequestParam(required = false) String nom,
            @RequestParam(required = false) String email,
            @RequestParam(required = false) Integer userId
    ) {
        return ResponseEntity.ok(patientRestService.searchPatients(nom, email, userId));
    }

    /** 📥  Ajouter un nouveau patient (manuel ou lié à un compte) */
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<PatientResponse> create(@RequestBody @Valid PatientRequest request) {
        return ResponseEntity.ok(patientRestService.createPatient(request));
    }

    /** ♻️ Mettre à jour un patient  */
    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<PatientResponse> update(@PathVariable Integer id, @RequestBody @Valid PatientRequest request) {
        return ResponseEntity.ok(patientRestService.updatePatient(id, request));
    }

    /** ❌ Supprimer un patient */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<String> delete(@PathVariable Integer id) {
        try {
            patientRestService.deletePatient(id);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Patient introuvable avec l'ID : " + id);
        }
    }


    /** 🔍 Récupérer un patient par ID */
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<PatientResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(patientRestService.getPatientById(id));
    }
    @GetMapping("/paginated")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<PagedModel<EntityModel<PatientResponse>>> getPaginatedPatients(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String nom,
            @RequestParam(required = false) Boolean createdByAdmin,
            @RequestParam(required = false) Boolean enabled,
            PagedResourcesAssembler<PatientResponse> assembler
    ) {
        Page<PatientResponse> paged = patientRestService.getPaginatedPatients(page, size, nom, createdByAdmin, enabled);
        PagedModel<EntityModel<PatientResponse>> model = assembler.toModel(paged);
        return ResponseEntity.ok(model);
    }


    @GetMapping("/with-user")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<PatientResponse>> getPatientsWithUserAccount() {
        return ResponseEntity.ok(patientRestService.getPatientsWithUserAccount());
    }
    @GetMapping("/email")
    @PreAuthorize("hasAnyAuthority('ROLE_ADMIN', 'ROLE_USER')")
    public ResponseEntity<PatientResponse> getByEmail(@RequestParam String email) {
        return ResponseEntity.ok(patientRestService.getPatientByEmail(email));
    }
    @GetMapping("/me")
    @PreAuthorize("hasAnyAuthority('ROLE_USER', 'ROLE_ADMIN')")
    public ResponseEntity<PatientResponse> getCurrentPatient() {
        return ResponseEntity.ok(patientRestService.getCurrentPatient());
    }

}
