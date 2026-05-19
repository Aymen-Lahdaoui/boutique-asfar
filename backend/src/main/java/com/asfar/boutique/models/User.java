package com.asfar.boutique.models;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String username;

    private String role; // "USER", "ADMIN"

    @Column(name = "askary_card_number")
    private String askaryCardNumber; // E.g., ASK-19580

    @Column(name = "is_subscriber")
    private boolean subscriber; // true si carte d'abonnement valide

    @Column(name = "fidelity_points")
    private int fidelityPoints;

    // Constructors
    public User() {}

    public User(Long id, String email, String password, String username, String role, String askaryCardNumber, boolean subscriber, int fidelityPoints) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.username = username;
        this.role = role;
        this.askaryCardNumber = askaryCardNumber;
        this.subscriber = subscriber;
        this.fidelityPoints = fidelityPoints;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getAskaryCardNumber() { return askaryCardNumber; }
    public void setAskaryCardNumber(String askaryCardNumber) { this.askaryCardNumber = askaryCardNumber; }

    public boolean isSubscriber() { return subscriber; }
    public void setSubscriber(boolean subscriber) { this.subscriber = subscriber; }

    public int getFidelityPoints() { return fidelityPoints; }
    public void setFidelityPoints(int fidelityPoints) { this.fidelityPoints = fidelityPoints; }
}
