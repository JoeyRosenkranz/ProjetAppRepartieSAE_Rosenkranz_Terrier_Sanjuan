package rmi;

import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

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
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
