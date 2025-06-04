package net.javanc.JavaNC_BookWorld.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import net.javanc.JavaNC_BookWorld.config.JwtUtil;
import net.javanc.JavaNC_BookWorld.dto.*;
import net.javanc.JavaNC_BookWorld.dto.RegisterRequest;
import net.javanc.JavaNC_BookWorld.model.RevokedToken;
import net.javanc.JavaNC_BookWorld.model.User;
import net.javanc.JavaNC_BookWorld.repository.RevokedTokenRepository;
import net.javanc.JavaNC_BookWorld.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@Tag(name = "Users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private RevokedTokenRepository revokedTokenRepo;

    @PreAuthorize("hasRole('Admin')")
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User requester = userService.getUserByEmail(email).orElse(null);
        if (requester == null || !requester.getRole().equals("Admin")) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Chỉ admin được xem danh sách người dùng");
        }

        List<User> users = userService.getAllUsers();
        List<UserResponseDto> response = users.stream().map(this::toUserResponse).toList();
        return ResponseEntity.ok(response);
    }

    // Lấy user theo id
    @PreAuthorize("hasRole('Admin')")
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
    @PreAuthorize("hasRole('Admin')")
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        String requesterEmail = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> requesterOpt = userService.getUserByEmail(requesterEmail);

        if (requesterOpt.isEmpty()) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        User requester = requesterOpt.get();
        if (!requester.getRole().equals("ADMIN") && !requester.getUserId().equals(id)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Bạn không có quyền cập nhật user này");
        }

        try {
            User updatedUser = userService.updateUser(id, userDetails);
            return ResponseEntity.ok(toUserResponse(updatedUser));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Xóa user theo id
    @PreAuthorize("hasRole('Admin')")
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

    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(HttpServletRequest request) {
        String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> userOpt = userService.getUserByEmail(email);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            user.setPassword(null);
            return ResponseEntity.ok(user);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (revokedTokenRepo.existsByToken(token)) {
                return ResponseEntity.badRequest().body("Token đã bị thu hồi");
            }

            RevokedToken revokedToken = new RevokedToken();
            revokedToken.setToken(token);
            revokedToken.setRevokedAt(new Date());
            revokedTokenRepo.save(revokedToken);
        }
        return ResponseEntity.ok("Đăng xuất thành công");
    }
    private UserResponseDto toUserResponse(User user) {
        return new UserResponseDto(
                user.getUserId(),
                user.getEmail(),
                user.getName(),
                user.getPhone(),
                user.getRole(),
                user.getProfilePicture(),
                user.getCreatedAt()
        );
    }
}
