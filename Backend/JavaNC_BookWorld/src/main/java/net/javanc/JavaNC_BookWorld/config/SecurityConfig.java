package net.javanc.JavaNC_BookWorld.config;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import net.javanc.JavaNC_BookWorld.config.JwtAuthenticationFilter;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/api/users/send-otp", "/api/users/register", "/api/users/login").permitAll()
                        // Thông tin cá nhân
                        .requestMatchers("/api/users/me").hasAnyAuthority("User", "Admin")

                        // Quản lý người dùng - chỉ Admin
                        .requestMatchers("/api/users/**").hasAuthority("Admin")

                        // Cart-items - người dùng và admin đều được
                        .requestMatchers("/api/cart-items/**").hasAnyAuthority("User", "Admin")

                        // Book API
                        .requestMatchers(HttpMethod.GET, "/api/books/search").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/books/genre/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/books/**").hasAnyAuthority("User", "Admin")
                        .requestMatchers(HttpMethod.POST, "/api/books/**").hasAuthority("Admin")
                        .requestMatchers(HttpMethod.PUT, "/api/books/**").hasAuthority("Admin")
                        .requestMatchers(HttpMethod.DELETE, "/api/books/**").hasAuthority("Admin")

                        // Genre API
                        .requestMatchers(HttpMethod.GET, "/api/genres/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/genres/**").hasAuthority("Admin")
                        .requestMatchers(HttpMethod.PUT, "/api/genres/**").hasAuthority("Admin")
                        .requestMatchers(HttpMethod.DELETE, "/api/genres/**").hasAuthority("Admin")

                        // Các route còn lại cần đăng nhập
                        .anyRequest().authenticated()
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}