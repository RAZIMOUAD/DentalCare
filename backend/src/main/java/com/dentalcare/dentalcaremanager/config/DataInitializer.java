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
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // 🧹 Nettoyage de rôles invalides
        detachInvalidRoles();
        deleteInvalidRoles();// 💥

        // ✅ Crée les rôles standard si inexistant
        Role adminRole = createRoleIfNotFound("ROLE_ADMIN");
        Role userRole = createRoleIfNotFound("ROLE_USER");

        // 👤 Crée un super utilisateur admin si inexistant
        userRepository.findByEmail("admin@dentalcare.com")
                .ifPresentOrElse(
                        user -> System.out.println("ℹ️ Admin user already exists."),
                        () -> {
                            User admin = User.builder()
                                    .firstname("Super")
                                    .lastname("Admin")
                                    .email("admin@dentalcare.com")
                                    .password(passwordEncoder.encode("AdminPass123"))
                                    .roles(Set.of(adminRole))
                                    .enabled(true)
                                    .accountLocked(false)
                                    .build();

                            userRepository.save(admin);
                            System.out.println("✅ Admin user created successfully.");
                        }
                );
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

    // 💥 Supprime les anciens rôles invalides
    private void deleteInvalidRoles() {
        roleRepository.findByName("ADMIN").ifPresent(role -> {
            roleRepository.delete(role);
            System.out.println("❌ Role 'ADMIN' supprimé.");
        });
        roleRepository.findByName("USER").ifPresent(role -> {
            roleRepository.delete(role);
            System.out.println("❌ Role 'USER' supprimé.");
        });
    }
    private void detachInvalidRoles() {
        List<User> users = userRepository.findAll();
        for (User user : users) {
            Set<Role> filteredRoles = user.getRoles().stream()
                    .filter(role -> !role.getName().equals("ADMIN") && !role.getName().equals("USER"))
                    .collect(Collectors.toSet());
            user.setRoles(filteredRoles);
        }
        userRepository.saveAll(users);
    }

}
