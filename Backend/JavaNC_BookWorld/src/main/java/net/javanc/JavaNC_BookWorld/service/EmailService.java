package net.javanc.JavaNC_BookWorld.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtp(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Mã xác minh OTP của bạn");
        message.setText("Mã OTP để đăng ký tài khoản của bạn là: " + otp + "\nMã có hiệu lực trong 5 phút.");

        mailSender.send(message);
    }
}