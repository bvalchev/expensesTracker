package com.uni.service;

import java.util.Properties;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import org.springframework.stereotype.Service;

public class EmailService {

    private final Properties props;
    private String receiver;
    private String plan = "";
    private int amount;

    private static final String USERNAME = "garosotirov894@gmail.com";
    private static final String PASSWORD = "projecttest";
    private static final String SUBJECT_BASE = "You have enough funds for: ";
    private static final String MESSAGE_FIRST_BASE = "The amount for ";
    private static final String MESSAGE_SECOND_BASE = " has been acquired. You can spend ";
    private static final String MESSAGE_THIRD_BASE = " on accomplishing you goal.";

    public EmailService(String receiver, String plan, int amount) {
        props = new Properties();
        props.put("mail.smtp.starttls.enable", "true");
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.host", "smtp.gmail.com");
        props.put("mail.smtp.port", "587");
        props.put("mail.debug", "true");

        this.receiver = receiver;
        this.plan = plan;
        this.amount = amount;
    }

    public void sendEmail() {

        Session session = Session.getInstance(props,
                new javax.mail.Authenticator() {
                    protected PasswordAuthentication getPasswordAuthentication() {
                        return new PasswordAuthentication(USERNAME, PASSWORD);
                    }
                });

        try {

            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(USERNAME));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(receiver));
            message.setSubject(SUBJECT_BASE);

            String msg =
                    MESSAGE_FIRST_BASE + plan + MESSAGE_SECOND_BASE + amount + MESSAGE_THIRD_BASE;
            message.setText(msg);

            Transport.send(message);

            System.out.println("Message sent successfully.");

        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
}