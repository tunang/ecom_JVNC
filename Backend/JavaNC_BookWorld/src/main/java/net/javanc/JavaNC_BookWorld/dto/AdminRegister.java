package net.javanc.JavaNC_BookWorld.dto;

import org.springframework.web.multipart.MultipartFile;

public class AdminRegister {
    private String email;
    private String password;
    private String name;
    private String phone;
    private String role;
    private MultipartFile profilePicture;

    public AdminRegister() {
    }

    public AdminRegister(String email, String password, String name, String phone, String role, MultipartFile profilePicture) {
        this.email = email;
        this.password = password;
        this.name = name;
        this.phone = phone;
        this.role = role;
        this.profilePicture = profilePicture;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public MultipartFile getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(MultipartFile profilePicture) {
        this.profilePicture = profilePicture;
    }
}
