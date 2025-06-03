package net.javanc.JavaNC_BookWorld.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import net.javanc.JavaNC_BookWorld.config.JwtUtil;
import net.javanc.JavaNC_BookWorld.dto.*;
import net.javanc.JavaNC_BookWorld.dto.RegisterRequest;
import net.javanc.JavaNC_BookWorld.model.User;
import net.javanc.JavaNC_BookWorld.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users")
public class UserController {

    @Autowired
    private UserService userService;

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    // Lấy user theo id
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        if (user.isPresent()) {
            User u = user.get();
            u.setPassword(null); // Ẩn password khi trả về
            return ResponseEntity.ok(u);
        }
        return ResponseEntity.notFound().build();
    }

    // Cập nhật user theo id
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        try {
            User updatedUser = userService.updateUser(id, userDetails);
            updatedUser.setPassword(null);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Xóa user theo id
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("User đã được xóa");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Gửi OTP tới email để xác minh trước khi đăng ký
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody SendOtpRequest request) {
        try {
            userService.sendOtpToEmail(request.getEmail());
            return ResponseEntity.ok("Đã gửi mã OTP tới " + request.getEmail());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Đăng ký kèm OTP (gộp xác minh OTP + đăng ký)
    @PostMapping("/register")
    public ResponseEntity<?> registerWithOtp(@RequestBody RegisterWithOtpRequest request) {
        try {
            // Hàm này sẽ kiểm tra OTP rồi mới đăng ký user
            User user = userService.registerUserWithOtp(request.getRegisterRequest(), request.getOtp());
            user.setPassword(null); // Ẩn mật khẩu trước khi trả về
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    // Đăng nhập
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = userService.login(request.getEmail(), request.getPassword());
            String token = JwtUtil.generateToken(user.getEmail(), user.getRole());
            user.setPassword(null);

            return ResponseEntity.ok(new LoginResponse(user, token));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }
}
