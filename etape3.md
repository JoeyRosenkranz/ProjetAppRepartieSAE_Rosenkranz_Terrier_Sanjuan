# Étape 3

1. Ajout d'un proxy pour faire des appels réseau

    - Le fichier `proxy.ProxyServer` est créé pour gérer les appels réseau via un proxy.
    - Le proxy est configuré pour écouter sur le port 8000.
    - Le proxy redirige les requêtes vers le serveur RMI en utilisant l'URL du serveur spécifiée dans le fichier `.env`.

2. Pour lancer le proxy, suivez ces étapes :

    - Ouvrez un terminal dans le répertoire racine de votre projet.
    - Exécutez d'abord (très important) la commande suivante pour exécuter le serveur RMI :
      ```bash
      mvn exec:java "-Dexec.mainClass=rmi.RmiServer"
      ```
    - Ensuite, dans un autre terminal, exécutez la commande suivante pour lancer le proxy :
      ```bash
        mvn exec:java "-Dexec.mainClass=proxy.ProxyServer"
        ```
    - Assurez-vous que le port 8000 est ouvert et accessible.
    - Le proxy devrait maintenant être en cours d'exécution et prêt à rediriger les requêtes vers le serveur RMI.

3. Pour tester le proxy, vous pouvez utiliser un client HTTP comme Postman ou curl pour envoyer des requêtes au proxy sur le port 8000. Par exemple, si vous avez une méthode dans votre serveur RMI qui récupère des données de restaurant, vous pouvez envoyer une requête GET à `http://localhost:8000/restaurants` et vérifier que le proxy redirige correctement la requête vers le serveur RMI.
   ```bash
   curl http://localhost:8000/restaurants
   ```