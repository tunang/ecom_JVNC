package net.javanc.JavaNC_BookWorld.service;

import net.javanc.JavaNC_BookWorld.dto.EmailVerification;
import net.javanc.JavaNC_BookWorld.dto.RegisterRequest;
import net.javanc.JavaNC_BookWorld.model.User;
import net.javanc.JavaNC_BookWorld.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;


@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepo;
    @Autowired
    private EmailService emailService;
    private final Map<String, EmailVerification> otpStorage = new HashMap<>();

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepo.findByEmail(email);
    }
    @Override
    public Optional<User> getUserById(String id) {
        return userRepo.findById(id);
    }

    @Override
    public User updateUser(String id, User userDetails) {
        User existingUser = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

        existingUser.setName(userDetails.getName());
        existingUser.setPhone(userDetails.getPhone());

        return userRepo.save(existingUser);
    }

    @Override
    public void deleteUser(String id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));
        userRepo.delete(user);
    }
    @Override
    public User registerUser(RegisterRequest request) {
        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email đã tồn tại");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("User");
        user.setCreatedAt(LocalDateTime.now());

        User savedUser = userRepo.save(user);

        // Xóa OTP đã dùng
        otpStorage.remove(request.getEmail());

        return savedUser;
    }

    @Override
    public User login(String email, String rawPassword) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new RuntimeException("Sai mật khẩu");
        }

        return user;
    }
    public void sendOtpToEmail(String email) {
        // Tạo OTP
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        otpStorage.put(email, new EmailVerification(otp, LocalDateTime.now().plusMinutes(5)));
        emailService.sendOtp(email, otp);
    }

    // Kiểm tra OTP
    public boolean verifyOtp(String email, String otp) {
        EmailVerification ev = otpStorage.get(email);
        return ev != null && ev.getOtp().equals(otp) && ev.getExpiresAt().isAfter(LocalDateTime.now());
    }

    // Đăng ký sau khi xác minh OTP
    public User registerUserWithOtp(RegisterRequest request, String otp) {
        if (!verifyOtp(request.getEmail(), otp)) {
            throw new RuntimeException("Mã OTP không hợp lệ hoặc đã hết hạn.");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPhone(request.getPhone());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole("User");
        user.setCreatedAt(LocalDateTime.now());
        otpStorage.remove(request.getEmail());
        return userRepo.save(user);
    }
}
