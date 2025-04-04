package com.dentalcare.dentalcaremanager.auth;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class AuthenticationResponse {

    private String token;

    // 🔁 Pour implémentation future de refresh token (auth persistance)
    private String refreshToken;

    // 👤 Infos de l'utilisateur utiles pour affichage côté frontend
    private String email;
    private String fullName;

    // 🔐 Pour afficher ou restreindre dynamiquement les permissions (Angular)
    private List<String> roles;
}
