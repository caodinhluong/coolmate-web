CREATE DATABASE coolmate;
USE coolmate;

-- Bảng category
CREATE TABLE category (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    mota TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
);

-- Bảng supplier
CREATE TABLE supplier (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    contact_name VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    phone VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    email VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    address VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    created_at DATETIME DEFAULT NOW()
);

-- Bảng user
CREATE TABLE user (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    email VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    password VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    phone VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    address VARCHAR(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    role VARCHAR(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci CHECK (role IN ('customer', 'admin')),
    avt_url VARCHAR(100),
    gender VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    username VARCHAR(100) UNIQUE
);

-- Bảng voucher
CREATE TABLE voucher (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    discount INT,
    quantity INT,
    validity_period VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    conditional VARCHAR(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    description VARCHAR(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
);

-- Bảng product
CREATE TABLE product (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    mota TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    price FLOAT, -- Đổi từ DECIMAL(10,2) sang FLOAT
    category_id CHAR(36),
    image_url VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    title VARCHAR(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    supplier_id CHAR(36),
    FOREIGN KEY (category_id) REFERENCES category(id),
    FOREIGN KEY (supplier_id) REFERENCES supplier(id)
);

-- Bảng product_size
CREATE TABLE product_size (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    product_id CHAR(36),
    size VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    stock INT NOT NULL DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES product(id),
    UNIQUE (product_id, size)
);

-- Bảng cart
CREATE TABLE cart (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    customer_id CHAR(36),
    FOREIGN KEY (customer_id) REFERENCES user(id)
);

-- Bảng customer_order
CREATE TABLE customer_order (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36),
    status VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    order_date DATETIME DEFAULT NOW(),
    payment_method VARCHAR(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    voucher_id CHAR(36),
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (voucher_id) REFERENCES voucher(id)
);

-- Bảng import_invoice
CREATE TABLE import_invoice (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    supplier_id CHAR(36),
    user_id CHAR(36),
    import_date DATETIME DEFAULT NOW(),
    total_amount FLOAT NOT NULL, -- Đổi từ DECIMAL(15,2) sang FLOAT
    status VARCHAR(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pending',
    FOREIGN KEY (supplier_id) REFERENCES supplier(id),
    FOREIGN KEY (user_id) REFERENCES user(id)
);

-- Bảng cart_detail
CREATE TABLE cart_detail (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    cart_id CHAR(36),
    product_size_id CHAR(36),
    quantity INT NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES cart(id),
    FOREIGN KEY (product_size_id) REFERENCES product_size(id)
);

-- Bảng feedback
CREATE TABLE feedback (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36),
    message TEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
    product_id CHAR(36),
    rating INT,
    create_at DATETIME,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);

-- Bảng customer_order_detail
CREATE TABLE customer_order_detail (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    order_id CHAR(36),
    product_size_id CHAR(36),
    quantity INT NOT NULL,
    price FLOAT NOT NULL, -- Đổi từ DECIMAL(10,2) sang FLOAT
    FOREIGN KEY (order_id) REFERENCES customer_order(id),
    FOREIGN KEY (product_size_id) REFERENCES product_size(id)
);

-- Bảng sale_pr
CREATE TABLE sale_pr (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    product_id CHAR(36),
    discount INT,
    start_date DATETIME,
    end_date DATETIME,
    FOREIGN KEY (product_id) REFERENCES product(id)
);

-- Bảng import_invoice_detail
CREATE TABLE import_invoice_detail (
    id CHAR(36) NOT NULL PRIMARY KEY DEFAULT (UUID()),
    import_invoice_id CHAR(36),
    product_size_id CHAR(36),
    quantity INT NOT NULL,
    unit_price FLOAT NOT NULL, -- Đổi từ DECIMAL(10,2) sang FLOAT
    total_price FLOAT AS (quantity * unit_price) STORED, -- Đổi từ DECIMAL(15,2) sang FLOAT
    FOREIGN KEY (import_invoice_id) REFERENCES import_invoice(id),
    FOREIGN KEY (product_size_id) REFERENCES product_size(id)
);
-- 1. Bảng category
INSERT INTO category (name, mota) VALUES
('Áo sơ mi nam', 'Áo sơ mi phong cách lịch lãm cho nam'),
('Quần tây nam', 'Quần tây công sở và dạo phố'),
('Áo thun nam', 'Áo thun thoải mái, năng động cho nam'),
('Quần jeans nam', 'Quần jeans thời trang nam giới'),
('Áo khoác nam', 'Áo khoác nam phong cách hiện đại');

-- 2. Bảng supplier
INSERT INTO supplier (name, contact_name, phone, email, address) VALUES
('Công ty Thời Trang Nam A', 'Nguyễn Văn An', '0901234567', 'nguyenvanan@gmail.com', '123 Đường Lê Lợi, TP.HCM'),
('Công ty May Mặc B', 'Trần Thị Bình', '0912345678', 'tranthibinh@gmail.com', '456 Đường Nguyễn Huệ, Hà Nội'),
('Công ty Sản Xuất C', 'Lê Văn Cường', '0923456789', 'levancuong@gmail.com', '789 Đường Trần Phú, Đà Nẵng'),
('Công ty Nam Phong D', 'Phạm Thị Dung', '0934567890', 'phamthidung@gmail.com', '321 Đường Võ Văn Tần, TP.HCM'),
('Công ty Thời Trang E', 'Hoàng Văn Em', '0945678901', 'hoangvanem@gmail.com', '654 Đường Hòa Hảo, TP.HCM');

-- 3. Bảng user
INSERT INTO user (name, email, password, phone, address, role, avt_url, gender, username) VALUES
('Nguyễn Văn Hùng', 'hungnv@gmail.com', 'pass123', '0909876543', '12 Nguyễn Trãi, HCM', 'customer', 'avatar1.jpg', 'Nam', 'hungnv'),
('Trần Văn Khoa', 'khoatv@gmail.com', 'pass456', '0918765432', '34 Lê Duẩn, HN', 'customer', 'avatar2.jpg', 'Nam', 'khoatv'),
('Lê Minh Tuấn', 'tuanlm@gmail.com', 'admin123', '0927654321', '56 Trần Hưng Đạo, ĐN', 'admin', 'avatar3.jpg', 'Nam', 'tuanlm'),
('Phạm Quốc Anh', 'anhpq@gmail.com', 'pass789', '0936543210', '78 Võ Thị Sáu, HCM', 'customer', 'avatar4.jpg', 'Nam', 'anhpq'),
('Hoàng Anh Dũng', 'dungha@gmail.com', 'admin456', '0945432109', '90 Hai Bà Trưng, HN', 'admin', 'avatar5.jpg', 'Nam', 'dungha');

-- 4. Bảng voucher
INSERT INTO voucher (name, discount, quantity, validity_period, conditional, description) VALUES
('Giảm 10%', 10, 100, '30/04/2025', 'Đơn từ 500000', 'Giảm giá 10%'),
('Giảm 20K', 20000, 50, '15/05/2025', 'Đơn từ 300000', 'Giảm 20K'),
('Freeship', 0, 200, '31/03/2025', 'Đơn từ 200000', 'Miễn phí vận chuyển'),
('Giảm 50K', 50000, 30, '20/06/2025', 'Đơn từ 1000000', 'Giảm 50K'),
('Giảm 5%', 5, 150, '10/04/2025', 'Đơn từ 400000', 'Giảm giá 5%');

-- 5. Bảng product (sử dụng category_id và supplier_id từ các bảng trên)
INSERT INTO product (name, mota, price, category_id, image_url, title, supplier_id) VALUES
('Áo sơ mi trắng', 'Áo sơ mi nam cotton', 250000, (SELECT id FROM category WHERE name = 'Áo sơ mi nam'), 'white_shirt.jpg', 'Áo sơ mi nam lịch lãm', (SELECT id FROM supplier WHERE name = 'Công ty Thời Trang Nam A')),
('Quần tây đen', 'Quần tây nam công sở', 350000, (SELECT id FROM category WHERE name = 'Quần tây nam'), 'black_trousers.jpg', 'Quần tây nam cao cấp', (SELECT id FROM supplier WHERE name = 'Công ty May Mặc B')),
('Áo thun xám', 'Áo thun nam thoải mái', 150000, (SELECT id FROM category WHERE name = 'Áo thun nam'), 'grey_tshirt.jpg', 'Áo thun nam năng động', (SELECT id FROM supplier WHERE name = 'Công ty Sản Xuất C')),
('Quần jeans xanh', 'Quần jeans nam thời trang', 400000, (SELECT id FROM category WHERE name = 'Quần jeans nam'), 'blue_jeans.jpg', 'Quần jeans nam phong cách', (SELECT id FROM supplier WHERE name = 'Công ty Nam Phong D')),
('Áo khoác kaki', 'Áo khoác nam mùa đông', 600000, (SELECT id FROM category WHERE name = 'Áo khoác nam'), 'kaki_jacket.jpg', 'Áo khoác nam hiện đại', (SELECT id FROM supplier WHERE name = 'Công ty Thời Trang E'));

-- 6. Bảng product_size (sử dụng product_id từ bảng product)
INSERT INTO product_size (product_id, size, stock) VALUES
((SELECT id FROM product WHERE name = 'Áo sơ mi trắng'), 'M', 50),
((SELECT id FROM product WHERE name = 'Quần tây đen'), 'L', 30),
((SELECT id FROM product WHERE name = 'Áo thun xám'), 'XL', 40),
((SELECT id FROM product WHERE name = 'Quần jeans xanh'), 'M', 25),
((SELECT id FROM product WHERE name = 'Áo khoác kaki'), 'L', 20);

-- 7. Bảng cart (sử dụng customer_id từ bảng user)
INSERT INTO cart (customer_id) VALUES
((SELECT id FROM user WHERE name = 'Nguyễn Văn Hùng')),
((SELECT id FROM user WHERE name = 'Trần Văn Khoa')),
((SELECT id FROM user WHERE name = 'Phạm Quốc Anh')),
((SELECT id FROM user WHERE name = 'Lê Minh Tuấn')),
((SELECT id FROM user WHERE name = 'Hoàng Anh Dũng'));

-- 8. Bảng customer_order (sử dụng user_id và voucher_id)
INSERT INTO customer_order (user_id, status, order_date, payment_method, voucher_id) VALUES
((SELECT id FROM user WHERE name = 'Nguyễn Văn Hùng'), 'Đã giao', NOW(), 'COD', (SELECT id FROM voucher WHERE name = 'Giảm 10%')),
((SELECT id FROM user WHERE name = 'Trần Văn Khoa'), 'Đang xử lý', NOW(), 'Card', (SELECT id FROM voucher WHERE name = 'Freeship')),
((SELECT id FROM user WHERE name = 'Phạm Quốc Anh'), 'Chờ xác nhận', NOW(), 'COD', NULL),
((SELECT id FROM user WHERE name = 'Lê Minh Tuấn'), 'Đã hủy', NOW(), 'Card', NULL),
((SELECT id FROM user WHERE name = 'Hoàng Anh Dũng'), 'Đã giao', NOW(), 'COD', (SELECT id FROM voucher WHERE name = 'Giảm 20K'));

-- 9. Bảng import_invoice (sử dụng supplier_id và user_id)
INSERT INTO import_invoice (supplier_id, user_id, import_date, total_amount, status) VALUES
((SELECT id FROM supplier WHERE name = 'Công ty Thời Trang Nam A'), (SELECT id FROM user WHERE name = 'Lê Minh Tuấn'), NOW(), 5000000, 'completed'),
((SELECT id FROM supplier WHERE name = 'Công ty May Mặc B'), (SELECT id FROM user WHERE name = 'Hoàng Anh Dũng'), NOW(), 3000000, 'pending'),
((SELECT id FROM supplier WHERE name = 'Công ty Sản Xuất C'), (SELECT id FROM user WHERE name = 'Lê Minh Tuấn'), NOW(), 4000000, 'completed'),
((SELECT id FROM supplier WHERE name = 'Công ty Nam Phong D'), (SELECT id FROM user WHERE name = 'Hoàng Anh Dũng'), NOW(), 6000000, 'pending'),
((SELECT id FROM supplier WHERE name = 'Công ty Thời Trang E'), (SELECT id FROM user WHERE name = 'Lê Minh Tuấn'), NOW(), 7500000, 'completed');

-- 10. Bảng cart_detail (sử dụng cart_id và product_size_id)
INSERT INTO cart_detail (cart_id, product_size_id, quantity) VALUES
((SELECT id FROM cart WHERE customer_id = (SELECT id FROM user WHERE name = 'Nguyễn Văn Hùng')), (SELECT id FROM product_size WHERE size = 'M' AND product_id = (SELECT id FROM product WHERE name = 'Áo sơ mi trắng')), 2),
((SELECT id FROM cart WHERE customer_id = (SELECT id FROM user WHERE name = 'Trần Văn Khoa')), (SELECT id FROM product_size WHERE size = 'L' AND product_id = (SELECT id FROM product WHERE name = 'Quần tây đen')), 1),
((SELECT id FROM cart WHERE customer_id = (SELECT id FROM user WHERE name = 'Phạm Quốc Anh')), (SELECT id FROM product_size WHERE size = 'XL' AND product_id = (SELECT id FROM product WHERE name = 'Áo thun xám')), 3),
((SELECT id FROM cart WHERE customer_id = (SELECT id FROM user WHERE name = 'Lê Minh Tuấn')), (SELECT id FROM product_size WHERE size = 'M' AND product_id = (SELECT id FROM product WHERE name = 'Quần jeans xanh')), 1),
((SELECT id FROM cart WHERE customer_id = (SELECT id FROM user WHERE name = 'Hoàng Anh Dũng')), (SELECT id FROM product_size WHERE size = 'L' AND product_id = (SELECT id FROM product WHERE name = 'Áo khoác kaki')), 2);

-- 11. Bảng feedback (sử dụng user_id và product_id)
INSERT INTO feedback (user_id, message, product_id, rating, create_at) VALUES
((SELECT id FROM user WHERE name = 'Nguyễn Văn Hùng'), 'Chất lượng tốt, vừa vặn', (SELECT id FROM product WHERE name = 'Áo sơ mi trắng'), 5, NOW()),
((SELECT id FROM user WHERE name = 'Trần Văn Khoa'), 'Quần đẹp, giao hàng nhanh', (SELECT id FROM product WHERE name = 'Quần tây đen'), 4, NOW()),
((SELECT id FROM user WHERE name = 'Phạm Quốc Anh'), 'Áo hơi chật', (SELECT id FROM product WHERE name = 'Áo thun xám'), 3, NOW()),
((SELECT id FROM user WHERE name = 'Lê Minh Tuấn'), 'Jeans chất lượng cao', (SELECT id FROM product WHERE name = 'Quần jeans xanh'), 5, NOW()),
((SELECT id FROM user WHERE name = 'Hoàng Anh Dũng'), 'Áo khoác ấm, đáng tiền', (SELECT id FROM product WHERE name = 'Áo khoác kaki'), 4, NOW());

-- 12. Bảng customer_order_detail (sử dụng order_id và product_size_id)
INSERT INTO customer_order_detail (order_id, product_size_id, quantity, price) VALUES
((SELECT id FROM customer_order WHERE user_id = (SELECT id FROM user WHERE name = 'Nguyễn Văn Hùng')), (SELECT id FROM product_size WHERE size = 'M' AND product_id = (SELECT id FROM product WHERE name = 'Áo sơ mi trắng')), 2, 250000),
((SELECT id FROM customer_order WHERE user_id = (SELECT id FROM user WHERE name = 'Trần Văn Khoa')), (SELECT id FROM product_size WHERE size = 'L' AND product_id = (SELECT id FROM product WHERE name = 'Quần tây đen')), 1, 350000),
((SELECT id FROM customer_order WHERE user_id = (SELECT id FROM user WHERE name = 'Phạm Quốc Anh')), (SELECT id FROM product_size WHERE size = 'XL' AND product_id = (SELECT id FROM product WHERE name = 'Áo thun xám')), 3, 150000),
((SELECT id FROM customer_order WHERE user_id = (SELECT id FROM user WHERE name = 'Lê Minh Tuấn')), (SELECT id FROM product_size WHERE size = 'M' AND product_id = (SELECT id FROM product WHERE name = 'Quần jeans xanh')), 1, 400000),
((SELECT id FROM customer_order WHERE user_id = (SELECT id FROM user WHERE name = 'Hoàng Anh Dũng')), (SELECT id FROM product_size WHERE size = 'L' AND product_id = (SELECT id FROM product WHERE name = 'Áo khoác kaki')), 2, 600000);

-- 13. Bảng sale_pr (sử dụng product_id)
INSERT INTO sale_pr (name, product_id, discount, start_date, end_date) VALUES
('Sale áo sơ mi', (SELECT id FROM product WHERE name = 'Áo sơ mi trắng'), 20, '2025-03-01', '2025-03-15'),
('Sale quần tây', (SELECT id FROM product WHERE name = 'Quần tây đen'), 15, '2025-03-10', '2025-03-20'),
('Sale áo thun', (SELECT id FROM product WHERE name = 'Áo thun xám'), 10, '2025-03-05', '2025-03-25'),
('Sale jeans', (SELECT id FROM product WHERE name = 'Quần jeans xanh'), 25, '2025-03-15', '2025-03-30'),
('Sale áo khoác', (SELECT id FROM product WHERE name = 'Áo khoác kaki'), 30, '2025-03-20', '2025-04-01');

-- 14. Bảng import_invoice_detail (sử dụng import_invoice_id và product_size_id)
INSERT INTO import_invoice_detail (import_invoice_id, product_size_id, quantity, unit_price) VALUES
((SELECT id FROM import_invoice WHERE supplier_id = (SELECT id FROM supplier WHERE name = 'Công ty Thời Trang Nam A')), (SELECT id FROM product_size WHERE size = 'M' AND product_id = (SELECT id FROM product WHERE name = 'Áo sơ mi trắng')), 50, 200000),
((SELECT id FROM import_invoice WHERE supplier_id = (SELECT id FROM supplier WHERE name = 'Công ty May Mặc B')), (SELECT id FROM product_size WHERE size = 'L' AND product_id = (SELECT id FROM product WHERE name = 'Quần tây đen')), 30, 300000),
((SELECT id FROM import_invoice WHERE supplier_id = (SELECT id FROM supplier WHERE name = 'Công ty Sản Xuất C')), (SELECT id FROM product_size WHERE size = 'XL' AND product_id = (SELECT id FROM product WHERE name = 'Áo thun xám')), 40, 120000),
((SELECT id FROM import_invoice WHERE supplier_id = (SELECT id FROM supplier WHERE name = 'Công ty Nam Phong D')), (SELECT id FROM product_size WHERE size = 'M' AND product_id = (SELECT id FROM product WHERE name = 'Quần jeans xanh')), 25, 350000),
((SELECT id FROM import_invoice WHERE supplier_id = (SELECT id FROM supplier WHERE name = 'Công ty Thời Trang E')), (SELECT id FROM product_size WHERE size = 'L' AND product_id = (SELECT id FROM product WHERE name = 'Áo khoác kaki')), 20, 500000);


-- tạo hóa đơn
DELIMITER //

CREATE PROCEDURE sp_order_create (
    IN order_id CHAR(36),
    IN user_id CHAR(36),
    IN status VARCHAR(50),
    IN order_date DATETIME,
    IN payment_method VARCHAR(10),
    IN voucher_id CHAR(36),
    IN listjson_orderdetail TEXT
)
BEGIN
    -- Chèn dữ liệu vào bảng customer_order
    INSERT INTO customer_order (
        id,
        user_id,
        status,
        order_date,
        payment_method,
        voucher_id
    )
    VALUES (
        order_id,
        user_id,
        status,
        order_date,
        payment_method,
        voucher_id
    );

    -- Nếu có dữ liệu JSON chi tiết hóa đơn thì chèn vào customer_order_detail
    IF listjson_orderdetail IS NOT NULL THEN
        INSERT INTO customer_order_detail (
            id,
            order_id,
            product_size_id,
            quantity,
            price
        )
        SELECT
            UUID(),                     -- Tự sinh id bằng UUID()
            order_id,                   -- Sử dụng order_id từ tham số
            JSON_UNQUOTE(JSON_EXTRACT(l.value, '$.product_size_id')), -- Lấy product_size_id từ JSON
            JSON_UNQUOTE(JSON_EXTRACT(l.value, '$.quantity')),        -- Lấy quantity từ JSON
            JSON_UNQUOTE(JSON_EXTRACT(l.value, '$.price'))            -- Lấy price từ JSON
        FROM JSON_TABLE(
            listjson_orderdetail,
            '$[*]' COLUMNS (value JSON PATH '$')
        ) AS l;
    END IF;

    -- Trả về chuỗi rỗng (tương tự SELECT '' trong SQL Server)
    
END //

DELIMITER ;


