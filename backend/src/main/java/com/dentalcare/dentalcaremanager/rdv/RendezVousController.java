package com.dentalcare.dentalcaremanager.rdv;

import com.dentalcare.dentalcaremanager.dto.RendezVousRequest;
import com.dentalcare.dentalcaremanager.dto.RendezVousResponse;
import com.dentalcare.dentalcaremanager.service.RendezVousService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/rendezvous")
public class RendezVousController {

    private final RendezVousService rendezVousService;

    @PostMapping
    @PreAuthorize("hasAnyAuthority(T(com.dentalcare.dentalcaremanager.security.RoleNames).ADMIN, T(com.dentalcare.dentalcaremanager.security.RoleNames).USER)")


    public ResponseEntity<RendezVousResponse> create(@RequestBody @Valid RendezVousRequest request) {
        return ResponseEntity.ok(rendezVousService.create(request));
    }

    @GetMapping
    @PreAuthorize("hasAuthority(T(com.dentalcare.dentalcaremanager.security.RoleNames).ADMIN)")
    public ResponseEntity<List<RendezVousResponse>> getAll() {
        return ResponseEntity.ok(rendezVousService.getAll());
    }

    @GetMapping("/by-user")
    @PreAuthorize("hasAnyAuthority(T(com.dentalcare.dentalcaremanager.security.RoleNames).ADMIN, T(com.dentalcare.dentalcaremanager.security.RoleNames).USER)")


    public ResponseEntity<List<RendezVousResponse>> getByUserId() {
        // Récupérer user connecté automatiquement
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Integer userId = rendezVousService.getUserIdByEmail(email);
        return ResponseEntity.ok(rendezVousService.getByUserId(userId));
    }
    @GetMapping("/by-date")
    @PreAuthorize("hasAnyAuthority(T(com.dentalcare.dentalcaremanager.security.RoleNames).ADMIN, T(com.dentalcare.dentalcaremanager.security.RoleNames).USER)")

    public ResponseEntity<List<RendezVousResponse>> getByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(rendezVousService.getByDate(date));
    }


    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority(T(com.dentalcare.dentalcaremanager.security.RoleNames).ADMIN, T(com.dentalcare.dentalcaremanager.security.RoleNames).USER)")

    public ResponseEntity<RendezVousResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(rendezVousService.getById(id)); // ✅ Méthode à créer
    }



    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority(T(com.dentalcare.dentalcaremanager.security.RoleNames).ADMIN)")


    public ResponseEntity<String> deleteById(@PathVariable Integer id) {
        rendezVousService.deleteById(id);
        return ResponseEntity.ok("Rendez-vous supprimé avec succès.");
    }
}
