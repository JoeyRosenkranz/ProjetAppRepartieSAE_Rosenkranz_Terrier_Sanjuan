package rmi;

import java.rmi.AccessException;
import java.rmi.ConnectException;
import java.rmi.ConnectIOException;
import java.rmi.MarshalException;
import java.rmi.NoSuchObjectException;
import java.rmi.NotBoundException;
import java.rmi.Remote;
import java.rmi.RemoteException;
import java.rmi.UnknownHostException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

public class RegistryService {
    public static Remote getService(String serviceName, String ip, int port) throws RegistryServiceException {
        if (ip == null || ip.isEmpty()) {
            ip = "localhost";
        }

        Registry registry = null;
        try {
            registry = LocateRegistry.getRegistry(ip, port);

            // Liste les services disponibles
            String[] services = registry.list();
            System.out.println("Services disponibles : ");
            for (String service : services) {
                System.out.println("\t" + service);
            }
        } catch (UnknownHostException e) {
            throw new RegistryServiceException("Hôte inconnu: " + ip, e);
        } catch (ConnectException e) {
            throw new RegistryServiceException("Connexion refusée par l'hôte: " + ip, e);
        } catch (SecurityException e) {
            throw new RegistryServiceException("Erreur de sécurité lors de la connexion au registre RMI", e);
        } catch (AccessException e) {
            throw new RegistryServiceException("Erreur d'accès au registre RMI", e);
        } catch (RemoteException e) {
            throw new RegistryServiceException("Erreur de connexion au registre RMI", e);
        }

        // Récupérer le service
        Remote service = null;
        try {
            service = registry.lookup(serviceName);
        } catch (ConnectIOException e) {
            throw new RegistryServiceException("Erreur de connexion vers l'hôte: " + ip, e);
        } catch (MarshalException e) {
            throw new RegistryServiceException("Erreur de désérialisation des données : " + e.getMessage(), e);
        } catch (NoSuchObjectException e) {
            throw new RegistryServiceException("Objet non trouvé dans le registre RMI", e);
        } catch (AccessException e) {
            throw new RegistryServiceException("Erreur d'accès au registre RMI pour récupérer le service", e);
        } catch (RemoteException e) {
            throw new RegistryServiceException("Erreur de connexion au registre RMI pour récupérer le service", e);
        } catch (NotBoundException e) {
            throw new RegistryServiceException("Service non trouvé, essayer un autre nom ou vérifier le registre RMI",
                    e);
        }

        if (service == null) {
            throw new RegistryServiceException("Service non trouvé dans le registre RMI", null);
        }

        // Retourner le service
        return service;
    }
}
