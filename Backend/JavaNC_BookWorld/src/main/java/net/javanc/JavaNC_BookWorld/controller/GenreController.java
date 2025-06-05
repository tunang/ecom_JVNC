package net.javanc.JavaNC_BookWorld.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import net.javanc.JavaNC_BookWorld.dto.GenreDTO;
import net.javanc.JavaNC_BookWorld.model.Genre;
import net.javanc.JavaNC_BookWorld.service.GenreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/genres")
public class GenreController {

    @Autowired
    private GenreService genreService;

    @PreAuthorize("hasAuthority('Admin')")
    @SecurityRequirement(name = "bearerAuth")
    @PostMapping
    @Operation(summary = "Tạo genre mới")
    public ResponseEntity<Genre> createGenre(@RequestBody GenreDTO genreDTO) {
        Genre genre = new Genre();
        genre.setName(genreDTO.getName());
        return ResponseEntity.ok(genreService.createGenre(genre));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy thông tin genre qua id")
    public ResponseEntity<Genre> getGenreById(@PathVariable Long id) {
        return genreService.getGenreById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả genre")
    public List<Genre> getAllGenres() {
        return genreService.getAllGenres();
    }

    @PreAuthorize("hasAuthority('Admin')")
    @SecurityRequirement(name = "bearerAuth")
    @PutMapping("/{id}")
    @Operation(summary = "Sửa thông tin genre theo id")
    public ResponseEntity<Genre> updateGenre(@PathVariable Long id, @RequestBody GenreDTO genreDTO) {
        Genre updated = genreService.updateGenre(id, new Genre(null, genreDTO.getName()));
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("hasAuthority('Admin')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Xóa genre theo id")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGenre(@PathVariable Long id) {
        genreService.deleteGenre(id);
        return ResponseEntity.noContent().build();
    }
}
