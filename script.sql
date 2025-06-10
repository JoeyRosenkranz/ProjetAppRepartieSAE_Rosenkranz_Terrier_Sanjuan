DROP TABLE IF EXISTS affecter;
DROP TABLE IF EXISTS commande;
DROP TABLE IF EXISTS reservation;
DROP TABLE IF EXISTS serveur;
DROP TABLE IF EXISTS plat;
DROP TABLE IF EXISTS tabl;
-- Table tabl

CREATE TABLE tabl (
                      numtab INT(4),
                      nbplace INT(2),
                      PRIMARY KEY(numtab)
);

-- Tuples de Tabl
INSERT INTO tabl VALUES (10,4);
INSERT INTO tabl VALUES (11,6);
INSERT INTO tabl VALUES (12,8);
INSERT INTO tabl VALUES (13,4);
INSERT INTO tabl VALUES (14,6);
INSERT INTO tabl VALUES (15,4);
INSERT INTO tabl VALUES (16,4);
INSERT INTO tabl VALUES (17,6);
INSERT INTO tabl VALUES (18,2);
INSERT INTO tabl VALUES (19,4);

-- Table plat

CREATE TABLE plat (
                      numplat INT(4),
                      libelle VARCHAR(40),
                      type VARCHAR(15),
                      prixunit DECIMAL(6,2),
                      qteservie INT(2),
                      PRIMARY KEY (numplat)
);

-- Tuples de Plat
INSERT INTO plat VALUES (1,'assiette de crudites','Entree',90,25);
INSERT INTO plat VALUES (2,'tarte de saison','Dessert',90,25);
INSERT INTO plat VALUES (3,'sorbet mirabelle','Dessert',90,35);
INSERT INTO plat VALUES (4,'filet de boeuf','Viande',90,62);
INSERT INTO plat VALUES (5,'salade verte','Entree',90,15);
INSERT INTO plat VALUES (6,'chevre chaud','Entree',90,21);
INSERT INTO plat VALUES (7,'pate lorrain','Entree',90,25);
INSERT INTO plat VALUES (8,'saumon fume','Entree',90,30);
INSERT INTO plat VALUES (9,'entrecote printaniere','Viande',90,58);
INSERT INTO plat VALUES (10,'gratin dauphinois','Plat',90,42);
INSERT INTO plat VALUES (11,"brochet a l'oseille",'Poisson',90,68);
INSERT INTO plat VALUES (12,"gigot d'agneau",'Viande',90,56);
INSERT INTO plat VALUES (13,'creme caramel','Dessert',90,15);
INSERT INTO plat VALUES (14,'munster au cumin','Fromage',90,18);
INSERT INTO plat VALUES (15,'filet de sole au beurre','Poisson',90,70);
INSERT INTO plat VALUES (16,'foie gras de lorraine','Entree',90,61);

-- Table Serveur

CREATE TABLE serveur (
                         numserv INT(2),
                         email VARCHAR(255),
                         passwd VARCHAR(255),
                         nomserv VARCHAR(25),
                         grade VARCHAR(20),
                         PRIMARY KEY(numserv)
);

-- Tuples de Serveur
INSERT INTO serveur VALUES (1,'user1@mail.com','$#;mm$$$$$0','Tutus Peter','gestionnaire');
INSERT INTO serveur VALUES (2,'user2@mail.com','$xy#;mm$$$$$1','Lilo Vito','serveur');
INSERT INTO serveur VALUES (3,'user3@mail.com','$ab#;mm$$$$$2','Don Carl','serveur');
INSERT INTO serveur VALUES (4,'user4@mail.com','$cd#;mm$$$$$3','Leo Jon','serveur');
INSERT INTO serveur VALUES (5,'user5@mail.com','$mm#;mm$$$$$4','Dean Geak','gestionnaire');

-- Table reservation

CREATE TABLE reservation (
                             numres INT(4),
                             numtab INT(4),
                             datres DATETIME,
                             nbpers INT(2),
                             datpaie DATETIME,
                             modpaie VARCHAR(15),
                             montcom DECIMAL(8,2),
                             PRIMARY KEY (numres),
                             FOREIGN KEY (numtab) REFERENCES tabl(numtab)
);

-- Tuples de reservation
INSERT INTO reservation VALUES (100,10,'2021-09-10 19:00',2,'2021-09-10 20:50','Carte',NULL);
INSERT INTO reservation VALUES (101,11,'2021-09-10 20:00',4,'2021-09-10 21:20','Cheque',NULL);
INSERT INTO reservation VALUES (102,17,'2021-09-10 18:00',2,'2021-09-10 20:55','Carte',NULL);
INSERT INTO reservation VALUES (103,12,'2021-09-10 19:00',2,'2021-09-10 21:10','Especes',NULL);
INSERT INTO reservation VALUES (104,18,'2021-09-10 19:00',1,'2021-09-10 21:00','Cheque',NULL);
INSERT INTO reservation VALUES (105,10,'2021-09-10 19:00',2,'2021-09-10 20:45','Carte',NULL);
INSERT INTO reservation VALUES (106,14,'2021-10-11 19:00',2,'2021-10-11 22:45','Carte',NULL);

-- Table commande

CREATE TABLE commande (
                          numres INT(4),
                          numplat INT(4),
                          quantite INT(2),
                          PRIMARY KEY(numres,numplat),
                          FOREIGN KEY (numres) REFERENCES reservation(numres),
                          FOREIGN KEY (numplat) REFERENCES plat(numplat)
);

-- Table affecter

CREATE TABLE affecter (
                          numtab INT(4),
                          dataff DATE,
                          numserv INT(2),
                          PRIMARY KEY(numtab,dataff),
                          FOREIGN KEY (numserv) REFERENCES serveur(numserv)
);