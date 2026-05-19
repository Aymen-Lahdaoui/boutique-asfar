package com.asfar.boutique.controllers;

import com.asfar.boutique.models.Order;
import com.asfar.boutique.models.User;
import com.asfar.boutique.repositories.OrderRepository;
import com.asfar.boutique.repositories.UserRepository;
import com.asfar.boutique.services.OrderService;
import com.asfar.boutique.services.OrderService.InsufficientStockException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    // Soumettre une nouvelle commande (avec contrôle strict du stock)
    @PostMapping
    public ResponseEntity<?> placeOrder(@RequestBody OrderService.OrderInput input) {
        try {
            Order savedOrder = orderService.placeOrder(input);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedOrder);
        } catch (InsufficientStockException e) {
            // Retourner une erreur 400 Bad Request claire en cas de rupture de stock
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Une erreur est survenue lors du traitement de votre commande.");
        }
    }

    // [ADMIN] Récupérer toutes les commandes (les plus récentes en premier)
    @GetMapping
    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    // Récupérer l'historique des commandes d'un utilisateur
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getOrdersByUserId(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur non trouvé.");
        }

        List<Order> orders = orderRepository.findByUserOrderByCreatedAtDesc(userOpt.get());
        return ResponseEntity.ok(orders);
    }

    // [ADMIN] Mettre à jour le statut d'une commande
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody StatusRequest request) {
        Optional<Order> orderOpt = orderRepository.findById(id);

        if (orderOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Commande introuvable.");
        }

        String status = request.getStatus();
        if (status == null || status.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Le statut ne peut pas être vide.");
        }

        Order order = orderOpt.get();
        order.setStatus(status.toUpperCase().trim());
        Order updatedOrder = orderRepository.save(order);

        return ResponseEntity.ok(updatedOrder);
    }

    public static class StatusRequest {
        private String status;

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }
}
