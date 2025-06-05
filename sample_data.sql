-- Sample data for JVNC Book Store
-- Insert Genres (12 genres)

INSERT INTO genres (name) VALUES 
('Tiểu thuyết'),
('Truyện tranh'),
('Khoa học viễn tưởng'),
('Lãng mạn'),
('Trinh thám'),
('Kinh dị'),
('Lịch sử'),
('Tâm lý học'),
('Kinh doanh'),
('Tự truyện'),
('Thơ ca'),
('Giáo dục');

-- Insert Books (120 books - 10 per genre)

-- Tiểu thuyết (Genre ID: 1)
INSERT INTO books (title, author, description, price, stock, image_url, genre_id) VALUES
('Số đỏ', 'Vũ Trọng Phụng', 'Tiểu thuyết nổi tiếng về cuộc sống của tầng lớp tiểu tư sản Hà Nội những năm 1930', 120000, 25, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', 1),
('Đất rừng phương Nam', 'Đoàn Giỏi', 'Tác phẩm kinh điển về cuộc sống vùng rừng U Minh', 95000, 30, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', 1),
('Tắt đèn', 'Ngô Tất Tố', 'Tiểu thuyết phản ánh cuộc sống khổ cực của nông dân', 110000, 20, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', 1),
('Vợ nhặt', 'Kim Lân', 'Truyện ngắn nổi tiếng về tình người trong hoàn cảnh khốn khó', 85000, 35, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', 1),
('Những ngôi sao xa xôi', 'Lê Minh Khuê', 'Tập truyện về chiến tranh và hòa bình', 130000, 15, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400', 1),
('Chí Phèo', 'Nam Cao', 'Truyện ngắn kinh điển về số phận con người', 75000, 40, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400', 1),
('Người con gái Hà Nội', 'Nguyễn Thị Vinh', 'Tiểu thuyết về cuộc sống phụ nữ Thăng Long xưa', 105000, 22, 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400', 1),
('Lão Hạc', 'Nam Cao', 'Truyện ngắn cảm động về một ông lão và con chó', 80000, 28, 'https://images.unsplash.com/photo-1519731491571-db9afd5bd696?w=400', 1),
('Tôi thấy hoa vàng trên cỏ xanh', 'Nguyễn Nhật Ánh', 'Tiểu thuyết về tuổi thơ miền quê', 145000, 50, 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400', 1),
('Dế Mèn phiêu lưu ký', 'Tô Hoài', 'Truyện thiếu nhi kinh điển Việt Nam', 90000, 45, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', 1),

-- Truyện tranh (Genre ID: 2)
INSERT INTO books (title, author, description, price, stock, image_url, genre_id) VALUES
('Doraemon - Tập 1', 'Fujiko F. Fujio', 'Manga nổi tiếng về chú mèo máy đến từ tương lai', 25000, 100, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', 2),
('Dragon Ball - Tập 1', 'Akira Toriyama', 'Manga hành động kinh điển về Son Goku', 30000, 80, 'https://images.unsplash.com/photo-1594736797933-d0401ba49e56?w=400', 2),
('One Piece - Tập 1', 'Eiichiro Oda', 'Câu chuyện về hải tặc Luffy tìm kiếm kho báu', 35000, 90, 'https://images.unsplash.com/photo-1588497859490-85d1c17db96d?w=400', 2),
('Naruto - Tập 1', 'Masashi Kishimoto', 'Manga về ninja trẻ Naruto Uzumaki', 32000, 75, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400', 2),
('Thần đồng đất Việt', 'Lê Linh', 'Truyện tranh lịch sử về các anh hùng Việt Nam', 45000, 40, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', 2),
('Shin - Cậu bé bút chì', 'Yoshito Usui', 'Manga hài hước về cậu bé Shin chan', 28000, 60, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', 2),
('Attack on Titan - Tập 1', 'Hajime Isayama', 'Manga kinh dị về cuộc chiến với người khổng lồ', 38000, 55, 'https://images.unsplash.com/photo-1594736797933-d0401ba49e56?w=400', 2),
('Conan - Thám tử lừng danh', 'Gosho Aoyama', 'Manga trinh thám về thám tử nhí Conan', 33000, 85, 'https://images.unsplash.com/photo-1588497859490-85d1c17db96d?w=400', 2),
('Tôm hùm Alaska', 'Nguyễn Khánh Dương', 'Webtoon Việt Nam về cuộc sống đời thường', 40000, 35, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400', 2),
('Mảnh ghép cuộc đời', 'Huỳnh Kim Lập', 'Truyện tranh về tình bạn và ước mơ', 42000, 30, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', 2),

-- Khoa học viễn tưởng (Genre ID: 3)
INSERT INTO books (title, author, description, price, stock, image_url, genre_id) VALUES
('Dune - Hành tinh cát', 'Frank Herbert', 'Tiểu thuyết khoa học viễn tưởng kinh điển', 280000, 20, 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400', 3),
('Foundation - Nền móng', 'Isaac Asimov', 'Series khoa học viễn tưởng về đế chế thiên hà', 250000, 15, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400', 3),
('1984', 'George Orwell', 'Tiểu thuyết dystopia về xã hội toàn trị', 160000, 30, 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400', 3),
('Brave New World', 'Aldous Huxley', 'Tác phẩm về xã hội tương lai', 180000, 25, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', 3),
('Fahrenheit 451', 'Ray Bradbury', 'Câu chuyện về xã hội cấm đọc sách', 170000, 22, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', 3),
('The Martian', 'Andy Weir', 'Tiểu thuyết về cuộc sống trên sao Hỏa', 220000, 18, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400', 3),
('Ender''s Game', 'Orson Scott Card', 'Câu chuyện về thiên tài quân sự trẻ tuổi', 200000, 20, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400', 3),
('Neuromancer', 'William Gibson', 'Tiểu thuyết cyberpunk đầu tiên', 195000, 16, 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400', 3),
('The Time Machine', 'H.G. Wells', 'Tác phẩm kinh điển về du hành thời gian', 150000, 28, 'https://images.unsplash.com/photo-1519731491571-db9afd5bd696?w=400', 3),
('Hyperion', 'Dan Simmons', 'Sử thi khoa học viễn tưởng đa tầng', 260000, 12, 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400', 3),

-- Lãng mạn (Genre ID: 4)
INSERT INTO books (title, author, description, price, stock, image_url, genre_id) VALUES
('Pride and Prejudice', 'Jane Austen', 'Tiểu thuyết lãng mạn kinh điển về Elizabeth và Darcy', 175000, 35, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', 4),
('Me Before You', 'Jojo Moyes', 'Câu chuyện tình yêu cảm động và sâu sắc', 185000, 28, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', 4),
('The Notebook', 'Nicholas Sparks', 'Tình yêu vượt thời gian của Noah và Allie', 165000, 32, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', 4),
('Outlander', 'Diana Gabaldon', 'Tình yêu xuyên thời gian giữa Claire và Jamie', 220000, 22, 'https://images.unsplash.com/photo-1594736797933-d0401ba49e56?w=400', 4),
('The Fault in Our Stars', 'John Green', 'Câu chuyện tình yêu của hai bệnh nhân ung thư', 155000, 40, 'https://images.unsplash.com/photo-1588497859490-85d1c17db96d?w=400', 4),
('Jane Eyre', 'Charlotte Brontë', 'Tác phẩm kinh điển về tình yêu và tự do', 170000, 25, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400', 4),
('Wuthering Heights', 'Emily Brontë', 'Tình yêu mãnh liệt và đầy khổ đau', 160000, 20, 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400', 4),
('Romeo and Juliet', 'William Shakespeare', 'Bi kịch tình yêu kinh điển của Shakespeare', 140000, 45, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400', 4),
('Tình người duyên ma', 'Nguyễn Du', 'Truyện Kiều - tác phẩm bất hủ văn học Việt Nam', 195000, 30, 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400', 4),
('Casablanca', 'Michael Curtiz', 'Tình yêu trong thời chiến', 180000, 18, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', 4),

-- Trinh thám (Genre ID: 5)
INSERT INTO books (title, author, description, price, stock, image_url, genre_id) VALUES
('Sherlock Holmes', 'Arthur Conan Doyle', 'Tuyển tập truyện trinh thám kinh điển', 200000, 35, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', 5),
('Murder on the Orient Express', 'Agatha Christie', 'Vụ án bí ẩn trên chuyến tàu Orient Express', 185000, 28, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400', 5),
('The Girl with the Dragon Tattoo', 'Stieg Larsson', 'Tiểu thuyết trinh thám Thụy Điển nổi tiếng', 210000, 25, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400', 5),
('Gone Girl', 'Gillian Flynn', 'Tâm lý tội phạm về cuộc hôn nhân đầy bí ẩn', 195000, 22, 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400', 5),
('The Big Sleep', 'Raymond Chandler', 'Tiểu thuyết trinh thám noir kinh điển', 175000, 30, 'https://images.unsplash.com/photo-1519731491571-db9afd5bd696?w=400', 5),
('In the Woods', 'Tana French', 'Tiểu thuyết trinh thám tâm lý sâu sắc', 205000, 20, 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400', 5),
('The Maltese Falcon', 'Dashiell Hammett', 'Tác phẩm kinh điển thể loại hard-boiled', 165000, 32, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', 5),
('Cô gái trong gương', 'Nguyễn Nhật Ánh', 'Tiểu thuyết trinh thám Việt Nam', 145000, 40, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', 5),
('The Silence of the Lambs', 'Thomas Harris', 'Tâm lý tội phạm về Hannibal Lecter', 220000, 18, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', 5),
('And Then There Were None', 'Agatha Christie', 'Tiểu thuyết trinh thám hay nhất mọi thời đại', 180000, 35, 'https://images.unsplash.com/photo-1594736797933-d0401ba49e56?w=400', 5),

-- Kinh dị (Genre ID: 6)
INSERT INTO books (title, author, description, price, stock, image_url, genre_id) VALUES
('The Shining', 'Stephen King', 'Tiểu thuyết kinh dị về khách sạn ma ám', 190000, 25, 'https://images.unsplash.com/photo-1588497859490-85d1c17db96d?w=400', 6),
('Dracula', 'Bram Stoker', 'Tác phẩm kinh điển về ma cà rồng', 165000, 30, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400', 6),
('Frankenstein', 'Mary Shelley', 'Câu chuyện về quái vật do con người tạo ra', 155000, 28, 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400', 6),
('The Exorcist', 'William Peter Blatty', 'Tiểu thuyết về ritual trừ tà', 175000, 22, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400', 6),
('IT', 'Stephen King', 'Tác phẩm kinh dị về con hề Pennywise', 220000, 20, 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400', 6),
('The Haunting of Hill House', 'Shirley Jackson', 'Tiểu thuyết kinh dị tâm lý kinh điển', 180000, 18, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', 6),
('Pet Sematary', 'Stephen King', 'Câu chuyện về nghĩa trang thú cưng bí ẩn', 185000, 24, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', 6),
('The Turn of the Screw', 'Henry James', 'Truyện ma kinh điển văn học Anh', 145000, 32, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400', 6),
('Ma lai', 'Nguyễn Ngọc Tư', 'Truyện kinh dị Việt Nam về linh hồn', 130000, 35, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400', 6),
('World War Z', 'Max Brooks', 'Tiểu thuyết về đại dịch zombie', 200000, 16, 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400', 6),

-- Lịch sử (Genre ID: 7)
INSERT INTO books (title, author, description, price, stock, image_url, genre_id) VALUES
('Sapiens', 'Yuval Noah Harari', 'Lịch sử loài người từ thời tiền sử đến hiện đại', 320000, 40, 'https://images.unsplash.com/photo-1519731491571-db9afd5bd696?w=400', 7),
('The Guns of August', 'Barbara Tuchman', 'Lịch sử Thế chiến I', 280000, 25, 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400', 7),
('A People''s History of the United States', 'Howard Zinn', 'Lịch sử Mỹ từ góc nhìn dân chúng', 350000, 20, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', 7),
('The Silk Roads', 'Peter Frankopan', 'Lịch sử thế giới qua con đường tơ lụa', 380000, 18, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', 7),
('Lịch sử Việt Nam', 'Đại học Quốc gia', 'Giáo trình lịch sử Việt Nam toàn tập', 250000, 50, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', 7),
('The Diary of a Young Girl', 'Anne Frank', 'Nhật ký của Anne Frank thời Thế chiến II', 165000, 35, 'https://images.unsplash.com/photo-1594736797933-d0401ba49e56?w=400', 7),
('Đại Việt sử ký toàn thư', 'Ngô Sĩ Liên', 'Sử sách cổ nhất của Việt Nam', 450000, 15, 'https://images.unsplash.com/photo-1588497859490-85d1c17db96d?w=400', 7),
('The Rise and Fall of the Third Reich', 'William L. Shirer', 'Lịch sử Đức quốc xã', 420000, 12, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400', 7),
('Homo Deus', 'Yuval Noah Harari', 'Tương lai của loài người', 340000, 30, 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400', 7),
('The Art of War', 'Sun Tzu', 'Binh thư kinh điển Trung Hoa', 180000, 45, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400', 7),

-- Tâm lý học (Genre ID: 8)
INSERT INTO books (title, author, description, price, stock, image_url, genre_id) VALUES
('Thinking, Fast and Slow', 'Daniel Kahneman', 'Nghiên cứu về tâm lý học nhận thức', 290000, 35, 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400', 8),
('The Power of Habit', 'Charles Duhigg', 'Khoa học về thói quen và thay đổi', 240000, 40, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', 8),
('Flow', 'Mihaly Csikszentmihalyi', 'Tâm lý học về trạng thái tối ưu', 220000, 30, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', 8),
('The Interpretation of Dreams', 'Sigmund Freud', 'Tác phẩm kinh điển về giải mộng', 285000, 25, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400', 8),
('Man''s Search for Meaning', 'Viktor Frankl', 'Tìm kiếm ý nghĩa cuộc sống', 195000, 45, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400', 8),
('Influence', 'Robert Cialdini', 'Tâm lý học thuyết phục', 250000, 32, 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400', 8),
('The Social Animal', 'David Brooks', 'Tâm lý học xã hội và hành vi con người', 270000, 28, 'https://images.unsplash.com/photo-1519731491571-db9afd5bd696?w=400', 8),
('Mindset', 'Carol Dweck', 'Tâm lý học về tư duy tăng trưởng', 210000, 38, 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400', 8),
('Emotional Intelligence', 'Daniel Goleman', 'Trí tuệ cảm xúc và thành công', 235000, 35, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', 8),
('Tâm lý học đại cương', 'TS. Nguyễn Quang Uẩn', 'Giáo trình tâm lý học cơ bản', 180000, 50, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', 8),

-- Kinh doanh (Genre ID: 9)
INSERT INTO books (title, author, description, price, stock, image_url, genre_id) VALUES
('The Lean Startup', 'Eric Ries', 'Phương pháp khởi nghiệp tinh gọn', 280000, 40, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', 9),
('Good to Great', 'Jim Collins', 'Từ tốt đến vĩ đại - nghiên cứu về doanh nghiệp', 320000, 35, 'https://images.unsplash.com/photo-1594736797933-d0401ba49e56?w=400', 9),
('The 7 Habits of Highly Effective People', 'Stephen Covey', '7 thói quen hiệu quả', 250000, 45, 'https://images.unsplash.com/photo-1588497859490-85d1c17db96d?w=400', 9),
('Zero to One', 'Peter Thiel', 'Từ số 0 đến số 1 - bí quyết khởi nghiệp', 290000, 30, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400', 9),
('The Innovator''s Dilemma', 'Clayton Christensen', 'Bài toán của nhà đổi mới', 310000, 25, 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400', 9),
('Rich Dad Poor Dad', 'Robert Kiyosaki', 'Cha giàu cha nghèo', 220000, 50, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400', 9),
('The Hard Thing About Hard Things', 'Ben Horowitz', 'Những điều khó khăn trong kinh doanh', 275000, 28, 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400', 9),
('Built to Last', 'Jim Collins', 'Xây dựng để tồn tại', 295000, 32, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', 9),
('The E-Myth Revisited', 'Michael Gerber', 'Huyền thoại doanh nhân', 240000, 38, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', 9),
('Làm giàu từ phố Wall', 'Nguyễn Hoàng Linh', 'Kinh nghiệm đầu tư chứng khoán', 195000, 42, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400', 9),

-- Tự truyện (Genre ID: 10)
INSERT INTO books (title, author, description, price, stock, image_url, genre_id) VALUES
('Steve Jobs', 'Walter Isaacson', 'Tiểu sử của người đồng sáng lập Apple', 350000, 30, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400', 10),
('Long Walk to Freedom', 'Nelson Mandela', 'Hồi ký của Nelson Mandela', 380000, 25, 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400', 10),
('The Autobiography of Malcolm X', 'Malcolm X', 'Tự truyện của Malcolm X', 320000, 20, 'https://images.unsplash.com/photo-1519731491571-db9afd5bd696?w=400', 10),
('Becoming', 'Michelle Obama', 'Hồi ký của cựu Đệ nhất phu nhân Mỹ', 395000, 35, 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400', 10),
('Open', 'Andre Agassi', 'Tự truyện của tay vợt huyền thoại', 290000, 28, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', 10),
('Kitchen Confidential', 'Anthony Bourdain', 'Hồi ký của đầu bếp nổi tiếng', 275000, 32, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', 10),
('Born a Crime', 'Trevor Noah', 'Hồi ký của MC Trevor Noah', 265000, 40, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', 10),
('Tôi đi học', 'Nguyễn Ngọc Ký', 'Tự truyện của thầy giáo viết bằng chân', 185000, 45, 'https://images.unsplash.com/photo-1594736797933-d0401ba49e56?w=400', 10),
('The Glass Castle', 'Jeannette Walls', 'Hồi ký về tuổi thơ đầy thử thách', 245000, 22, 'https://images.unsplash.com/photo-1588497859490-85d1c17db96d?w=400', 10),
('Wild', 'Cheryl Strayed', 'Hành trình tìm lại chính mình', 230000, 38, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400', 10),

-- Thơ ca (Genre ID: 11)
INSERT INTO books (title, author, description, price, stock, image_url, genre_id) VALUES
('Nhật ký trong tù', 'Hồ Chí Minh', 'Tập thơ của Chủ tịch Hồ Chí Minh', 120000, 60, 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400', 11),
('Thơ Xuân Diệu', 'Xuân Diệu', 'Tuyển tập thơ của nhà thơ lãng mạn', 145000, 40, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400', 11),
('Thơ Tố Hữu', 'Tố Hữu', 'Tuyển tập thơ của Tố Hữu', 130000, 35, 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400', 11),
('Hội quán', 'Nguyễn Bính', 'Tập thơ nổi tiếng của Nguyễn Bính', 110000, 50, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', 11),
('Leaves of Grass', 'Walt Whitman', 'Tác phẩm thơ kinh điển của Mỹ', 180000, 25, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', 11),
('The Waste Land', 'T.S. Eliot', 'Bài thơ hiện đại nổi tiếng', 155000, 30, 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400', 11),
('Thơ Hàn Mặc Tử', 'Hàn Mặc Tử', 'Tuyển tập thơ của Hàn Mặc Tử', 125000, 42, 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=400', 11),
('Love Poems', 'Pablo Neruda', 'Tập thơ tình của Pablo Neruda', 165000, 28, 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400', 11),
('Rumi: Selected Poems', 'Rumi', 'Tuyển tập thơ của nhà thơ Sufi', 170000, 32, 'https://images.unsplash.com/photo-1519731491571-db9afd5bd696?w=400', 11),
('Ngôi sao nứt', 'Tế Hanh', 'Tập thơ của nhà thơ trẻ', 95000, 45, 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400', 11),

-- Giáo dục (Genre ID: 12)
INSERT INTO books (title, author, description, price, stock, image_url, genre_id) VALUES
('Dạy con làm người', 'TS. Lê Thẩm Dương', 'Phương pháp giáo dục trẻ em hiệu quả', 195000, 50, 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400', 12),
('Pedagogy of the Oppressed', 'Paulo Freire', 'Triết lý giáo dục giải phóng', 220000, 30, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', 12),
('How Children Learn', 'John Holt', 'Cách trẻ em học tập tự nhiên', 185000, 35, 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', 12),
('The Courage to Teach', 'Parker Palmer', 'Dũng khí để dạy học', 210000, 25, 'https://images.unsplash.com/photo-1594736797933-d0401ba49e56?w=400', 12),
('Summerhill School', 'A.S. Neill', 'Mô hình giáo dục dân chủ', 235000, 20, 'https://images.unsplash.com/photo-1588497859490-85d1c17db96d?w=400', 12),
('Giáo dục học đại cương', 'PGS.TS Nguyễn Kỳ', 'Giáo trình giáo dục học cơ bản', 165000, 60, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=400', 12),
('Multiple Intelligences', 'Howard Gardner', 'Lý thuyết đa trí thông minh', 255000, 28, 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400', 12),
('Mindstorms', 'Seymour Papert', 'Máy tính và học tập', 280000, 22, 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400', 12),
('The Art and Science of Teaching', 'Robert Marzano', 'Nghệ thuật và khoa học giảng dạy', 290000, 32, 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400', 12),
('Phương pháp học tập hiệu quả', 'Cao Xuân Hạo', 'Bí quyết học giỏi cho học sinh', 145000, 55, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400', 12);

-- Update sequences (if using PostgreSQL)
-- SELECT setval('genres_genre_id_seq', (SELECT MAX(genre_id) FROM genres));
-- SELECT setval('books_book_id_seq', (SELECT MAX(book_id) FROM books)); 