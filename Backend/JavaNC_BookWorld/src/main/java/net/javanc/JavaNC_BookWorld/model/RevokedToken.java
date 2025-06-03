package net.javanc.JavaNC_BookWorld.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.util.Date;

@Entity
public class RevokedToken {
    @Id
    private String token;
    private Date revokedAt;
    public RevokedToken() {}
    public RevokedToken(String token, Date revokedAt) {
        this.token = token;
        this.revokedAt = revokedAt;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Date getRevokedAt() {
        return revokedAt;
    }

    public void setRevokedAt(Date revokedAt) {
        this.revokedAt = revokedAt;
    }
}
