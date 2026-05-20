-- Nettoyage des tables pour éviter les doublons lors des recharges
-- Hibernate crée les tables avant d'exécuter data.sql grâce au paramètre ddl-auto=update
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM products;
DELETE FROM users;

-- Insertion des produits de test de l'ASFAR
INSERT INTO products (id, name, description, price, image_url, category, stock_quantity, is_personalizable, sizes) VALUES
(1, 'Maillot officiel de compétition', 'Le maillot officiel de l''ASFAR pour les matchs à domicile, arborant fièrement les couleurs traditionnelles.', 250.0, '/image/maillot 3c.jpg', 'MATCHDAY', 50, true, 'S,M,L,XL,XXL'),
(2, 'Polo', 'Polo officiel de sortie noir avec détails gris. Logo brodé.', 230.0, '/image/maillot noir.jpg', 'STREETWEAR', 30, false, 'S,M,L,XL'),
(3, 'Survêtement', 'Survêtement complet d''entraînement officiel.', 550.0, '/image/veste.jpg', 'STREETWEAR', 20, false, 'M,L,XL'),
(4, 'Jogging', 'Ensemble jogging confortable.', 440.0, '/image/veste2.jpg', 'STREETWEAR', 25, false, 'S,M,L,XL'),
(5, 'Polo', 'Polo gris chiné officiel de la collection lifestyle.', 230.0, '/image/maillot gris.jpg', 'STREETWEAR', 40, false, 'S,M,L'),
(6, 'Maillot officiel de compétition', 'Troisième maillot de compétition de la saison.', 250.0, '/image/maillot b3c.jpg', 'MATCHDAY', 15, true, 'S,M,L,XL');

-- Insertion des utilisateurs de test
-- Mot de passe 'Password123' haché par BCrypt : $2a$10$TY0ry.EpaNHtZ058/qGuyOklJP9eoLm1r5Wojp4Hkp/MfLW6aYrZe
-- Mot de passe 'AdminPassword123' haché par BCrypt : $2a$10$fOVLL0dmUIHz1yR.9QSIO.sfnjKGGTTOVK5Kb15.1rJVMIye/rvqS

-- 1. Client Standard (Non abonné, sans carte)
INSERT INTO users (id, email, password, username, role, askary_card_number, is_subscriber, fidelity_points) VALUES
(1, 'client@askary.ma', '$2a$10$TY0ry.EpaNHtZ058/qGuyOklJP9eoLm1r5Wojp4Hkp/MfLW6aYrZe', 'Aymane Askary', 'USER', NULL, false, 0);

-- 2. Client Abonné (Détenteur d'une Carte Askary "ASK-19580" déjà validée, lui donnant 10% de réduction)
INSERT INTO users (id, email, password, username, role, askary_card_number, is_subscriber, fidelity_points) VALUES
(2, 'abonne@askary.ma', '$2a$10$TY0ry.EpaNHtZ058/qGuyOklJP9eoLm1r5Wojp4Hkp/MfLW6aYrZe', 'Med Askary 12', 'USER', 'ASK-19580', true, 150);

-- 3. Administrateur (Accès au Dashboard Admin de gestion)
INSERT INTO users (id, email, password, username, role, askary_card_number, is_subscriber, fidelity_points) VALUES
(3, 'admin@askary.ma', '$2a$10$fOVLL0dmUIHz1yR.9QSIO.sfnjKGGTTOVK5Kb15.1rJVMIye/rvqS', 'Admin ASFAR', 'ADMIN', NULL, false, 0);

-- 4. Responsable Logistique / Presse à chaud / Flocage
INSERT INTO users (id, email, password, username, role, askary_card_number, is_subscriber, fidelity_points) VALUES
(4, 'preparateur@askary.ma', '$2a$10$TY0ry.EpaNHtZ058/qGuyOklJP9eoLm1r5Wojp4Hkp/MfLW6aYrZe', 'Logistique ASFAR', 'LOGISTICS', NULL, false, 0);

-- 5. Responsable Marketing & Promotions (Gestion du catalogue)
INSERT INTO users (id, email, password, username, role, askary_card_number, is_subscriber, fidelity_points) VALUES
(5, 'marketing@askary.ma', '$2a$10$TY0ry.EpaNHtZ058/qGuyOklJP9eoLm1r5Wojp4Hkp/MfLW6aYrZe', 'Marketing ASFAR', 'MARKETING', NULL, false, 0);

-- 6. Support SAV & Modération
INSERT INTO users (id, email, password, username, role, askary_card_number, is_subscriber, fidelity_points) VALUES
(6, 'support@askary.ma', '$2a$10$TY0ry.EpaNHtZ058/qGuyOklJP9eoLm1r5Wojp4Hkp/MfLW6aYrZe', 'Support ASFAR', 'SUPPORT', NULL, false, 0);

-- 7. Supporter Abonné VIP (Accès privilégié et remise automatique)
INSERT INTO users (id, email, password, username, role, askary_card_number, is_subscriber, fidelity_points) VALUES
(7, 'vip@askary.ma', '$2a$10$TY0ry.EpaNHtZ058/qGuyOklJP9eoLm1r5Wojp4Hkp/MfLW6aYrZe', 'Aymane VIP 1958', 'SUBSCRIBER_VIP', 'ASK-VIP77', true, 500);

-- 8. Responsable (RESPO)
INSERT INTO users (id, email, password, username, role, askary_card_number, is_subscriber, fidelity_points) VALUES
(8, 'respo@askary.ma', '$2a$10$TY0ry.EpaNHtZ058/qGuyOklJP9eoLm1r5Wojp4Hkp/MfLW6aYrZe', 'Responsable ASFAR', 'RESPO', NULL, false, 0);

-- 9. Admin des Responsables (ADMIN_RESPO)
INSERT INTO users (id, email, password, username, role, askary_card_number, is_subscriber, fidelity_points) VALUES
(9, 'adminrespo@askary.ma', '$2a$10$TY0ry.EpaNHtZ058/qGuyOklJP9eoLm1r5Wojp4Hkp/MfLW6aYrZe', 'Admin des Responsables', 'ADMIN_RESPO', NULL, false, 0);
