package net.javanc.JavaNC_BookWorld.service;

import net.javanc.JavaNC_BookWorld.model.Genre;
import net.javanc.JavaNC_BookWorld.repository.GenreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GenreServiceImpl implements GenreService {

    @Autowired
    private GenreRepository genreRepository;

    @Override
    public Genre createGenre(Genre genre) {
        return genreRepository.save(genre);
    }

    @Override
    public Optional<Genre> getGenreById(Long id) {
        return genreRepository.findById(id);
    }

    @Override
    public List<Genre> getAllGenres() {
        return genreRepository.findAll();
    }

    @Override
    public Genre updateGenre(Long id, Genre updatedGenre) {
        Genre genre = genreRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Genre not found with id: " + id));
        genre.setName(updatedGenre.getName()); // chỉ cập nhật tên
        return genreRepository.save(genre);
    }

    @Override
    public void deleteGenre(Long id) {
        genreRepository.deleteById(id);
    }

    @Override
    public boolean existsById(Long id) {
        return genreRepository.existsById(id);
    }
}
