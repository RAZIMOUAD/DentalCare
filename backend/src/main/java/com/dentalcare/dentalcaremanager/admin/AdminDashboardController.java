package com.dentalcare.dentalcaremanager.admin;

import com.dentalcare.dentalcaremanager.rdv.StatusRdv;

import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminDashboardController {

    @GetMapping("/dashboard")
    @RolesAllowed("ROLE_ADMIN")
    public ResponseEntity<String> dashboardHome() {
        return ResponseEntity.ok("Welcome to Admin Dashboard!");
    }
   /* @GetMapping("/stats/rdv")
    public ResponseEntity<?> getRdvStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRdv", rendezVousService.getAll().size());
        stats.put("rdvEnAttente", rendezVousService.findByStatus(StatusRdv.EN_ATTENTE).size());
        stats.put("rdvConfirme", rendezVousService.findByStatus(StatusRdv.CONFIRME).size());
        // Ajoute plus de stats ici
        return ResponseEntity.ok(stats);
    }*/

    // Exemple de futurs endpoints
    @GetMapping("/users")
    @RolesAllowed("ROLE_ADMIN")
    public ResponseEntity<?> listUsers() {
        // TODO: Implémenter la récupération des utilisateurs
        return ResponseEntity.ok("Liste des utilisateurs");
    }

    @GetMapping("/stats")
    @RolesAllowed("ROLE_ADMIN")
    public ResponseEntity<?> dashboardStats() {
        // TODO: Implémenter les statistiques
        return ResponseEntity.ok("Statistiques de l'app");
    }
}

