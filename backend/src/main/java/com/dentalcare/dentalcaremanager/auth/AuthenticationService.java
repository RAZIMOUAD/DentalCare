package com.dentalcare.dentalcaremanager.auth;

import com.dentalcare.dentalcaremanager.dto.AccountStatusResponse;
import com.dentalcare.dentalcaremanager.email.EmailService;
import com.dentalcare.dentalcaremanager.role.Role;
import com.dentalcare.dentalcaremanager.email.EmailTemplateName;
import com.dentalcare.dentalcaremanager.role.RoleRepository;
import com.dentalcare.dentalcaremanager.security.JwtService;
import com.dentalcare.dentalcaremanager.user.Token;
import com.dentalcare.dentalcaremanager.user.TokenRepository;
import com.dentalcare.dentalcaremanager.user.User;
import com.dentalcare.dentalcaremanager.user.UserRepository;
import com.dentalcare.dentalcaremanager.service.PatientService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.HashMap;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final TokenRepository tokenRepository;
    private final EmailService emailService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PatientService patientService;

    @Value("${application.mailing.frontend.activation-url}")
    private String activationUrl;


    public void register(RegistrationRequest request) throws MessagingException {
        var userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new IllegalStateException("ROLE USER not found"));
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .accountLocked(false)
                .roles(Set.of(userRole))
                .enabled(false)
                .build();
        userRepository.save(user);
        sendValidationEmail(user);

    }

    private void sendValidationEmail(User user) throws MessagingException {
        var newToken = generateAndSaveActivationToken(user);

        emailService.sendEmail(
                user.getEmail(),
                user.getFullName(),
                EmailTemplateName.ACTIVATE_ACCOUNT,
                activationUrl,
                newToken,
                "Account activation"
        );
    }

    private String generateAndSaveActivationToken(User user) {
        // Generate a token
        String generatedToken = generateActivationCode(6);
        var token = Token.builder()
                .token(generatedToken)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(15))
                .user(user)
                .build();
        tokenRepository.save(token);

        return generatedToken;
    }
    private String generateActivationCode(int length) {
        String characters = "0123456789";
        StringBuilder codeBuilder = new StringBuilder();

        SecureRandom secureRandom = new SecureRandom();

        for (int i = 0; i < length; i++) {
            int randomIndex = secureRandom.nextInt(characters.length());
            codeBuilder.append(characters.charAt(randomIndex));
        }

        return codeBuilder.toString();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
       try{
        var auth = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = (User) auth.getPrincipal();
        var claims = new HashMap<String, Object>();

        claims.put("fullName", user.getFullName());

        var jwtToken = jwtService.generateToken(claims, user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .fullName(user.getFullName())
                .roles(user.getRoles().stream()
                        .map(Role::getName)
                        .toList())
                .build();
       } catch (org.springframework.security.authentication.DisabledException e) {
           throw new RuntimeException("Votre compte n'est pas encore activé. Veuillez vérifier votre email.");
       }
       catch (Exception e) {
           throw new RuntimeException("Échec de l'authentification. Veuillez vérifier vos identifiants.");
       }
    }


    @Transactional
    public void activateAccount(String token) throws MessagingException {
        Token savedToken = tokenRepository.findByToken(token)
                // todo exception has to be defined
                .orElseThrow(() -> new RuntimeException("Token d’activation invalide."));
        if (LocalDateTime.now().isAfter(savedToken.getExpiresAt())) {
            sendValidationEmail(savedToken.getUser());
            throw new RuntimeException("Activation token has expired. A new token has been send to the same email address");
        }

        var user = userRepository.findById(savedToken.getUser().getId())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setEnabled(true);
        userRepository.save(user);

        savedToken.setValidatedAt(LocalDateTime.now());
        tokenRepository.save(savedToken);
        // ✅ Création du patient **seulement si l'utilisateur est activé**
        patientService.createPatientForUser(user);

    }

    @Transactional
    public void resendActivationToken(String email) throws MessagingException {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Aucun utilisateur trouvé avec cet email"));

        if (user.isEnabled()) {
            throw new IllegalStateException("Le compte est déjà activé.");
        }

        sendValidationEmail(user);
    }
    public AccountStatusResponse checkAccountStatus(String email) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Aucun compte trouvé avec l'email : " + email));

        return AccountStatusResponse.builder()
                .email(user.getEmail())
                .enabled(user.isEnabled())
                .build();
    }
}
