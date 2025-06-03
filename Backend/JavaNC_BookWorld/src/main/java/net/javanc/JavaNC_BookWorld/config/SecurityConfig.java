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
                        // Public cho swagger, login, register, gửi OTP
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/api/users/send-otp", "/api/users/register", "/api/users/login").permitAll()

                        // User API
                        .requestMatchers(HttpMethod.GET, "/api/users/**").hasAnyAuthority("Admin")
                        .requestMatchers(HttpMethod.PUT, "/api/users/**").hasAnyAuthority( "Admin")
                        .requestMatchers(HttpMethod.DELETE, "/api/users/**").hasAuthority("Admin")
                        .requestMatchers(HttpMethod.GET, "/api/users").hasAuthority("Admin")
                        // Cart-item API
                        .requestMatchers("/api/cart-items/**").hasAnyAuthority("User", "Admin")

                        // Book API
                        .requestMatchers(HttpMethod.GET, "/api/books/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/books/**").hasAuthority("Admin")
                        .requestMatchers(HttpMethod.PUT, "/api/books/**").hasAuthority("Admin")
                        .requestMatchers(HttpMethod.DELETE, "/api/books/**").hasAuthority("Admin")

                        // Genres API
                        .requestMatchers(HttpMethod.GET, "/api/genres/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/genres/**").hasAuthority("Admin")

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
