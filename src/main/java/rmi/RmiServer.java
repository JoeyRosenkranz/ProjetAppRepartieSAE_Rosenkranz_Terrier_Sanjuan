package rmi;

import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import main.java.rmi.RestaurantServiceImpl;

public class RmiServer {
    public static void main(String[] args) {
        try {
            // 👇 Force RMI à utiliser localhost (en mode développement)
            System.setProperty("java.rmi.server.hostname", "127.0.0.1");

            RestaurantService service = new RestaurantServiceImpl();
            Registry registry = LocateRegistry.getRegistry();
            if (registry == null) {
                System.out.println("Aucun registre RMI trouvé");
                return;
            }
            registry.rebind("RestaurantService", service);
            System.out.println("Serveur RMI lancé.");
            // En attente de requêtes... (Ctrl+C pour arrêter le serveur)
            System.out.println("Le serveur RMI est prêt à recevoir des requêtes.");
            while (true) {
                Thread.sleep(1000); // Le serveur reste actif
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
