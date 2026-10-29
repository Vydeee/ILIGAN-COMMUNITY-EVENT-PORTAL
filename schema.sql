CREATE DATABASE IF NOT EXISTS `iligan_events_db` 
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE `iligan_events_db`;

CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL COMMENT 'Full name of the user',
    `email` VARCHAR(150) NOT NULL UNIQUE COMMENT 'Unique contact email',
    `phone` VARCHAR(30) NULL COMMENT 'Mobile number for SMS updates',
    `role` ENUM('user', 'organizer', 'admin') NOT NULL DEFAULT 'user' COMMENT 'Role determines access permissions (Citizen vs Coordinator vs Administrator)',
    `password` VARCHAR(255) NOT NULL DEFAULT 'password123' COMMENT 'Secure password or hash',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `events` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(200) NOT NULL COMMENT 'Descriptive title of the community event',
    `description` TEXT NOT NULL COMMENT 'Detailed overview, instructions, and highlights',
    `image_url` VARCHAR(500) NULL COMMENT 'Banner image URL or relative path',
    `category` VARCHAR(50) NOT NULL COMMENT 'Category (Festival, LGU Public Service, Arts & Culture, Sports, Eco-Tourism)',
    `barangay` VARCHAR(100) NOT NULL COMMENT 'Barangay location within Iligan City',
    `venue_name` VARCHAR(150) NOT NULL COMMENT 'Specific venue or landmark (e.g. Anahaw Amphitheater)',
    `event_date` DATE NOT NULL COMMENT 'Date of the event',
    `event_time` TIME NOT NULL COMMENT 'Start time in 24h format',
    `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT '0.00 indicates Free community event',
    `total_slots` INT NOT NULL COMMENT 'Maximum attendee capacity',
    `available_slots` INT NOT NULL COMMENT 'Remaining seats available for discovery/booking',
    `organizer_name` VARCHAR(100) NOT NULL DEFAULT 'Iligan City Tourism Office',
    `coordinator_id` INT NULL,
    `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
    `status` ENUM('active', 'cancelled', 'completed') DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_events_coordinator` FOREIGN KEY (`coordinator_id`) 
        REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `bookings` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `booking_reference` VARCHAR(32) NOT NULL UNIQUE COMMENT 'Unique ticket code (e.g. ILG-2026-AB12)',
    `event_id` INT NOT NULL COMMENT 'Reference to the booked event',
    `user_id` INT NULL COMMENT 'Optional user ID if logged in',
    `attendee_name` VARCHAR(120) NOT NULL COMMENT 'Name printed on the digital pass',
    `attendee_email` VARCHAR(150) NOT NULL COMMENT 'Email for digital confirmation',
    `attendee_phone` VARCHAR(30) NOT NULL COMMENT 'Emergency / contact number',
    `tickets_count` INT NOT NULL DEFAULT 1 COMMENT 'Number of slots reserved',
    `status` ENUM('confirmed', 'cancelled') NOT NULL DEFAULT 'confirmed' COMMENT 'Booking status',
    `booked_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `cancelled_at` TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT `fk_bookings_event` FOREIGN KEY (`event_id`) 
        REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `users` (`name`, `email`, `phone`, `role`, `password`) VALUES
('Mohammad Saumay', 'amina.alonto@gmail.com', '09171234567', 'user', 'password123'),
('Juan dela Cruz', 'juan.delacruz@yahoo.com', '09189876543', 'user', 'password123'),
('Iligan City Tourism Office', 'tourism@iligancity.gov.ph', '09223344556', 'organizer', 'password123'),
('City Health & Community Affairs', 'affairs@iligancity.gov.ph', '09334455667', 'organizer', 'password123'),
('Iligan Youth & Sports Development', 'sports@iligancity.gov.ph', '09445566778', 'organizer', 'password123'),
('Iligan Eco-Tourism & Nature Council', 'ecotourism@iligancity.gov.ph', '09556677889', 'organizer', 'password123'),
('Iligan Arts & Culture Guild', 'arts.guild@iligancity.gov.ph', '09667788990', 'organizer', 'password123'),
('Santiago Bay Tourism Association', 'santiago.tourism@iligancity.gov.ph', '09778899001', 'organizer', 'password123')
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`), `role` = VALUES(`role`), `password` = VALUES(`password`);

INSERT INTO `events` 
(`id`, `title`, `description`, `image_url`, `category`, `barangay`, `venue_name`, `event_date`, `event_time`, `price`, `total_slots`, `available_slots`, `organizer_name`, `status`) 
VALUES
(1, 
 'Diyandi Festival 2026: Kasadya sa Diyandi Street Dancing Competition', 
 'The grand street dancing centerpiece of Diyandi Festival 2026 honoring patron saint Señor San Miguel! Featuring exuberant contingents in authentic tri-people regalia (Higaonon, Maranao, and Christian settlers), synchronized drum rhythms, paraglider aerial salutes over Quezon Avenue, and vibrant downtown street merrymaking.', 
 'images/kasadya_sa_diyandi.jpg',
 'Festival', 
 'Poblacion', 
 'Quezon Avenue to Anahaw Amphitheater, Buhanginan Hills', 
 '2026-11-12', 
 '07:30:00', 
 0.00, 
 1500, 
 1420, 
 'Iligan City Tourism & Cultural Office', 
 'active'),

(2, 
 'Maria Cristina Falls Eco-Trail & Community Tree Planting Caravan', 
 'Join fellow Iliganons for an invigorating ecological morning at the majestic Maria Cristina Falls. Includes a guided nature trek along the riverbanks, tree planting of native dipterocarp seedlings, and complimentary breakfast snacks by local barangay cooperatives.', 
 'https://upload.wikimedia.org/wikipedia/commons/0/05/Maria_Cristina_Falls.jpg',
 'Eco-Tourism', 
 'Maria Cristina', 
 'NPC Nature Park Grounds', 
 '2026-11-15', 
 '06:30:00', 
 120.00, 
 100, 
 74, 
 'Iligan Environmental Protection Council', 
 'active'),

(3, 
 'LGU Tubod Free Community Health Mission & Wellness Clinic', 
 'Free healthcare outreach organized by the City Health Office for all families. Services include general medical consultations, blood pressure & glucose screenings, pediatric checkups, free essential medicines, and dental health kits.', 
 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=800&q=80',
 'LGU Public Service', 
 'Tubod', 
 'Barangay Tubod Multi-Purpose Gymnasium', 
 '2026-11-18', 
 '08:30:00', 
 0.00, 
 250, 
 192, 
 'City Health Office (CHO) Iligan', 
 'active'),

(4, 
 'Timoga Cold Springs Youth Swimming Cup & Water Polo Exhibition', 
 'Dive into the naturally cold, crystal-clear spring waters of Timoga! A spirited community aquatics tournament featuring junior freestyle races, water safety and rescue demos by ICDRRMO, plus family fun games.', 
 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=800&q=80',
 'Sports', 
 'Buru-un', 
 'Timoga Spring Resort Complex', 
 '2026-11-23', 
 '09:00:00', 
 75.00, 
 150, 
 112, 
 'Iligan City Sports & Recreation Division', 
 'active'),

(5, 
 'Pala-o Kulintang Rhythms & Traditional Weaving Workshop', 
 'A hands-on cultural immersion into the traditional arts of Lanao. Learn the fundamental rhythms of the kulintang, agung, and debakan percussion instruments, followed by live demonstration and weaving tutorial with indigenous master artisans.', 
 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
 'Arts & Culture', 
 'Pala-o', 
 'MSU-IIT Cultural Center Amphitheater', 
 '2026-11-02', 
 '14:00:00', 
 50.00, 
 60, 
 38, 
 'Iligan Arts & Culture Guild', 
 'active'),

(6, 
 'Tinago Falls Twilight Photography & Astrostargazing Basecamp', 
 'Capture the enchanting ravines of Tinago Falls as twilight descends. Includes nighttime long-exposure photography instruction, safety guides, hot ginger brew (salabat), and stargazing session along the Ditucalan valley clearing.', 
 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Tinago_Falls.jpg',
 'Eco-Tourism', 
 'Ditucalan', 
 'Ditucalan Eco-Tourism Reception Hall', 
 '2026-11-08', 
 '17:00:00', 
 180.00, 
 40, 
 21, 
 'Ditucalan Ecotourism Guides Association', 
 'active'),

(7, 
 'Paseo de Santiago Sunset Acoustic Jam & Food Bazaar', 
 'Unwind by the breezy coastline of Kiwalan Bay. Enjoy acoustic serenades, local street delicacies, fresh seafood barbecue stalls, and sunset viewing at the famous Paseo de Santiago landmark.', 
 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
 'Eco-Tourism', 
 'Kiwalan', 
 'Kiwalan Bay Shoreline', 
 '2026-11-15', 
 '07:00:00', 
 0.00, 
 80, 
 80, 
 'Santiago Tourism Community Association', 
 'active'),

(8, 
 'Mimbalot Falls Rock Climbing & Zipline Eco-Challenge', 
 'An adrenaline-filled outdoor adventure at Mimbalot Falls. Certified outdoor instructors guide participants through scenic boulder ascents, ziplining across canopy trees, and nature conservation briefings.', 
 'https://images.unsplash.com/photo-1518457607834-6e8d80c183c5?auto=format&fit=crop&w=800&q=80',
 'Sports', 
 'Buru-un', 
 'Iligan Paradise Resort & Mimbalot Falls', 
 '2026-11-20', 
 '08:00:00', 
 150.00, 
 80, 
 52, 
 'Mindanao Outdoor Adventure Society', 
 'active'),

(9, 
 'Pagkanaug sa Patron Señor San Miguel (Diyandi Festival Opening Rites)', 
 'The historic, sacred ceremonial descent (Pagkanaug) of Iligan City\'s patron saint, Saint Michael the Archangel, from his cathedral altar niche to the official festival carriage. Marks the spiritual opening rites of the Diyandi Festival with solemn prayers, novena devotion, and traditional civic blessings.', 
 'images/pagkanaug_san_miguel.png',
 'Festival', 
 'Poblacion', 
 'St. Michael the Archangel Cathedral, Quezon Avenue', 
 '2026-11-08', 
 '07:30:00', 
 0.00, 
 1200, 
 1140, 
 'St. Michael Cathedral Parish & Iligan Diocese', 
 'active'),

(10, 
 'Harana Sessions Live: "Sugal!" Homecoming Acoustic Night', 
 'Homegrown Iliganon sensation Harana Sessions returns to the city stage! An intimate indie-pop and acoustic live concert featuring their fan favorites "Sugal!", "Insomnia", and "Dilag". Bring your friends and celebrate homegrown Northern Mindanao musical talents.', 
 'images/harana_sessions.jpg',
 'Arts & Culture', 
 'Pala-o', 
 'Anahaw Amphitheater, Buhanginan Hills', 
 '2026-11-20', 
 '18:30:00', 
 150.00, 
 450, 
 382, 
 'Seshies Productions & Iligan Music Guild', 
 'active'),

(11, 
 'SouthNova St. Live: "\'Di Alam" Indie Rock Concert & Tour', 
 'Experience an electrifying evening of original indie rock with Iligan City\'s very own SouthNova St.! Performing their chart-topping streaming single "\'Di Alam" alongside energetic tracks by guest local supporting acts. Seaside food stalls, band merch, and meet-and-greet passes available.', 
 'images/southnova_st.jpg',
 'Arts & Culture', 
 'Santiago', 
 'Paseo de Santiago Seaside Amphitheater', 
 '2026-11-26', 
 '19:00:00', 
 100.00, 
 350, 
 289, 
 'SouthNova Collective & Viva Iligan', 
 'active'),

(12, 
 'Miss Iligan 2026: Grand Coronation Night', 
 'The grandest beauty pageant in the City of Majestic Waterfalls! Witness the crowning of Miss Iligan 2026 with hosts Dani Dingcong & Sean Kyle Ortega, celebrity artist Joseph Marco, and the Baby Dolls. Featuring special appearances by reigning beauty queens Katrina Llegado, Apriel Smith, CJ Opiaza, and Gwen Soriano. Tiered passes: Gen. Ad. ₱50, Upper Box ₱100, Lower Box ₱200, VIP ₱500, VVIP ₱1,000. Inquiries: (0924) 129 4995.', 
 'images/miss_iligan_2026.jpg',
 'Arts & Culture', 
 'Tibanga', 
 'MSU-IIT Gymnasium, Tibanga, Iligan City', 
 '2026-11-14', 
 '19:00:00', 
 50.00, 
 850, 
 710, 
 'City Government of Iligan & Viva Iligan', 
 'active'),

(13, 
 'Diyandi Festival Opening Salvo: The Itchyworms Live at Anahaw', 
 'The grand Opening Salvo of the Diyandi Festival under the banner "One Culture. One Heritage. One Celebration." Kick off the month-long festivities with an electrifying live concert headlined by legendary OPM rock band The Itchyworms performing live at the open-air Anahaw Amphitheater! Free admission presented by the City Government of Iligan.', 
 'images/itchyworms_opening_salvo.jpg',
 'Festival', 
 'Pala-o', 
 'Anahaw Amphitheater, Buhanginan Hills', 
 '2026-11-07', 
 '16:00:00', 
 0.00, 
 1800, 
 1650, 
 'City Government of Iligan & Viva Iligan', 
 'active'),

(14, 
 '33rd Silent Drill Competition 2026 (Diyandi Festival)', 
 'The annual Diyandi Civic-Military Parade and Silent Drill Competition! Bringing together uniformed services, ROTC & CAT cadet corps, marching drum and bugle ensembles, civic organizations, and local government units in a grand display of youth discipline and community solidarity.', 
 'images/civic_military_parade.jpg',
 'Festival', 
 'Poblacion', 
 'City Public Plaza to Anahaw Amphitheater, Poblacion', 
 '2026-11-11', 
 '07:00:00', 
 0.00, 
 900, 
 830, 
 'Iligan City Tourism & Cultural Office', 
 'active'),

(15, 
 'Rico Blanco Live in Iligan City: Diyandi Festival Concert', 
 'OPM rock legend Rico Blanco brings the house down live at the open-air Anahaw Amphitheater for the Diyandi Festival 2026 celebration! Sing along under the stars with thousands of fellow music fans to timeless anthems including "Your Universe", "Kisapmata", "Balisong", "Antukin", and "You\'ll Be Safe Here". Free admission presented by the City Government of Iligan.', 
 'images/rico_blanco_iligan.jpg', 
 'Arts & Culture', 
 'Pala-o', 
 'Anahaw Amphitheater, Buhanginan Hills', 
 '2026-10-30', 
 '18:00:00', 
 0.00, 
 2500, 
 2280, 
 'City Government of Iligan & Viva Iligan', 
 'active'),

(16, 
 'Diyandi Paramotor Show 2026', 
 'The exhilarating Diyandi Paramotor Show 2026! Watch skilled motorized paragliders soar across the morning skies above the city grounds and Buhanginan Hills, performing synchronized formation passes, colorful smoke trails, and aerial salutes in celebration of the Diyandi Festival.', 
 'images/diyandi_paramotor_show.jpg', 
 'Sports', 
 'Poblacion', 
 'Iligan City Sports Complex Grounds & City Plaza', 
 '2026-11-09', 
 '07:00:00', 
 0.00, 
 600, 
 560, 
 'City Government of Iligan & Mindanao Aviation Club', 
 'active'),

(17, 
 'Diyandi Festival 2026: Tri-People Cultural Gala & Heritage Exhibition', 
 'Celebrating the harmonious unity of Iligan City\'s Tri-People—the Christian settlers, Higaonon indigenous peoples, and Maranao Muslim communities—under the official festival theme "One Culture. One Heritage. One Celebration." Featuring live traditional kulintang and agung music, native craft demonstrations, and cultural dance rituals.', 
 'images/diyandi_one_culture_badge.jpg', 
 'Festival', 
 'Pala-o', 
 'Anahaw Amphitheater, Buhanginan Hills', 
 '2026-11-16', 
 '15:00:00', 
 0.00, 
 1200, 
 1100, 
 'Iligan City Tourism & Cultural Office', 
 'active')
ON DUPLICATE KEY UPDATE 
 `title` = VALUES(`title`),
 `description` = VALUES(`description`),
 `image_url` = VALUES(`image_url`),
 `category` = VALUES(`category`),
 `barangay` = VALUES(`barangay`),
 `venue_name` = VALUES(`venue_name`),
 `event_date` = VALUES(`event_date`),
 `event_time` = VALUES(`event_time`),
 `price` = VALUES(`price`),
 `total_slots` = VALUES(`total_slots`),
 `available_slots` = VALUES(`available_slots`),
 `organizer_name` = VALUES(`organizer_name`);

INSERT INTO `bookings` 
(`booking_reference`, `event_id`, `attendee_name`, `attendee_email`, `attendee_phone`, `tickets_count`, `status`, `booked_at`)
VALUES
('ILG-2026-8F42', 1, 'Juan dela Cruz', 'juan.delacruz@yahoo.com', '09189876543', 1, 'confirmed', NOW() - INTERVAL 2 HOUR)
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);

CREATE TABLE IF NOT EXISTS `site_settings` (
    `setting_key` VARCHAR(64) PRIMARY KEY,
    `setting_value` TEXT NOT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT INTO `site_settings` (`setting_key`, `setting_value`) VALUES
('hero_banner_image', 'images/diyandi_festival_panoramic_header.png'),
('hero_bg_image', 'https://upload.wikimedia.org/wikipedia/commons/0/05/Maria_Cristina_Falls.jpg'),
('hero_title', 'Experience the Heart & Spirit of Iligan City'),
('hero_subtitle', 'Your official, interactive community gateway to cultural celebrations, eco-adventures at world-renowned waterfalls, youth sports galas, and free public health services across Iligan.')
ON DUPLICATE KEY UPDATE `setting_value` = VALUES(`setting_value`);

USE iligan_events_db;
CREATE TABLE IF NOT EXISTS inquiries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    topic VARCHAR(100) NOT NULL,
    barangay VARCHAR(100) NOT NULL DEFAULT '',
    message TEXT NOT NULL,
    status ENUM('new', 'resolved') NOT NULL DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Complete the location and search-tag tables on existing installations.
-- Source: https://psa.gov.ph/classification/psgc/barangays/1030900000
-- Pala-o is the portal display spelling of PSA Palao.
USE iligan_events_db;
CREATE TABLE IF NOT EXISTS barangays (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL UNIQUE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE TABLE IF NOT EXISTS hero_tags (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(100) NOT NULL UNIQUE) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
INSERT IGNORE INTO barangays (name) VALUES
('Abuno'),
('Bonbonon'),
('Bunawan'),
('Buru-un'),
('Dalipuga'),
('Digkilaan'),
('Hinaplanon'),
('Kabacsanan'),
('Kiwalan'),
('Mahayahay'),
('Mainit'),
('Mandulog'),
('Maria Cristina'),
('Pala-o'),
('Poblacion'),
('Puga-an'),
('Rogongon'),
('Santa Elena'),
('Santa Filomena'),
('Suarez'),
('Tambacan'),
('Saray'),
('Tipanoy'),
('Tomas L. Cabili'),
('Upper Tominobo'),
('Tubod'),
('Bagong Silang'),
('Del Carmen'),
('Dulag'),
('San Miguel'),
('Santiago'),
('Santo Rosario'),
('Tibanga'),
('Acmac-Mariano Badelles Sr.'),
('Ditucalan'),
('Hindang'),
('Kalilangan'),
('Lanipao'),
('Luinab'),
('Panoroganan'),
('San Roque'),
('Ubaldo Laya'),
('Upper Hinaplanon'),
('Villa Verde');
INSERT IGNORE INTO hero_tags (name) VALUES ('Poblacion'),('Tubod'),('Pala-o'),('Buru-un'),('Ditucalan'),('Maria Cristina');
INSERT IGNORE INTO users (name,email,role,password) VALUES ('Portal Administrator','admin@iligancity.gov.ph','admin','password123');

-- Assign events to their designated sector coordinators for open promotion and access protection
UPDATE events SET coordinator_id=(SELECT id FROM users WHERE email='tourism@iligancity.gov.ph' LIMIT 1) WHERE id IN (1, 12, 13, 14, 21, 23, 27);
UPDATE events SET coordinator_id=(SELECT id FROM users WHERE email='ecotourism@iligancity.gov.ph' LIMIT 1) WHERE id IN (2, 6, 8, 28, 106);
UPDATE events SET coordinator_id=(SELECT id FROM users WHERE email='affairs@iligancity.gov.ph' LIMIT 1) WHERE id IN (3, 24);
UPDATE events SET coordinator_id=(SELECT id FROM users WHERE email='sports@iligancity.gov.ph' LIMIT 1) WHERE id IN (4, 16);
UPDATE events SET coordinator_id=(SELECT id FROM users WHERE email='arts.guild@iligancity.gov.ph' LIMIT 1) WHERE id IN (5, 10, 11, 15, 17, 25, 101, 102, 103, 105);
UPDATE events SET coordinator_id=(SELECT id FROM users WHERE email='santiago.tourism@iligancity.gov.ph' LIMIT 1) WHERE id IN (7, 26, 104);
UPDATE events SET coordinator_id=(SELECT id FROM users WHERE email='tourism@iligancity.gov.ph' LIMIT 1) WHERE coordinator_id IS NULL;

-- Add separate classroom coordinator accounts and clearly marked sample listings.
-- Existing accounts, passwords, listings, ownership, and bookings are preserved.
USE iligan_events_db;
START TRANSACTION;
INSERT IGNORE INTO users (name,email,role,password) VALUES ('Pala-o Community Events','palao.coordinator@example.test','organizer','$2y$10$uhtdUhhwjRlqrd6QFRL.iuVfC/r7nxSJrFzcAuatvm2wx9qdv086W');
INSERT INTO events (title,description,image_url,category,barangay,venue_name,event_date,event_time,price,total_slots,available_slots,organizer_name,coordinator_id,is_featured,status)
SELECT 'Pala-o Community Makers Day','Sample event for the student portal, published by Pala-o Community Events. This demonstration listing is not an official event announcement.','images/anahaw_amphitheater.webp','Community','Pala-o','Pala-o community activity area','2026-11-21','09:00:00',0,80,80,u.name,u.id,0,'active' FROM users u WHERE u.email='palao.coordinator@example.test' AND u.role='organizer' AND NOT EXISTS (SELECT 1 FROM events e WHERE e.coordinator_id=u.id AND e.title='Pala-o Community Makers Day');
INSERT IGNORE INTO users (name,email,role,password) VALUES ('Buru-un Eco Activities','buruun.coordinator@example.test','organizer','$2y$10$uhtdUhhwjRlqrd6QFRL.iuVfC/r7nxSJrFzcAuatvm2wx9qdv086W');
INSERT INTO events (title,description,image_url,category,barangay,venue_name,event_date,event_time,price,total_slots,available_slots,organizer_name,coordinator_id,is_featured,status)
SELECT 'Buru-un Community Nature Gathering','Sample event for the student portal, published by Buru-un Eco Activities. This demonstration listing is not an official event announcement.','images/anahaw_amphitheater.webp','Eco-Tourism','Buru-un','Buru-un community meeting area','2026-11-22','07:00:00',0,60,60,u.name,u.id,0,'active' FROM users u WHERE u.email='buruun.coordinator@example.test' AND u.role='organizer' AND NOT EXISTS (SELECT 1 FROM events e WHERE e.coordinator_id=u.id AND e.title='Buru-un Community Nature Gathering');
INSERT IGNORE INTO users (name,email,role,password) VALUES ('Iligan Arts Collective','arts.coordinator@example.test','organizer','$2y$10$uhtdUhhwjRlqrd6QFRL.iuVfC/r7nxSJrFzcAuatvm2wx9qdv086W');
INSERT INTO events (title,description,image_url,category,barangay,venue_name,event_date,event_time,price,total_slots,available_slots,organizer_name,coordinator_id,is_featured,status)
SELECT 'Iligan Community Arts Showcase','Sample event for the student portal, published by Iligan Arts Collective. This demonstration listing is not an official event announcement.','images/harana_sessions.webp','Arts & Culture','Poblacion','Poblacion community activity area','2026-11-28','15:00:00',0,100,100,u.name,u.id,0,'active' FROM users u WHERE u.email='arts.coordinator@example.test' AND u.role='organizer' AND NOT EXISTS (SELECT 1 FROM events e WHERE e.coordinator_id=u.id AND e.title='Iligan Community Arts Showcase');
COMMIT;
