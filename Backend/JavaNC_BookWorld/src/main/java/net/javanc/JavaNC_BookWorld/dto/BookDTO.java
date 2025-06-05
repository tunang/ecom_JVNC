package net.javanc.JavaNC_BookWorld.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;

public class BookDTO {

    @Schema(description = "Tiêu đề sách", example = "The Great Gatsby")
    private String title;

    @Schema(description = "Tác giả", example = "F. Scott Fitzgerald")
    private String author;

    @Schema(description = "Mô tả sách", example = "A classic novel about the American Dream")
    private String description;

    @Schema(description = "Giá sách", example = "19.99")
    private BigDecimal price;

    @Schema(description = "Số lượng tồn kho", example = "100")
    private Integer stock;

    @Schema(description = "File ảnh bìa sách", type = "string", format = "binary")
    private MultipartFile coverImage;

    @Schema(description = "ID thể loại sách", example = "1")
    private Long genreId;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public MultipartFile getCoverImage() {
        return coverImage;
    }

    public void setCoverImage(MultipartFile coverImage) {
        this.coverImage = coverImage;
    }

    public Long getGenreId() {
        return genreId;
    }

    public void setGenreId(Long genreId) {
        this.genreId = genreId;
    }
}
