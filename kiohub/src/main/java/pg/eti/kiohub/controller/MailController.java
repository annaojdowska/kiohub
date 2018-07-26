///*
// * To change this license header, choose License Headers in Project Properties.
// * To change this template file, choose Tools | Templates
// * and open the template in the editor.
// */
//package pg.eti.kiohub.controller;
//
//import java.util.List;
//import java.util.Properties;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import javax.mail.Message;
//import javax.mail.MessagingException;
//import javax.mail.PasswordAuthentication;
//import javax.mail.Session;
//import javax.mail.Transport;
//import javax.mail.internet.InternetAddress;
//import javax.mail.internet.MimeMessage;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.MediaType;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.RequestMethod;
//import org.springframework.web.bind.annotation.RequestParam;
//
//
///**
// *
// * @author Tomasz
// */
//@Controller
//public class MailController {
//
//    @Value("${mail.invitation.username}")
//    private String username;
//
//    @Value("${mail.invitation.password}")
//    private String password; 
//    
//    @Value("${mail.invitation.subject}")
//    private String subject; 
//    
//    @Value("${mail.invitation.text}")
//    private String text; 
//  
//    @PostMapping(value = "/sendinvitation", params = {"topic", "recipients"}, produces = {"application/JSON"}) 
//    public ResponseEntity sendinvitation(
//            @RequestParam("topic") String topic,
//            @RequestParam("recipients") List<String> recipients
//    ) {
// 
//        Properties props = new Properties();
//        props.put("mail.smtp.auth", "true");
//        props.put("mail.smtp.starttls.enable", "true");
//        props.put("mail.smtp.host", "smtp.gmail.com");
//        props.put("mail.smtp.port", "587");
//
//        Session session = Session.getDefaultInstance(props, new javax.mail.Authenticator() {
//            protected PasswordAuthentication getPasswordAuthentication() {
//                return new PasswordAuthentication(username, password);
//            }
//        });
//
//        for (String recipient: recipients) {
//            try {
//                Message message = new MimeMessage(session);
//                message.setFrom(new InternetAddress(username));
//                message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(username)); //recipients
//                message.setSubject(subject);
//                message.setText(text.replaceAll("\\{projectName\\}", topic));
//
//                Transport.send(message);
//
//                System.out.println("Sending message success");
//
//            } catch (MessagingException e) {
//                System.out.println("Sending message fail");
//                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);  
//            }       
//        }       
//        return new ResponseEntity<>(HttpStatus.OK);       
//    }
//}
