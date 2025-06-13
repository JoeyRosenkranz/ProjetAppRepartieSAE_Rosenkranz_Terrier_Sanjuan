package rmi;

import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

public class RmiServer {
    public static void main(String[] args) {
        try {
            // 👇 Force RMI à utiliser localhost (en mode développement)
            System.setProperty("java.rmi.server.hostname", "127.0.0.1");

            RestaurantService service = new RestaurantServiceImpl();
            ExportService.exportObject(service, "localhost", "RestaurantService", 0, 1099);
            System.out.println("Serveur RMI lancé.");
            // En attente de requêtes... (Ctrl+C pour arrêter le serveur)
            System.out.println("Le serveur RMI est prêt à recevoir des requêtes.");
            // Boucle infinie pour maintenir le serveur actif
            while (System.in.read() != 'q') {
                Thread.sleep(1000); // Le serveur reste actif
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
