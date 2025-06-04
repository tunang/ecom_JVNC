package net.javanc.JavaNC_BookWorld.service;

import net.javanc.JavaNC_BookWorld.dto.EmailVerification;
import net.javanc.JavaNC_BookWorld.dto.RegisterRequest;
import net.javanc.JavaNC_BookWorld.dto.UserUpdateDTO;
import net.javanc.JavaNC_BookWorld.model.User;
import net.javanc.JavaNC_BookWorld.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ImageUploadService imageUploadService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final Map<String, EmailVerification> otpStorage = new HashMap<>();

    @Override
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    @Override
    public Optional<User> getUserByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return userRepo.findById(id);
    }

    @Override
    public User updateUserByAdmin(Long id, UserUpdateDTO dto) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + id));

        // Cập nhật các trường thông tin nếu có dữ liệu
        if (dto.getName() != null && !dto.getName().trim().isEmpty()) {
            user.setName(dto.getName().trim());
        }

        if (dto.getPhone() != null && !dto.getPhone().trim().isEmpty()) {
            user.setPhone(dto.getPhone().trim());
        }

        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword().trim()));
        }

        // Xử lý ảnh: chỉ cập nhật nếu upload ảnh mới
        if (dto.getProfilePicture() != null && !dto.getProfilePicture().isEmpty()) {
            try {
                String imageUrl = imageUploadService.uploadImageToFolder(dto.getProfilePicture(), "bookworld/users");
                user.setProfilePicture(imageUrl);
            } catch (IOException e) {
                throw new RuntimeException("Lỗi upload ảnh: " + e.getMessage());
            }
        }
        // Nếu ảnh không gửi hoặc rỗng, giữ nguyên ảnh cũ, không thay đổi gì

        return userRepo.save(user);
    }

    @Override
    public User updateMyInfo(String email, UserUpdateDTO dto) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        if (dto.getName() != null && !dto.getName().trim().isEmpty()) {
            user.setName(dto.getName().trim());
        }

        if (dto.getPhone() != null && !dto.getPhone().trim().isEmpty()) {
            user.setPhone(dto.getPhone().trim());
        }

        if (dto.getPassword() != null && !dto.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(dto.getPassword().trim()));
        }

        if (dto.getProfilePicture() != null && !dto.getProfilePicture().isEmpty()) {
            try {
                String imageUrl = imageUploadService.uploadImageToFolder(dto.getProfilePicture(), "bookworld/users");
                user.setProfilePicture(imageUrl);
            } catch (IOException e) {
                throw new RuntimeException("Lỗi upload ảnh: " + e.getMessage());
            }
        }

        return userRepo.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));
        if ("Admin".equals(user.getRole())) {
            throw new RuntimeException("Không thể xóa tài khoản Admin");
        }
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

    @Override
    public void sendOtpToEmail(String email) {
        String otp = String.valueOf(new Random().nextInt(900000) + 100000);
        otpStorage.put(email, new EmailVerification(otp, LocalDateTime.now().plusMinutes(5)));
        emailService.sendOtp(email, otp);
    }

    @Override
    public boolean verifyOtp(String email, String otp) {
        EmailVerification ev = otpStorage.get(email);
        return ev != null && ev.getOtp().equals(otp) && ev.getExpiresAt().isAfter(LocalDateTime.now());
    }

    @Override
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