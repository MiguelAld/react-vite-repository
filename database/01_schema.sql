CREATE DATABASE comunidad_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE comunidad_db;

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  dni VARCHAR(12) NOT NULL UNIQUE,
  name VARCHAR(80) NOT NULL,
  email VARCHAR(120),
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('VECINO','ADMIN') NOT NULL DEFAULT 'VECINO',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE zones (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_by BIGINT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id)
);

CREATE TABLE incidents (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  zone_id BIGINT NOT NULL,
  created_by BIGINT NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT NOT NULL,
  status ENUM('PENDIENTE','EN_PROCESO','RESUELTA') DEFAULT 'PENDIENTE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  closed_at TIMESTAMP NULL,
  FOREIGN KEY (zone_id) REFERENCES zones(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

DROP TABLE IF EXISTS documents;

CREATE TABLE documents (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(150) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  stored_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size_bytes BIGINT NOT NULL,
  uploaded_by BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users(id)
);

INSERT INTO zones (name) VALUES
('Garaje'),
('Piscina'),
('Jardín Principal'),
('Jardín Trasero'),
('Cancha de Baloncesto'),
('Baños Públicos');


dfhbsdfhbsdfghsdfgbs


INSERT INTO users (dni, name, email, password_hash, role)
VALUES ('12345678M', 'Admin', 'admin@gmail.com', '$2b$10$n7w9QKFCsc90sfRF5DJfde1FXS9FYcRkj4mlB0nTwU/N2EtTkTYpa', 'ADMIN');

select * from users;

SELECT id, dni, name, role FROM users;

SELECT id, dni, password_hash, role
FROM users
WHERE dni = '12345678M';