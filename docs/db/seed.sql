-- Seed data for ServiceConnect

-- Services
INSERT INTO services (id, name, description, price_from) VALUES
  ('svc_plumber','Plumber','Pipes, leaks, installation',49.00),
  ('svc_carpenter','Carpenter','Furniture, fittings, repairs',59.00),
  ('svc_electrician','Electrician','Wiring, fixtures, troubleshooting',69.00);

-- Users (password_hash placeholders)
INSERT INTO users (id, email, password_hash, name, role) VALUES
  ('user_cust_1','divya@example.com','hash_here','Divya','customer'),
  ('user_tech_1','ravi@example.com','hash_here','Ravi Kumar','technician'),
  ('user_tech_2','anita@example.com','hash_here','Anita Sharma','technician'),
  ('user_admin_1','admin@serviceconnect.com','hash_here','Admin User','admin');

-- Technicians
INSERT INTO technicians (id, user_id, service_id, rating, verified, earnings) VALUES
  ('tech_1','user_tech_1','svc_plumber',4.60,TRUE,325.50),
  ('tech_2','user_tech_2','svc_electrician',4.80,TRUE,410.00);

-- Bookings
INSERT INTO bookings (id, service_id, customer_id, technician_id, scheduled_at, location, status, rating, review) VALUES
  ('bk_1','svc_plumber','user_cust_1','tech_1',CURRENT_TIMESTAMP,'Bengaluru','pending',NULL,NULL),
  ('bk_2','svc_electrician','user_cust_1','tech_2',CURRENT_TIMESTAMP + INTERVAL '1 day','Hyderabad','accepted',NULL,NULL);
