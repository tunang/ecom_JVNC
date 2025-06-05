package net.javanc.JavaNC_BookWorld.dto;

import jakarta.persistence.Column;
import org.springframework.web.multipart.MultipartFile;

public class UserUpdateDTO {
    private String name;
    private String phone;
    private String password;
    private MultipartFile profilePicture;
    public UserUpdateDTO() {}
    public UserUpdateDTO(String name, String phone, String password, MultipartFile profilePicture) {
        this.name = name;
        this.phone = phone;
        this.password = password;
        this.profilePicture = profilePicture;
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

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public MultipartFile getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(MultipartFile profilePicture) {
        this.profilePicture = profilePicture;
    }
    @Override
    public String toString() {
        return "UserUpdateDTO{name='" + name + "', phone='" + phone + "', password='***', profilePicture=" + (profilePicture != null ? profilePicture.getOriginalFilename() : "null") + "}";
    }
}
