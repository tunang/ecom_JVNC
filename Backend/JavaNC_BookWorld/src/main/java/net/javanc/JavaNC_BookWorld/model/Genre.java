package net.javanc.JavaNC_BookWorld.model;

import jakarta.persistence.*;

@Entity
@Table(name = "genres")
public class Genre {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "genre_id")
    private Long genreId;

    @Column(name = "name", unique = true, nullable = false)
    private String name;

    // Constructors
    public Genre() {}

    public Genre(Long genreId, String name) {
        this.genreId = genreId;
        this.name = name;
    }

    // Getters and setters
    public Long getGenreId() {
        return genreId;
    }

    public void setGenreId(Long genreId) {
        this.genreId = genreId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}