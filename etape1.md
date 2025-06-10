# Étape 1 : Base de données

1. Installer MySQL sur linux avec wsl avec la commande :
   ```bash
    sudo apt update
    sudo apt install mysql-server
    sudo service mysql start
   ```
   
    Créer un utilisateur root pour MySQL avec un mot de passe :
    ```bash
    sudo mysql
    ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'ton_mot_de_passe';
    FLUSH PRIVILEGES;
    ```
   
2. Créer une base de données pour l'application (utiliser WSL) :
    ```bash
    sudo mysql -u root -p
    ```
    Créer la table 'restaurants' et ajouter des données (voir le fichier `restaurants.sql` dans le dossier `data` du 
   projet).
   