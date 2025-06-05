package net.javanc.JavaNC_BookWorld.config;

import jakarta.annotation.PostConstruct;
import net.javanc.JavaNC_BookWorld.model.User;
import net.javanc.JavaNC_BookWorld.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminInitializer {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostConstruct
    public void initAdminUser() {
        if (userRepository.findByEmail("admin@bookworld.com").isEmpty()) {
            User admin = new User();

            admin.setEmail("admin@bookworld.com");
            admin.setName("Administrator");
            admin.setPhone("0123456789");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setRole("Admin");

            userRepository.save(admin);
        }
    }
}