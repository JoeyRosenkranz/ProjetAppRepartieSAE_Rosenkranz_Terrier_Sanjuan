package proxy;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import rmi.RegistryService;
import rmi.RestaurantService;

import java.io.OutputStream;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

public class ProxyServer {
    public static void main(String[] args) throws Exception {
        String ipAddress = args.length > 0 ? args[0] : InetAddress.getLocalHost().getHostAddress();

        // Connexion au service RMI
        RestaurantService rmiService = (RestaurantService) RegistryService.getService("RestaurantService", ipAddress, 1099);

        // Serveur HTTP local
        HttpServer server = HttpServer.create(new InetSocketAddress(8000), 0);

        // Endpoint GET /restaurants
        server.createContext("/restaurants", exchange -> {
            System.out.println("Requête reçue : /restaurants");

            if ("GET".equals(exchange.getRequestMethod())) {
                try {
                    String json = rmiService.getAllRestaurants();
                    System.out.println("Données JSON : " + json);
                    sendJsonResponse(exchange, json);
                } catch (Exception e) {
                    e.printStackTrace();
                    sendError(exchange, 500);
                }
            } else {
                sendError(exchange, 405);
            }
        });

        // Endpoint POST /reservation
        server.createContext("/reservation", exchange -> {
            if ("POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                try (var is = exchange.getRequestBody()) {
                    var body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                    String nom = "", prenom = "", tel = "";
                    int nb = 0, id = 0;
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
                    if (nom.isBlank() || prenom.isBlank() || id == 0 || nb <= 0 || tel.isBlank()) {
                        sendError(exchange, 400);
                        return;
                    }
                    String json = rmiService.reserverTable(nom, prenom, nb, tel, id);
                    sendJsonResponse(exchange, json);
                } catch (Exception e) {
                    e.printStackTrace();
                    sendError(exchange, 500);
                }
            } else {
                sendError(exchange, 405);
            }
        });

        server.createContext("/incidents", exchange -> {
            if ("GET".equals(exchange.getRequestMethod())) {
                try (HttpClient client = HttpClient.newHttpClient()) {
                    HttpRequest request = HttpRequest.newBuilder()
                            .uri(java.net.URI.create("https://carto.g-ny.org/data/cifs/cifs_waze_v2.json"))
                            .build();
                    HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
                    String json = response.body();
                    sendJsonResponse(exchange, json);
                } catch (Exception e) {
                    e.printStackTrace();
                    sendError(exchange, 500);
                }
            } else {
                sendError(exchange, 405);
            }
        });


        server.setExecutor(null); // Utilise l'exécuteur par défaut (thread pool)
        server.start();
        System.out.println("Serveur proxy HTTP démarré sur http://" + InetAddress.getLocalHost().getHostAddress() + ":8000");
    }

    private static void sendJsonResponse(com.sun.net.httpserver.HttpExchange exchange, String json) throws java.io.IOException {
        exchange.getResponseHeaders().add("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        byte[] responseBytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(200, responseBytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(responseBytes);
        }
    }

    private static void sendError(HttpExchange exchange, int code) {
        try {
            exchange.sendResponseHeaders(code, -1);
        } catch (Exception ignored) {
        }
    }
}
