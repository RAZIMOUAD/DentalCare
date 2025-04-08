package com.dentalcare.dentalcaremanager.config;


import com.dentalcare.dentalcaremanager.role.Role;
import com.dentalcare.dentalcaremanager.user.User;
import com.dentalcare.dentalcaremanager.role.RoleRepository;
import com.dentalcare.dentalcaremanager.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Crée les rôles si inexistants
        Role adminRole = createRoleIfNotFound("ROLE_ADMIN");
        Role userRole = createRoleIfNotFound("ROLE_USER");

        // Crée un super utilisateur admin si inexistant
        Optional<User> adminOpt = userRepository.findByEmail("admin@dentalcare.com");
        if (adminOpt.isEmpty()) {
            User admin = User.builder()
                    .firstname("Super")
                    .lastname("Admin")
                    .email("admin@dentalcare.com")
                    .password(passwordEncoder.encode("AdminPass123"))
                    .roles(new HashSet<>(Set.of(adminRole)))
                    .enabled(true)
                    .accountLocked(false)
                    .build();

            userRepository.save(admin);
            System.out.println("✅ Admin user created successfully.");
        } else {
            System.out.println("ℹ️ Admin user already exists.");
        }
    }

    private Role createRoleIfNotFound(String roleName) {
        return roleRepository.findByName(roleName)
                .orElseGet(() -> {
                    Role newRole = Role.builder()
                            .name(roleName)
                            .build();
                    return roleRepository.save(newRole);
                });
    }
}

