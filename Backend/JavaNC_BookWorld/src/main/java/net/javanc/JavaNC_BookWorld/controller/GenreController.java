package net.javanc.JavaNC_BookWorld.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import net.javanc.JavaNC_BookWorld.model.Genre;
import net.javanc.JavaNC_BookWorld.repository.GenreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/genres")
@Tag(name = "Genres")
public class GenreController {
    @Autowired
    private GenreRepository genreRepo;

    @GetMapping
    public List<Genre> getAllGenres() {
        return genreRepo.findAll();
    }

    @PostMapping
    public Genre createGenre(@RequestBody Genre genre) {
        return genreRepo.save(genre);
    }
}
