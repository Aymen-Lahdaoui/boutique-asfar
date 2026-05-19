package com.asfar.boutique.controllers;

import com.asfar.boutique.models.User;
import com.asfar.boutique.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Inscription
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Cet email est déjà utilisé par un autre compte Askary.");
        }

        // Hachage du mot de passe
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");
        user.setSubscriber(false);
        user.setFidelityPoints(0);

        User savedUser = userRepository.save(user);
        savedUser.setPassword(null); // Ne pas retourner le mot de passe haché
        return ResponseEntity.ok(savedUser);
    }

    // Connexion
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou mot de passe incorrect.");
        }

        User user = userOpt.get();
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou mot de passe incorrect.");
        }

        user.setPassword(null); // Ne pas retourner le mot de passe haché
        return ResponseEntity.ok(user);
    }

    // Validation Carte Askary
    @PostMapping("/validate-askary")
    public ResponseEntity<?> validateAskary(@RequestBody AskaryRequest request) {
        Optional<User> userOpt = userRepository.findById(request.getUserId());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur introuvable.");
        }

        String cardNumber = request.getCardNumber();
        // Validation : la carte doit commencer par "ASK-" et être suivie d'au moins 4 chiffres
        if (cardNumber == null || !cardNumber.toUpperCase().startsWith("ASK-") || cardNumber.length() < 7) {
            return ResponseEntity.badRequest().body("Numéro de carte invalide. Le format doit être 'ASK-XXXXX' (ex: ASK-19580).");
        }

        User user = userOpt.get();
        user.setAskaryCardNumber(cardNumber.toUpperCase());
        user.setSubscriber(true); // Activer la réduction d'abonné de 10%
        user.setFidelityPoints(user.getFidelityPoints() + 50); // Offrir 50 points de fidélité de bienvenue !

        User updatedUser = userRepository.save(user);
        updatedUser.setPassword(null);
        return ResponseEntity.ok(updatedUser);
    }

    // Request DTO classes
    public static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    public static class AskaryRequest {
        private Long userId;
        private String cardNumber;

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public String getCardNumber() { return cardNumber; }
        public void setCardNumber(String cardNumber) { this.cardNumber = cardNumber; }
    }
}
