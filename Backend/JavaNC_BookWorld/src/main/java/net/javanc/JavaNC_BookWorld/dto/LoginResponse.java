package net.javanc.JavaNC_BookWorld.dto;

import net.javanc.JavaNC_BookWorld.model.User;

public class LoginResponse {
    private User user;
    private String token;

    public LoginResponse(User user, String token) {
        this.user = user;
        this.token = token;
    }

    public User getUser() {
        return user;
    }

    public String getToken() {
        return token;
    }
}
