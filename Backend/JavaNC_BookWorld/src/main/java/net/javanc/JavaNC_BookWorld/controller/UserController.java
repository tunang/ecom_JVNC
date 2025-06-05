package net.javanc.JavaNC_BookWorld.controller;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import net.javanc.JavaNC_BookWorld.config.JwtUtil;
import net.javanc.JavaNC_BookWorld.dto.*;
import net.javanc.JavaNC_BookWorld.model.RevokedToken;
import net.javanc.JavaNC_BookWorld.model.User;
import net.javanc.JavaNC_BookWorld.repository.RevokedTokenRepository;
import net.javanc.JavaNC_BookWorld.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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

    @PreAuthorize("hasAuthority('Admin')")
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

    @PreAuthorize("hasAuthority('Admin')")
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

    @PreAuthorize("hasAuthority('Admin')")
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateUserByAdmin(
            @PathVariable Long id,
            @ModelAttribute AdminRegister userDetails) {

        try {
            System.out.println("Updating user with ID: " + id);
            System.out.println("User details: " + userDetails);
            boolean hasNewImage = userDetails.getProfilePicture() != null && !userDetails.getProfilePicture().isEmpty();
            System.out.println("Image present: " + hasNewImage);

            User updatedUser = userService.updateUserByAdmin(id, userDetails);
            return ResponseEntity.ok(toUserResponse(updatedUser));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Internal server error", "An unexpected error occurred"));
        }
    }


    @PreAuthorize("hasAuthority('Admin')")
    @SecurityRequirement(name = "bearerAuth")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("User đã được xóa");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody SendOtpRequest request) {
        try {
            userService.sendOtpToEmail(request.getEmail());
            return ResponseEntity.ok("Đã gửi mã OTP tới " + request.getEmail());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerWithOtp(@RequestBody RegisterWithOtpRequest request) {
        try {
            User user = userService.registerUserWithOtp(request.getRegisterRequest(), request.getOtp());
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

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
    @PutMapping(value = "/me", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateMyInfo(
            @ModelAttribute UserUpdateDTO dto) {

        try {
            String email = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            System.out.println("Updating user profile for email: " + email);
            System.out.println("User details: " + dto);
            boolean hasNewImage = dto.getProfilePicture() != null && !dto.getProfilePicture().isEmpty();
            System.out.println("Image present: " + hasNewImage);

            User updatedUser = userService.updateMyInfo(email, dto);
            return ResponseEntity.ok(toUserResponse(updatedUser));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ErrorResponse("Internal server error", "An unexpected error occurred"));
        }
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
    @PreAuthorize("hasAuthority('Admin')")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping(value = "/admin-create", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> adminCreateUser(@ModelAttribute AdminRegister request) {
        try {
            User createdUser = userService.createUserByAdmin(request);
            createdUser.setPassword(null); // Ẩn password khi trả về
            return ResponseEntity.status(HttpStatus.CREATED).body(toUserResponse(createdUser));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
}