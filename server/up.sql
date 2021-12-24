--CREATE DATABASE IF NOT EXISTS chalk;
--USE chalk;

CREATE TYPE buildings as ENUM(@BUILDINGS@);
CREATE TYPE widths as ENUM('normal', 'wide', 'extra wide');
CREATE TYPE colors as ENUM('black', 'green', 'brown');

CREATE TABLE chalkboards (
  id SERIAL NOT NULL PRIMARY KEY,
  building buildings NOT NULL, -- BUILDINGS will be replaced by scraping program
  room CHAR(4) NOT NULL,
  panels SMALLINT NOT NULL,
  width widths NOT NULL,
  color colors NOT NULL
);

CREATE TABLE IF NOT EXISTS occupancies (
  id INT NOT NULL PRIMARY KEY,
  building buildings NOT NULL,
  room CHAR(4) NOT NULL,
  days SMALLINT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL
);
