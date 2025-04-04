package com.dentalcare.dentalcaremanager.config;

import com.dentalcare.dentalcaremanager.role.Role;
import com.dentalcare.dentalcaremanager.role.RoleRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final RoleRepository roleRepository;

    @Bean
    public CommandLineRunner setupRoles(RoleRepository roleRepository) {
        return args -> {
            List<String> roles = List.of("USER", "ADMIN");
            for (String role : roles) {
                roleRepository.findByName(role)
                        .orElseGet(() -> roleRepository.save(Role.builder().name(role).build()));
            }
        };
    }

}

