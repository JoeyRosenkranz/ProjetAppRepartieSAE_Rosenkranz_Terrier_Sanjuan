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

3. Pour l'utiliser sur IntelliJ :
    - Ouvrir IntelliJ IDEA.
    - Aller dans `View` > `Tool Windows` > `Database`.
    - Cliquer sur le `+` pour ajouter une nouvelle connexion.
    - Sélectionner `Data Source` > `MySQL`.
    - Entrer les informations de connexion :
        - Host: `localhost`
        - Port: `3306`
        - User: `root`
        - Password: `ton_mot_de_passe` (remplacer par le mot de passe choisi à la création de l'utilisateur root).
    - Cliquer sur `Test Connection` pour vérifier la connexion.
    - Si tout est correct, cliquer sur `OK` pour enregistrer la connexion.

   Normalement, la base de données devrait apparaître dans la fenêtre `Database` d'IntelliJ et vous pourrez interagir
   avec elle.
   