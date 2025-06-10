package rmi;

public class Restaurant {
    public int id;
    public String nom;
    public String adresse;
    public double latitude;
    public double longitude;

    public Restaurant(int id, String nom, String adresse, double lat, double lon) {
        this.id = id;
        this.nom = nom;
        this.adresse = adresse;
        this.latitude = lat;
        this.longitude = lon;
    }
}
