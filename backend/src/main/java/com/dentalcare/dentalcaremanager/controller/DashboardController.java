package com.dentalcare.dentalcaremanager.controller;

import com.dentalcare.dentalcaremanager.rdv.RendezVous;
import com.dentalcare.dentalcaremanager.rdv.RendezVousRepository;
import com.dentalcare.dentalcaremanager.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final RendezVousRepository rendezVousRepository;
    private final UserRepository userRepository;

    /**
     * 📊 Statistiques globales affichées dans le dashboard admin.
     */
    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        long totalPatients = userRepository.countByRoleName("ROLE_USER");
        long rdvToday = rendezVousRepository.countByDate(LocalDate.now());
        double revenue = rdvToday * 250.0; // 💰 Simulation : 250 MAD par RDV

        return Map.of(
                "totalPatients", totalPatients,
                "appointmentsToday", rdvToday,
                "totalRevenue", revenue
        );
    }

    /**
     * 📅 Liste des rendez-vous du jour.
     */
    @GetMapping("/today")
    public List<RendezVous> getTodayAppointments() {
        return rendezVousRepository.findByDate(LocalDate.now());
    }
}
