CREATE TABLE restaurants
(
    id      INT AUTO_INCREMENT PRIMARY KEY,
    nom     VARCHAR(255) NOT NULL,
    adresse VARCHAR(255) NOT NULL,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL
);

INSERT INTO restaurants (nom, adresse, latitude, longitude)
VALUES ('Brasserie Excelsior', '50 Rue Henri Poincaré, 54000 Nancy', 48.69083008385423, 6.1755482103769195),
       ('La Maison dans le Parc', '3 Rue Sainte-Catherine, 54000 Nancy', 48.694368639981285, 6.18530563883366),
       ('Le Bouche à Oreille', '42 Rue des Carmes, 54000 Nancy', 48.69080360657441, 6.180960881162192),
       ('Les Fils à Maman Nancy', '41 Rue des Maréchaux, 54000 Nancy', 48.69403350083779, 6.180402584283876),
       ('Au Coin de la Rue', '19 Pl. du Colonel Fabien, 54000 Nancy', 48.695605655618735, 6.179458446747655);

COMMIT;

SELECT *
FROM restaurants;