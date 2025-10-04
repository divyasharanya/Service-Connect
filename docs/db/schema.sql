-- SQL schema for ServiceConnect (PostgreSQL/MySQL compatible subset)

-- Users
CREATE TABLE users (
  id            VARCHAR(36) PRIMARY KEY,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name          VARCHAR(120) NOT NULL,
  role          ENUM('customer','technician','admin') NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Services
CREATE TABLE services (
  id          VARCHAR(36) PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  description TEXT,
  price_from  DECIMAL(10,2) NOT NULL DEFAULT 0
);

-- Technicians
CREATE TABLE technicians (
  id           VARCHAR(36) PRIMARY KEY,
  user_id      VARCHAR(36) NOT NULL,
  service_id   VARCHAR(36) NOT NULL,
  rating       DECIMAL(3,2) NOT NULL DEFAULT 0,
  verified     BOOLEAN NOT NULL DEFAULT FALSE,
  earnings     DECIMAL(10,2) NOT NULL DEFAULT 0,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (service_id) REFERENCES services(id)
);

-- Bookings
CREATE TABLE bookings (
  id             VARCHAR(36) PRIMARY KEY,
  service_id     VARCHAR(36) NOT NULL,
  customer_id    VARCHAR(36) NOT NULL,
  technician_id  VARCHAR(36),
  scheduled_at   TIMESTAMP NOT NULL,
  location       VARCHAR(255) NOT NULL,
  status         ENUM('pending','accepted','completed','rejected','cancelled') NOT NULL DEFAULT 'pending',
  rating         INTEGER CHECK (rating BETWEEN 1 AND 5),
  review         TEXT,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (service_id) REFERENCES services(id),
  FOREIGN KEY (customer_id) REFERENCES users(id),
  FOREIGN KEY (technician_id) REFERENCES technicians(id)
);

-- Reviews (separate table if needed)
CREATE TABLE reviews (
  id          VARCHAR(36) PRIMARY KEY,
  booking_id  VARCHAR(36) NOT NULL UNIQUE,
  rating      INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review      TEXT,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
);

-- Wallet Transactions
CREATE TABLE wallet_transactions (
  id             VARCHAR(36) PRIMARY KEY,
  technician_id  VARCHAR(36) NOT NULL,
  amount         DECIMAL(10,2) NOT NULL,
  type           ENUM('credit','debit') NOT NULL,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (technician_id) REFERENCES technicians(id)
);