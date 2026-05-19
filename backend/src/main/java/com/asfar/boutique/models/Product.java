package com.asfar.boutique.models;

import jakarta.persistence.*;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(length = 1000)
    private String description;

    private double price;

    @Column(name = "image_url")
    private String imageUrl;

    private String category; // MATCHDAY, STREETWEAR, ACCESSOIRES, HERITAGE

    @Column(name = "stock_quantity")
    private int stockQuantity;

    @Column(name = "is_personalizable")
    private boolean personalizable; // Indique si le flocage est disponible

    private String sizes; // Exemple: "S,M,L,XL" ou "Taille Unique"

    // Constructors
    public Product() {}

    public Product(Long id, String name, String description, double price, String imageUrl, String category, int stockQuantity, boolean personalizable, String sizes) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.category = category;
        this.stockQuantity = stockQuantity;
        this.personalizable = personalizable;
        this.sizes = sizes;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public int getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(int stockQuantity) { this.stockQuantity = stockQuantity; }

    public boolean isPersonalizable() { return personalizable; }
    public void setPersonalizable(boolean personalizable) { this.personalizable = personalizable; }

    public String getSizes() { return sizes; }
    public void setSizes(String sizes) { this.sizes = sizes; }
}
