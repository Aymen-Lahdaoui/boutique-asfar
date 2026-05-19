package com.asfar.boutique.models;

import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    private int quantity;

    private double price; // Snapshot du prix au moment de l'achat

    @Column(name = "custom_name")
    private String customName; // Optionnel : nom pour le flocage (ex: "AYMANE")

    @Column(name = "custom_number")
    private Integer customNumber; // Optionnel : numéro pour le flocage (ex: 12)

    private String size; // Optionnel : taille choisie (ex: "L")

    // Constructors
    public OrderItem() {}

    public OrderItem(Long id, Product product, int quantity, double price, String customName, Integer customNumber, String size) {
        this.id = id;
        this.product = product;
        this.quantity = quantity;
        this.price = price;
        this.customName = customName;
        this.customNumber = customNumber;
        this.size = size;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getCustomName() { return customName; }
    public void setCustomName(String customName) { this.customName = customName; }

    public Integer getCustomNumber() { return customNumber; }
    public void setCustomNumber(Integer customNumber) { this.customNumber = customNumber; }

    public String getSize() { return size; }
    public void setSize(String size) { this.size = size; }
}
