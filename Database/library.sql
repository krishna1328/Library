CREATE DATABASE library_management;
USE library_management;

Table1: Users

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role ENUM('admin','student') DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

Default Users

INSERT INTO
    users (
        name,
        email,
        password,
        phone,
        role
    )
VALUES (
        'Admin',
        'admin@gmail.com',
        'admin123',
        '9999999999',
        'admin'
    );

Table2 : categories

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL
);

Sample Categories

INSERT INTO
    categories (category_name)
VALUES ('Programming'),
    ('Database'),
    ('Novel'),
    ('Science'),
    ('History'),
    ('Business'),
    ('Biography');


Table 3: Books

CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(150) NOT NULL,
    isbn VARCHAR(20) UNIQUE,
    category_id INT,
    publisher VARCHAR(100),
    publish_year YEAR,
    quantity INT NOT NULL,
    available_quantity INT NOT NULL,
    description TEXT,
    book_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(category_id)
    REFERENCES categories(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

SampleBooks

INSERT INTO
    books (
        title,
        author,
        isbn,
        category_id,
        publisher,
        publish_year,
        quantity,
        available_quantity
    )
VALUES (
        'Java Programming',
        'Herbert Schildt',
        '9781234567891',
        1,
        'McGraw Hill',
        2022,
        20,
        20
    ),
    (
        'Learning MySQL',
        'Paul DuBois',
        '9781234567892',
        2,
        'OReilly',
        2023,
        15,
        15
    );


Table 4: Issued Books

CREATE TABLE issued_books (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    book_id INT NOT NULL,

    issue_date DATE NOT NULL,

    due_date DATE NOT NULL,

    return_date DATE DEFAULT NULL,

    status ENUM('Issued','Returned','Late')
    DEFAULT 'Issued',

    FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

    FOREIGN KEY(book_id)
    REFERENCES books(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

ALTER TABLE issued_books
ADD fine DECIMAL(10,2) DEFAULT 0;

DESCRIBE issued_books;