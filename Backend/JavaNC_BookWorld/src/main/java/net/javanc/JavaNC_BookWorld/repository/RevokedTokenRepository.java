package net.javanc.JavaNC_BookWorld.repository;

import net.javanc.JavaNC_BookWorld.model.RevokedToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RevokedTokenRepository extends JpaRepository<RevokedToken, String> {
    boolean existsByToken(String token);
}
