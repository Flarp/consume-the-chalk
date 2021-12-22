CREATE DATABASE IF NOT EXISTS chalk;
USE chalk;

CREATE TABLE IF NOT EXISTS chalkboards (
  id INT NOT NULL PRIMARY KEY,
  building ENUM(@BUILDINGS@), -- BUILDINGS will be replaced by scraping program
  room CHAR(4) NOT NULL,
  panels TINYINT NOT NULL,
  width ENUM("normal", "wide", "extra wide") NOT NULL,
  color ENUM("black", "green", "brown") NOT NULL
);

CREATE TABLE IF NOT EXISTS occupancies (
  id INT NOT NULL PRIMARY KEY,
  building ENUM(@BUILDINGS@),
  room CHAR(4) NOT NULL,
  days TINYINT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
);
