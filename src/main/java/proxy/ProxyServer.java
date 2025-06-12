package proxy;

import com.sun.net.httpserver.HttpServer;
import rmi.RestaurantService;

import java.io.OutputStream;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

public class ProxyServer {
    public static void main(String[] args) throws Exception {
        // Connexion au service RMI
        Registry registry = LocateRegistry.getRegistry(InetAddress.getLocalHost().getHostAddress(), 1099);
        RestaurantService rmiService = (RestaurantService) registry.lookup("RestaurantService");

        // Serveur HTTP local
        HttpServer server = HttpServer.create(new InetSocketAddress(8000), 0);

        // Endpoint GET /restaurants
        server.createContext("/restaurants", exchange -> {
            System.out.println("Requête reçue : /restaurants");

            if ("GET".equals(exchange.getRequestMethod())) {
                try {
                    // Appel du service RMI pour obtenir la liste des restaurants
                    String json = rmiService.getAllRestaurants();
                    System.out.println("Données JSON : " + json);

                    exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
                    // Utilise UTF-8 pour l'encodage des caractères
                    exchange.getResponseHeaders().add("Content-Type", "application/json");
                    byte[] responseBytes = json.getBytes(StandardCharsets.UTF_8);
                    exchange.sendResponseHeaders(200, responseBytes.length);

                    // Flux de sortie pour envoyer la réponse
                    OutputStream os = exchange.getResponseBody();
                    os.write(responseBytes);
                    os.close();
                } catch (Exception e) {
                    e.printStackTrace();
                    exchange.sendResponseHeaders(500, -1);
                }
            } else {
                exchange.sendResponseHeaders(405, -1);
            }
        });


        // Endpoint POST /reservation
        server.createContext("/reservation", exchange -> {
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                try (var is = exchange.getRequestBody()) {
                    // Lire le corps de la requête
                    var body = new String(is.readAllBytes(), StandardCharsets.UTF_8);

                    String nom = "", prenom = "", tel = "";
                    int nb = 0, id = 0;

                    // Analyser les paramètres du corps de la requête
                    for (String p : body.split("&")) {
                        String[] pair = p.split("=", 2);
                        if (pair.length < 2) continue;
                        switch (pair[0]) {
                            case "nom" -> nom = pair[1];
                            case "prenom" -> prenom = pair[1];
                            case "telephone" -> tel = pair[1];
                            case "nb" -> nb = Integer.parseInt(pair[1]);
                            case "idResto" -> id = Integer.parseInt(pair[1]);
                        }
                    }

                    // Appel du service RMI pour réserver une table
                    String json = rmiService.reserverTable(nom, prenom, nb, tel, id);
                    byte[] responseBytes = json.getBytes(StandardCharsets.UTF_8);
                    exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
                    exchange.getResponseHeaders().add("Content-Type", "application/json");
                    exchange.sendResponseHeaders(200, responseBytes.length);

                    // Écrire la réponse dans le flux de sortie
                    try (OutputStream os = exchange.getResponseBody()) {
                        os.write(responseBytes);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                    exchange.sendResponseHeaders(500, -1);
                }
            } else {
                exchange.sendResponseHeaders(405, -1);
            }
        });

        server.setExecutor(null); // Utilise l'exécuteur par défaut (thread pool)
        server.start();
        System.out.println("Serveur proxy HTTP démarré sur http://localhost:8000");
    }
}
