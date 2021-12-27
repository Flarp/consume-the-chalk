CREATE TYPE BULDINGS as ENUM(@BUILDINGS@); -- BUILDINGS will be replaced by scraping program
CREATE TYPE WIDTHS as ENUM('normal', 'wide', 'extra wide');
CREATE TYPE COLORS as ENUM('black', 'green', 'brown');

CREATE TABLE chalkboards (
  id SERIAL NOT NULL PRIMARY KEY,
  building BUILDINGS NOT NULL,
  room CHAR(4) NOT NULL,
  panels SMALLINT NOT NULL,
  width WIDTHS NOT NULL,
  color COLORS NOT NULL,
  board_count SMALLINT NOT NULL
);

CREATE TABLE IF NOT EXISTS occupancies (
  id INT NOT NULL PRIMARY KEY,
  building BUILDINGS NOT NULL,
  room CHAR(4) NOT NULL,
  days SMALLINT NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL
);
