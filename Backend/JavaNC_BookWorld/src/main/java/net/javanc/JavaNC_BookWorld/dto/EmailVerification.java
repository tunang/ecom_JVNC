package net.javanc.JavaNC_BookWorld.dto;

import java.time.LocalDateTime;

public class EmailVerification {
    private String email;
    private String otp;
    private LocalDateTime expiresAt;

    public EmailVerification(String otp, LocalDateTime expiresAt) {
        this.otp = otp;
        this.expiresAt = expiresAt;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }
}
