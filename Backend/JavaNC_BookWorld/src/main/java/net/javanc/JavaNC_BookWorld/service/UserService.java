package net.javanc.JavaNC_BookWorld.service;
import net.javanc.JavaNC_BookWorld.dto.EmailVerification;
import net.javanc.JavaNC_BookWorld.dto.RegisterRequest;
import net.javanc.JavaNC_BookWorld.dto.UserUpdateDTO;
import net.javanc.JavaNC_BookWorld.model.User;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

public interface UserService {
    List<User> getAllUsers();
    Optional<User> getUserById(Long id);
    User updateUserByAdmin(Long id, UserUpdateDTO dto); // Bỏ MultipartFile image
    void deleteUser(Long id);
    Optional<User> getUserByEmail(String email);
    User registerUser(RegisterRequest request);
    User login(String email, String password);
    void sendOtpToEmail(String email);
    boolean verifyOtp(String email, String otp);
    User registerUserWithOtp(RegisterRequest request, String otp);
    User updateMyInfo(String email, UserUpdateDTO dto); // Bỏ MultipartFile image
}

