package rmi;

import java.rmi.Remote;
import java.rmi.RemoteException;

public interface RestaurantService extends Remote {
    String registerService() throws RemoteException;

    String getAllRestaurants() throws RemoteException;

    String reserverTable(String nom, String prenom, int nb, String telephone, int idResto) throws RemoteException;
}
