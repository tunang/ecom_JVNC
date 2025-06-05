package net.javanc.JavaNC_BookWorld.repository;

import net.javanc.JavaNC_BookWorld.model.Genre;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GenreRepository extends JpaRepository<Genre, Long> {
}
