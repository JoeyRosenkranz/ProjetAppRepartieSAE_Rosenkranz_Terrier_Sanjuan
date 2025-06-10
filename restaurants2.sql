# Script pour la 2ème partie du TP
CREATE TABLE reservations
(
    id            INT AUTO_INCREMENT PRIMARY KEY,
    nom           VARCHAR(100),
    prenom        VARCHAR(100),
    nb_personnes  INT,
    telephone     VARCHAR(20),
    id_restaurant INT,
    FOREIGN KEY (id_restaurant) REFERENCES restaurants (id)
);
