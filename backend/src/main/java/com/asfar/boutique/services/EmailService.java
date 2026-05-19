package com.asfar.boutique.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Service d'envoi d'emails pour la Boutique ASFAR.
 * Utilisé pour envoyer les codes de vérification d'abonnement Askary.
 */
@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * Envoie un code de vérification d'abonnement à l'adresse email du supporter.
     *
     * @param toEmail   L'adresse email du destinataire
     * @param code      Le code de vérification généré (ex: ASK-SUB-12345)
     * @param username  Le nom d'utilisateur pour personnaliser l'email
     */
    public void sendVerificationCode(String toEmail, String code, String username) {
        logger.info("Tentative d'envoi du code {} à {}", code, toEmail);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Boutique ASFAR - Code d'Activation de votre Abonnement Askary");
        message.setText(
            "Bonjour " + username + ",\n\n" +
            "Merci pour votre abonnement a la Boutique Officielle ASFAR !\n\n" +
            "Voici votre code d'activation :\n\n" +
            "    " + code + "\n\n" +
            "Saisissez ce code dans votre espace supporter pour activer votre carte d'abonnement Askary " +
            "et beneficier de 10% de reduction permanente + 50 points de fidelite bonus.\n\n" +
            "Si vous n'avez pas demande ce code, veuillez ignorer cet email.\n\n" +
            "---\n" +
            "Boutique Officielle ASFAR\n" +
            "AS FAR - Forces Armees Royales"
        );

        mailSender.send(message);
        logger.info("Email envoye avec succes a {}", toEmail);
    }
}
