package com.asfar.boutique.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER, orphanRemoval = true)
    @JoinColumn(name = "order_id") // Crée une clé étrangère order_id dans la table order_items
    private List<OrderItem> items = new ArrayList<>();

    @Column(name = "sub_total")
    private double subTotal;

    @Column(name = "discount_amount")
    private double discountAmount; // E.g., 10% si abonné Carte Askary

    @Column(name = "shipping_fee")
    private double shippingFee;

    @Column(name = "total_price")
    private double totalPrice;

    private String status; // PENDING, PAID, SHIPPED

    @Column(name = "shipping_address")
    private String shippingAddress;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Constructors
    public Order() {
        this.createdAt = LocalDateTime.now();
        this.status = "PENDING";
    }

    public Order(Long id, User user, List<OrderItem> items, double subTotal, double discountAmount, double shippingFee, double totalPrice, String status, String shippingAddress, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.items = items;
        this.subTotal = subTotal;
        this.discountAmount = discountAmount;
        this.shippingFee = shippingFee;
        this.totalPrice = totalPrice;
        this.status = status;
        this.shippingAddress = shippingAddress;
        this.createdAt = createdAt != null ? createdAt : LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<OrderItem> getItems() { return items; }
    public void setItems(List<OrderItem> items) { this.items = items; }

    public double getSubTotal() { return subTotal; }
    public void setSubTotal(double subTotal) { this.subTotal = subTotal; }

    public double getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(double discountAmount) { this.discountAmount = discountAmount; }

    public double getShippingFee() { return shippingFee; }
    public void setShippingFee(double shippingFee) { this.shippingFee = shippingFee; }

    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
