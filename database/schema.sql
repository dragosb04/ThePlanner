CREATE DATABASE IF NOT EXISTS event_planner;

USE event_planner;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  profile_picture VARCHAR(255),
  status TEXT
);

CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  eventDate DATE NOT NULL,
  eventTime TIME NOT NULL,
  location VARCHAR(255),
  details TEXT,
  creator_id INT,
  FOREIGN KEY (creator_id) REFERENCES users(id)
);

CREATE TABLE event_participants (
  event_id INT,
  user_id INT,
  PRIMARY KEY (event_id, user_id),
  FOREIGN KEY (event_id) REFERENCES events(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
