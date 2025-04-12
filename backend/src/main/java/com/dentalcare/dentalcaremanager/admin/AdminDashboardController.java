package com.dentalcare.dentalcaremanager.admin;

import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminDashboardController {

    @GetMapping("/dashboard")
    @RolesAllowed("ROLE_ADMIN")
    public ResponseEntity<String> dashboardHome() {
        return ResponseEntity.ok("Welcome to Admin Dashboard!");
    }

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

