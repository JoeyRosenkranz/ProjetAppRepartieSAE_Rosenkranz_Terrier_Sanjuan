CREATE TABLE restaurants
(
    id        NUMBER PRIMARY KEY,
    nom       VARCHAR2(255) NOT NULL,
    adresse   VARCHAR2(255) NOT NULL,
    latitude  NUMBER(9, 6)  NOT NULL,
    longitude NUMBER(9, 6)  NOT NULL
);

CREATE SEQUENCE seq_restaurants START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER trg_restaurants
    BEFORE INSERT
    ON restaurants
    FOR EACH ROW
BEGIN
    :NEW.id := seq_restaurants.NEXTVAL;
END;
/

INSERT INTO restaurants (nom, adresse, latitude, longitude)
VALUES ('Brasserie Excelsior', '50 Rue Henri Poincaré, 54000 Nancy', 48.690830, 6.175548);

INSERT INTO restaurants (nom, adresse, latitude, longitude)
VALUES ('La Maison dans le Parc', '3 Rue Sainte-Catherine, 54000 Nancy', 48.694369, 6.185306);

INSERT INTO restaurants (nom, adresse, latitude, longitude)
VALUES ('Le Bouche à Oreille', '42 Rue des Carmes, 54000 Nancy', 48.690804, 6.180961);

INSERT INTO restaurants (nom, adresse, latitude, longitude)
VALUES ('Les Fils à Maman Nancy', '41 Rue des Maréchaux, 54000 Nancy', 48.694034, 6.180403);

INSERT INTO restaurants (nom, adresse, latitude, longitude)
VALUES ('Au Coin de la Rue', '19 Pl. du Colonel Fabien, 54000 Nancy', 48.695606, 6.179458);

COMMIT;

CREATE TABLE reservations (
                              id            NUMBER PRIMARY KEY,
                              nom           VARCHAR2(100),
                              prenom        VARCHAR2(100),
                              nb_personnes  NUMBER,
                              telephone     VARCHAR2(20),
                              id_restaurant NUMBER,
                              FOREIGN KEY (id_restaurant) REFERENCES restaurants(id)
);

CREATE SEQUENCE seq_reservations START WITH 1 INCREMENT BY 1;

CREATE OR REPLACE TRIGGER trg_reservations
    BEFORE INSERT ON reservations
    FOR EACH ROW
BEGIN
    :NEW.id := seq_reservations.NEXTVAL;
END;
/

COMMIT;
