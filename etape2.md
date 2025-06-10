# Étape 2

1. Voici l'arborescence du projet, qui reprend la structure de base d'un projet Java sous Maven avec RMI :
   ```
   ├── src/
   │   ├── main/
   │   │   └── java/
   │   │       └── rmi/
   │   │           ├── Restaurant.java (modèle de données)
   │   │           ├── RestaurantService.java (interface RMI)
   │   │           ├── RestaurantServiceImpl.java (implémentation du service RMI)
   │   │           └── RmiServer.java (serveur RMI)
   │   └── test/
   │       └── ClientTest.java (test du client RMI)
   ```

2. Créer un fichier .env à la racine du projet avec le contenu suivant :
   ```
   DB_URL=jdbc:mysql://localhost:3306/resto_nancy
   DB_USER=root
   DB_PASSWORD=ton_mot_de_passe
   ```

3. Télécharger `Maven` depuis le site officiel (https://maven.apache.org/download.cgi) et l'installer (si bug ou
   erreur ou autre problème, regarder la fin de ce fichier) :
    - Décompresser l'archive téléchargée.
    - Ajouter le chemin de Maven à la variable d'environnement `PATH` :
      ```bash
      export PATH=$PATH:/chemin/vers/maven/bin
      ```
    - Vérifier l'installation avec :
      ```bash
      mvn -v
      ```

4. Exécuter restaurants2.sql pour ajouter la table `reservations` :
    - Ouvrir le fichier `restaurants2.sql` dans IntelliJ IDEA.
    - Sélectionner tout le contenu du fichier.
    - Cliquer droit et choisir `Execute Selection` ou utiliser le raccourci `Ctrl + Enter` pour exécuter les commandes
      SQL.

5. Si rmiregistry peut être lancé sans problème, passez à l'étape suivante.
   Sinon, ajoutez à votre `PATH` le chemin vers `rmiregistry` :
   ```bash
    export PATH=$PATH:/chemin/vers/jdk/bin
    ```

6. Lancer `rmiregistry` dans un terminal depuis le répertoire `target/classes` de votre projet (car c'est là que se
   trouvent les classes compilées avec Maven) :
   ```bash
   rmiregistry 1099
   ```
   Assurez-vous que le port 1099 est ouvert et accessible.
7. Lancer le serveur RMI :
    - Ouvrir un terminal dans le répertoire racine de votre projet.
    - Exécuter la commande suivante pour compiler et lancer le serveur :
      ```bash
      mvn exec:java
      ```

Si tout est correctement configuré, le serveur RMI devrait démarrer et être prêt à accepter les connexions des clients.

Si vous ne voulez pas utiliser Maven, vous pouvez compiler et exécuter le projet manuellement.
Ensuite lancer ClientTest.java pour tester le client :
   - Ouvrir un terminal dans le répertoire `src/test/java`.
   - Compiler le fichier :
     ```bash
     javac ClientTest.java
     ```
   - Exécuter le client :
     ```bash
     java ClientTest
     ```
