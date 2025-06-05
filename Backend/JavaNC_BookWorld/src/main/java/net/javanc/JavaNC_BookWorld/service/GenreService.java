package net.javanc.JavaNC_BookWorld.service;

import net.javanc.JavaNC_BookWorld.model.Genre;

import java.util.List;
import java.util.Optional;

public interface GenreService {
    List<Genre> getAllGenres();

    Optional<Genre> getGenreById(Long id);

    Genre createGenre(Genre genre);

    Genre updateGenre(Long id, Genre genre);

    void deleteGenre(Long id);

    boolean existsById(Long id);
}