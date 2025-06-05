package net.javanc.JavaNC_BookWorld.model;

import jakarta.persistence.*;

@Entity
@Table(name = "cart_items")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long cartItemId;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "book_id")
    private Book book;

    private int quantity;

    public CartItem() {
    }

    public CartItem(Long cartItemId, User user, Book book, int quantity) {
        this.cartItemId = cartItemId;
        this.user = user;
        this.book = book;
        this.quantity = quantity;
    }

    public Long getId() {
        return cartItemId;
    }

    public void setId(Long id) {
        this.cartItemId = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Book getBook() {
        return book;
    }

    public void setBook(Book book) {
        this.book = book;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
