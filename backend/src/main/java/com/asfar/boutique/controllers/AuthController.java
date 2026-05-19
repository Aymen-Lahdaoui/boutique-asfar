package com.asfar.boutique.controllers;

import com.asfar.boutique.models.User;
import com.asfar.boutique.repositories.UserRepository;
import com.asfar.boutique.services.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    // Stockage temporaire des codes de vérification en mémoire (userId -> code)
    private final Map<Long, String> verificationCodes = new ConcurrentHashMap<>();

    @GetMapping("/users")
    public ResponseEntity<?> getUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

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

    // Résiliation d'Abonnement Askary
    @PostMapping("/cancel-askary")
    public ResponseEntity<?> cancelAskary(@RequestBody CancelRequest request) {
        Optional<User> userOpt = userRepository.findById(request.getUserId());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur introuvable.");
        }

        User user = userOpt.get();
        user.setAskaryCardNumber(null);
        user.setSubscriber(false);

        User updatedUser = userRepository.save(user);
        updatedUser.setPassword(null);
        return ResponseEntity.ok(updatedUser);
    }

    // Envoi du code de vérification par email
    @PostMapping("/send-verification-code")
    public ResponseEntity<?> sendVerificationCode(@RequestBody SendCodeRequest request) {
        Optional<User> userOpt = userRepository.findById(request.getUserId());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur introuvable.");
        }

        User user = userOpt.get();

        // Générer un code aléatoire au format ASK-SUB-XXXXX
        int randomDigits = (int) (10000 + Math.random() * 90000);
        String code = "ASK-SUB-" + randomDigits;

        // Stocker le code en mémoire pour validation ultérieure
        verificationCodes.put(user.getId(), code);

        try {
            // Envoyer le vrai email via SMTP
            emailService.sendVerificationCode(user.getEmail(), code, user.getUsername());
            return ResponseEntity.ok(Map.of(
                "message", "Code de vérification envoyé à " + user.getEmail(),
                "sent", true
            ));
        } catch (Exception e) {
            // En cas d'échec d'envoi (SMTP non configuré, etc.), retourner le code en fallback
            return ResponseEntity.ok(Map.of(
                "message", "Service email indisponible. Code de simulation : " + code,
                "sent", false,
                "fallbackCode", code
            ));
        }
    }

    // Vérification du code saisi par l'utilisateur
    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody VerifyCodeRequest request) {
        Optional<User> userOpt = userRepository.findById(request.getUserId());

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur introuvable.");
        }

        String expectedCode = verificationCodes.get(request.getUserId());

        if (expectedCode == null) {
            return ResponseEntity.badRequest().body("Aucun code en attente pour cet utilisateur. Veuillez demander un nouveau code.");
        }

        if (!expectedCode.equalsIgnoreCase(request.getCode().trim())) {
            return ResponseEntity.badRequest().body("Code incorrect. Veuillez vérifier votre email et réessayer.");
        }

        // Code valide ! Supprimer le code utilisé
        verificationCodes.remove(request.getUserId());

        // Générer la carte Askary finale
        int cardDigits = (int) (10000 + Math.random() * 90000);
        String generatedCard = "ASK-" + cardDigits;

        User user = userOpt.get();
        user.setAskaryCardNumber(generatedCard);
        user.setSubscriber(true);
        user.setFidelityPoints(user.getFidelityPoints() + 50);

        User updatedUser = userRepository.save(user);
        updatedUser.setPassword(null);
        return ResponseEntity.ok(updatedUser);
    }

    // Request DTO classes
    public static class CancelRequest {
        private Long userId;
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
    }

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

    public static class SendCodeRequest {
        private Long userId;
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }
    }

    public static class VerifyCodeRequest {
        private Long userId;
        private String code;

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
    }
}

