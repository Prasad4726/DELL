-- ============================================
-- City-Wide Parking Rental Application
-- Standard SQL Database Schema (Vendor-Neutral)
-- Compatible with MySQL, PostgreSQL, SQL Server, etc.
-- ============================================

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT chk_user_role CHECK (role IN ('USER', 'OWNER', 'ADMIN'))
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ============================================
-- PARKINGS TABLE
-- ============================================
CREATE TABLE parkings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    name VARCHAR(200) NOT NULL,
    address TEXT NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    price_per_hour DECIMAL(10, 2) NOT NULL,
    type VARCHAR(20) NOT NULL DEFAULT 'PRIVATE',
    total_slots INT NOT NULL DEFAULT 1,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_parking_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_parking_type CHECK (type IN ('PUBLIC', 'PRIVATE'))
);

CREATE INDEX idx_parkings_owner ON parkings(owner_id);
CREATE INDEX idx_parkings_type ON parkings(type);
CREATE INDEX idx_parkings_location ON parkings(latitude, longitude);

-- ============================================
-- PARKING SLOTS TABLE
-- ============================================
CREATE TABLE parking_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    parking_id INT NOT NULL,
    slot_number VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_slot_parking FOREIGN KEY (parking_id) REFERENCES parkings(id) ON DELETE CASCADE,
    CONSTRAINT chk_slot_status CHECK (status IN ('AVAILABLE', 'OCCUPIED', 'RESERVED', 'MAINTENANCE')),
    CONSTRAINT uk_parking_slot UNIQUE (parking_id, slot_number)
);

CREATE INDEX idx_parking_slots_parking ON parking_slots(parking_id);
CREATE INDEX idx_parking_slots_status ON parking_slots(status);

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    parking_id INT NOT NULL,
    slot_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    total_hours DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    booking_code VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_parking FOREIGN KEY (parking_id) REFERENCES parkings(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_slot FOREIGN KEY (slot_id) REFERENCES parking_slots(id) ON DELETE CASCADE,
    CONSTRAINT chk_booking_status CHECK (status IN ('PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED', 'CANCELLED')),
    CONSTRAINT chk_booking_time CHECK (end_time > start_time)
);

CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_parking ON bookings(parking_id);
CREATE INDEX idx_bookings_slot ON bookings(slot_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_time ON bookings(start_time, end_time);
CREATE INDEX idx_bookings_code ON bookings(booking_code);

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'CARD',
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    transaction_id VARCHAR(255) UNIQUE,
    payment_gateway VARCHAR(50),
    gateway_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    CONSTRAINT chk_payment_method CHECK (payment_method IN ('CARD', 'UPI', 'WALLET', 'CASH', 'NETBANKING')),
    CONSTRAINT chk_payment_status CHECK (status IN ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED'))
);

CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction ON payments(transaction_id);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    parking_id INT NOT NULL,
    booking_id INT,
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_parking FOREIGN KEY (parking_id) REFERENCES parkings(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
    CONSTRAINT chk_review_rating CHECK (rating >= 1 AND rating <= 5),
    CONSTRAINT uk_user_booking_review UNIQUE (user_id, booking_id)
);

CREATE INDEX idx_reviews_parking ON reviews(parking_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Insert sample admin user (password: admin123)
-- Password hash generated with bcrypt for 'admin123'
INSERT INTO users (name, email, phone, password, role) VALUES
('Admin User', 'admin@parking.com', '+1234567890', '$2a$10$XqZ1J9Z9Z9Z9Z9Z9Z9Z9ZuN7KqX8Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z', 'ADMIN');

-- Insert sample owner user (password: owner123)
INSERT INTO users (name, email, phone, password, role) VALUES
('John Owner', 'owner@parking.com', '+1234567891', '$2a$10$XqZ1J9Z9Z9Z9Z9Z9Z9Z9ZuN7KqX8Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z', 'OWNER');

-- Insert sample regular user (password: user123)
INSERT INTO users (name, email, phone, password, role) VALUES
('Jane User', 'user@parking.com', '+1234567892', '$2a$10$XqZ1J9Z9Z9Z9Z9Z9Z9Z9ZuN7KqX8Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z9Z', 'USER');

-- Insert sample parking locations
INSERT INTO parkings (owner_id, name, address, latitude, longitude, price_per_hour, type, total_slots, description) VALUES
(2, 'Downtown Parking Plaza', '123 Main Street, City Center', 28.6139, 77.2090, 50.00, 'PUBLIC', 50, 'Covered parking with 24/7 security'),
(2, 'Airport Parking', '456 Airport Road', 28.5562, 77.1000, 75.00, 'PUBLIC', 100, 'Long-term and short-term parking available'),
(2, 'Mall Parking', '789 Shopping District', 28.6304, 77.2177, 40.00, 'PRIVATE', 30, 'Underground parking with EV charging');

-- Note: Replace the password hashes above with actual bcrypt hashes in production
-- The hashes shown are placeholders and will not work for authentication
