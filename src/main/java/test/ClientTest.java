package test;
import rmi.RestaurantService;

import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

public class ClientTest {
    public static void main(String[] args) {
        try {
            Registry registry = LocateRegistry.getRegistry("localhost", 1099);
            RestaurantService service = (RestaurantService) registry.lookup("RestaurantService");

            System.out.println("Restaurants :");
            System.out.println(service.getAllRestaurants());

            System.out.println("Réservation...");
            String res = service.registerService();
            System.out.println(res);

        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
