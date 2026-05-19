package com.asfar.boutique.controllers;

import com.asfar.boutique.models.Product;
import com.asfar.boutique.repositories.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    // Récupérer tous les produits
    @GetMapping
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // Récupérer un produit par son ID
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> productOpt = productRepository.findById(id);
        return productOpt.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Récupérer les produits par catégorie
    @GetMapping("/category/{category}")
    public List<Product> getProductsByCategory(@PathVariable String category) {
        return productRepository.findByCategory(category.toUpperCase());
    }

    // [ADMIN] Créer un nouveau produit
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        // Normaliser la catégorie en majuscules
        if (product.getCategory() != null) {
            product.setCategory(product.getCategory().toUpperCase());
        }
        Product savedProduct = productRepository.save(product);
        return ResponseEntity.ok(savedProduct);
    }

    // [ADMIN] Mettre à jour un produit
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product productDetails) {
        Optional<Product> productOpt = productRepository.findById(id);

        if (productOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Product product = productOpt.get();
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setImageUrl(productDetails.getImageUrl());
        if (productDetails.getCategory() != null) {
            product.setCategory(productDetails.getCategory().toUpperCase());
        }
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setPersonalizable(productDetails.isPersonalizable());
        product.setSizes(productDetails.getSizes());

        Product updatedProduct = productRepository.save(product);
        return ResponseEntity.ok(updatedProduct);
    }

    // [ADMIN] Supprimer un produit
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        Optional<Product> productOpt = productRepository.findById(id);

        if (productOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        productRepository.delete(productOpt.get());
        return ResponseEntity.ok().body("Le produit a été supprimé avec succès.");
    }
}
