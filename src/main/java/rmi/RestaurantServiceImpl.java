package rmi;

import java.rmi.RemoteException;
import java.sql.*;
import org.json.JSONArray;
import org.json.JSONObject;
import io.github.cdimascio.dotenv.Dotenv;

public class RestaurantServiceImpl implements RestaurantService {
    private final Connection connection;

    protected RestaurantServiceImpl() throws RemoteException {
        super();
        try {
            Dotenv dotenv = Dotenv.load();
            String url = dotenv.get("DB_URL");
            String user = dotenv.get("DB_USER");
            String password = dotenv.get("DB_PASSWORD");
            if (url == null || user == null || password == null) {
                throw new RemoteException("Database environment variables not set");
            }
            connection = DriverManager.getConnection(url, user, password);
        } catch (SQLException e) {
            throw new RemoteException("Erreur connexion BDD", e);
        }
    }

    public String registerService() {
        return "Service enregistré avec succès.";
    }

    public String getAllRestaurants() throws RemoteException {
        JSONArray array = new JSONArray();
        try (Statement stmt = connection.createStatement()) {
            System.out.println("Exécution de la requête pour récupérer les restaurants...");
            ResultSet rs = stmt.executeQuery("SELECT * FROM restaurants");
            while (rs.next()) {
                JSONObject obj = new JSONObject();
                obj.put("id", rs.getInt("id"));
                obj.put("nom", rs.getString("nom"));
                obj.put("adresse", rs.getString("adresse"));
                obj.put("latitude", rs.getDouble("latitude"));
                obj.put("longitude", rs.getDouble("longitude"));
                array.put(obj);
            }
        } catch (SQLException e) {
            throw new RemoteException("Erreur récupération restaurants", e);
        }
        return array.toString();
    }

    public String reserverTable(String nom, String prenom, int nb, String telephone, int idResto) throws RemoteException {
        try (PreparedStatement stmt = connection.prepareStatement(
            "INSERT INTO reservations (nom, prenom, nb_personnes, telephone, id_restaurant) VALUES (?, ?, ?, ?, ?)"
        )) {
            stmt.setString(1, nom);
            stmt.setString(2, prenom);
            stmt.setInt(3, nb);
            stmt.setString(4, telephone);
            stmt.setInt(5, idResto);
            stmt.executeUpdate();

            System.out.println("Réservation enregistrée : " + nom + " " + prenom + ", " + nb + " personnes, téléphone: " + telephone + ", restaurant ID: " + idResto);
            return new JSONObject().put("status", "ok").put("message", "Réservation enregistrée.").toString();
        } catch (SQLException e) {
            return new JSONObject().put("status", "error").put("message", e.getMessage()).toString();
        }
    }
}
