package com.asfar.boutique.services;

import com.asfar.boutique.models.Order;
import com.asfar.boutique.models.OrderItem;
import com.asfar.boutique.models.Product;
import com.asfar.boutique.models.User;
import com.asfar.boutique.repositories.OrderRepository;
import com.asfar.boutique.repositories.ProductRepository;
import com.asfar.boutique.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Transactional
    public Order placeOrder(OrderInput input) {
        // 1. Récupérer l'utilisateur
        Optional<User> userOpt = userRepository.findById(input.getUserId());
        if (userOpt.isEmpty()) {
            throw new RuntimeException("Utilisateur non trouvé.");
        }
        User user = userOpt.get();

        Order order = new Order();
        order.setUser(user);
        order.setShippingAddress(input.getShippingAddress());
        order.setCreatedAt(LocalDateTime.now());
        order.setStatus("PAID"); // Simulation : payé directement au checkout

        double subTotal = 0.0;
        List<OrderItem> items = new ArrayList<>();

        // 2. Parcourir et valider les articles
        for (OrderItemInput itemInput : input.getItems()) {
            Optional<Product> productOpt = productRepository.findById(itemInput.getProductId());
            if (productOpt.isEmpty()) {
                throw new RuntimeException("Produit avec l'ID " + itemInput.getProductId() + " introuvable.");
            }

            Product product = productOpt.get();

            // CONTRÔLE DES STOCKS STRICT : Empêche la vente à découvert
            if (product.getStockQuantity() < itemInput.getQuantity()) {
                throw new InsufficientStockException("Stock insuffisant pour '" + product.getName() + 
                        "'. (Disponible: " + product.getStockQuantity() + ", Demandé: " + itemInput.getQuantity() + ")");
            }

            // Déduction du stock
            product.setStockQuantity(product.getStockQuantity() - itemInput.getQuantity());
            productRepository.save(product);

            // Calcul du prix de l'article (Flocage : +50 DH si personnalisé)
            double unitPrice = product.getPrice();
            if (product.isPersonalizable() && itemInput.getCustomName() != null && !itemInput.getCustomName().trim().isEmpty()) {
                unitPrice += 50.0; // Coût du flocage
            }

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setQuantity(itemInput.getQuantity());
            orderItem.setPrice(unitPrice);
            orderItem.setSize(itemInput.getSize());
            orderItem.setCustomName(itemInput.getCustomName() != null ? itemInput.getCustomName().toUpperCase() : null);
            orderItem.setCustomNumber(itemInput.getCustomNumber());

            items.add(orderItem);
            subTotal += (unitPrice * itemInput.getQuantity());
        }

        order.setItems(items);
        order.setSubTotal(subTotal);

        // 3. Calcul de la réduction (10% pour les abonnés Carte Askary)
        double discount = 0.0;
        if (user.isSubscriber()) {
            discount = subTotal * 0.10;
        }
        order.setDiscountAmount(discount);

        // 4. Frais de port (Gratuit dès 800 DH d'achat, sinon 30 DH)
        double shipping = (subTotal - discount >= 800.0) ? 0.0 : 30.0;
        order.setShippingFee(shipping);

        // 5. Total Final
        double total = subTotal - discount + shipping;
        order.setTotalPrice(total);

        // 6. Fidélité : Cumul des points (1 point pour 10 DH d'achat)
        int pointsEarned = (int) (total / 10);
        user.setFidelityPoints(user.getFidelityPoints() + pointsEarned);
        userRepository.save(user);

        // 7. Enregistrer la commande
        return orderRepository.save(order);
    }

    // Exception personnalisée pour le contrôle du stock
    public static class InsufficientStockException extends RuntimeException {
        public InsufficientStockException(String message) {
            super(message);
        }
    }

    // Input DTO classes
    public static class OrderInput {
        private Long userId;
        private String shippingAddress;
        private List<OrderItemInput> items;

        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public String getShippingAddress() { return shippingAddress; }
        public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

        public List<OrderItemInput> getItems() { return items; }
        public void setItems(List<OrderItemInput> items) { this.items = items; }
    }

    public static class OrderItemInput {
        private Long productId;
        private int quantity;
        private String size;
        private String customName;
        private Integer customNumber;

        public Long getProductId() { return productId; }
        public void setProductId(Long productId) { this.productId = productId; }

        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }

        public String getSize() { return size; }
        public void setSize(String size) { this.size = size; }

        public String getCustomName() { return customName; }
        public void setCustomName(String customName) { this.customName = customName; }

        public Integer getCustomNumber() { return customNumber; }
        public void setCustomNumber(Integer customNumber) { this.customNumber = customNumber; }
    }
}
