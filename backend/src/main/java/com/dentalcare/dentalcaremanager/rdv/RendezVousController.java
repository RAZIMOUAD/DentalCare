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
@RequestMapping("/rendezvous")
public class RendezVousController {

    private final RendezVousService rendezVousService;
//création sécurisée
    @PostMapping
    @PreAuthorize("hasAnyAuthority(T(com.dentalcare.dentalcaremanager.security.RoleNames).ADMIN, T(com.dentalcare.dentalcaremanager.security.RoleNames).USER)")
    public ResponseEntity<RendezVousResponse> create(@RequestBody @Valid RendezVousRequest request) {
        return ResponseEntity.ok(rendezVousService.create(request));
    }
//réservé admin
    @GetMapping
    @PreAuthorize("hasAuthority(T(com.dentalcare.dentalcaremanager.security.RoleNames).ADMIN)")
    public ResponseEntity<List<RendezVousResponse>> getAll() {
        return ResponseEntity.ok(rendezVousService.getAll());
    }
//auto-résolution userId
    @GetMapping("/by-user")
    @PreAuthorize("hasAnyAuthority(T(com.dentalcare.dentalcaremanager.security.RoleNames).ADMIN, T(com.dentalcare.dentalcaremanager.security.RoleNames).USER)")
    public ResponseEntity<List<RendezVousResponse>> getByUserId() {
        // Récupérer user connecté automatiquement
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        Integer userId = rendezVousService.getUserIdByEmail(email);
        return ResponseEntity.ok(rendezVousService.getByUserId(userId));
    }

    //utile pour calendar ou filtrage
    @GetMapping("/by-date")
    @PreAuthorize("hasAnyAuthority(T(com.dentalcare.dentalcaremanager.security.RoleNames).ADMIN, T(com.dentalcare.dentalcaremanager.security.RoleNames).USER)")
    public ResponseEntity<List<RendezVousResponse>> getByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(rendezVousService.getByDate(date));
    }
    //appel classique pour avoir la vue du mois dans le calendrier complet
    @GetMapping("/by-month")
    @PreAuthorize("hasAnyAuthority(T(com.dentalcare.dentalcaremanager.security.RoleNames).ADMIN, T(com.dentalcare.dentalcaremanager.security.RoleNames).USER)")
    public ResponseEntity<List<RendezVousResponse>> getByMonth(
            @RequestParam int year,
            @RequestParam int month) {
        List<RendezVousResponse> rendezVousList = rendezVousService.getByMonth(year, month);
        return ResponseEntity.ok(rendezVousList);
    }

    //permettant d’utiliser la méthode optimisée findAllByMonth(LocalDate) côté backend REST, afin de récupérer les rendez-vous d’un mois spécifique.
    @GetMapping("/by-month-date")
    @PreAuthorize("hasAnyAuthority(T(com.dentalcare.dentalcaremanager.security.RoleNames).ADMIN, T(com.dentalcare.dentalcaremanager.security.RoleNames).USER)")
    public ResponseEntity<List<RendezVousResponse>> findByMonthDate(
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateInMonth) {
        return ResponseEntity.ok(rendezVousService.findAllByMonth(dateInMonth));
    }
//Confirmer un rendez-vous
    @PutMapping("/{id}/confirm")
    @PreAuthorize("hasAuthority(T(com.dentalcare.dentalcaremanager.security.RoleNames).ADMIN)")
    public ResponseEntity<String> confirmRendezVous(@PathVariable Integer id) {
        rendezVousService.confirmRendezVous(id);
        return ResponseEntity.ok("Rendez-vous confirmé avec succès.");
    }
//Rejeter un rendez-vous
    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAuthority(T(com.dentalcare.dentalcaremanager.security.RoleNames).ADMIN)")
    public ResponseEntity<String> rejectRendezVous(@PathVariable Integer id) {
        rendezVousService.rejectRendezVous(id);
        return ResponseEntity.ok("Rendez-vous annulé.");
    }
//Lister tous les rendez-vous par statut
    @GetMapping("/by-status")
    @PreAuthorize("hasAuthority(T(com.dentalcare.dentalcaremanager.security.RoleNames).ADMIN)")
    public ResponseEntity<List<RendezVousResponse>> findByStatus(
            @RequestParam("status") String statusStr) {
        try {
            StatusRdv status = StatusRdv.valueOf(statusStr.toUpperCase());
            return ResponseEntity.ok(rendezVousService.findByStatus(status));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    //Récupération d’un RDV par ID
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyAuthority(T(com.dentalcare.dentalcaremanager.security.RoleNames).ADMIN, T(com.dentalcare.dentalcaremanager.security.RoleNames).USER)")
    public ResponseEntity<RendezVousResponse> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(rendezVousService.getById(id)); // ✅ Méthode à créer
    }

//Suppression par l’admin
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority(T(com.dentalcare.dentalcaremanager.security.RoleNames).ADMIN)")

    public ResponseEntity<String> deleteById(@PathVariable Integer id) {
        rendezVousService.deleteById(id);
        return ResponseEntity.ok("Rendez-vous supprimé avec succès.");
    }
}
