package rmi;

import java.net.InetAddress;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

public class RmiServer {
    public static void main(String[] args) {
        try {
            // 👇 Force RMI à utiliser localhost (en mode développement)
            String ip = InetAddress.getLocalHost().getHostAddress();
            System.setProperty("java.rmi.server.hostname", ip);

            RestaurantService service = new RestaurantServiceImpl();
            ExportService.exportObject(service, "localhost", "RestaurantService", 0, 1099);
            System.out.println("Serveur RMI lancé sur " + ip + ":1099");
            // En attente de requêtes... (Ctrl+C pour arrêter le serveur)
            Thread.sleep(Long.MAX_VALUE); // Bloque le thread principal pour que le serveur reste actif

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
