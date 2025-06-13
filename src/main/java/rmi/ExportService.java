package rmi;

import java.rmi.MarshalException;
import java.rmi.NotBoundException;
import java.rmi.Remote;
import java.rmi.RemoteException;
import java.rmi.StubNotFoundException;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;
import java.rmi.server.ExportException;
import java.rmi.server.SkeletonNotFoundException;
import java.rmi.server.UnicastRemoteObject;

public class ExportService {
    public static void exportObject(Remote service, String ip, String nomService, int objectPort, int registryPort) throws NotBoundException {
        try {
            Remote sc = UnicastRemoteObject.exportObject(service, objectPort);
            Registry registry = LocateRegistry.getRegistry(ip, registryPort);
            if (registry == null) {
                System.out.println("Aucun registre RMI trouvé sur " + ip + ":" + registryPort);
                return;
            }
            registry.rebind(nomService, sc);

            System.out.println("Le service " + nomService + " a été exporté avec succès.");
        } catch (StubNotFoundException e) {
            System.out.println("Erreur stub lors de l'export de " + nomService
                    + ".\nIl est possible que ces cas puissent être la cause de l'erreur : ");
            System.out.println("\t1. Le stub ne peut pas être instancié");
            System.out.println("\t2. Le stub n'est pas de la bonne classe");
            System.out.println("\t3. Mauvaise URL en raison d'un codebase incorrect");
            System.out.println("\t4. Le stub n'est pas de la bonne classe");
        } catch (SkeletonNotFoundException e) {
            System.out.println(
                    "Erreur de squelette lors de l'export de soustraction.\nIl est possible que ces cas puissent être la cause de l'erreur : ");
            System.out.println("\t1. Le squelette ne peut pas être instancié");
            System.out.println("\t2. Le squelette n'est pas de la bonne classe");
            System.out.println("\t3. Mauvaise URL en raison d'un codebase incorrect");
            System.out.println("\t4. Le squelette n'est pas de la bonne classe");
        } catch (MarshalException e) {
            System.out.println("Erreur de marshalling lors de l'export de " + nomService
                    + ".\nIl est possible que ces cas puissent être la cause de l'erreur : ");
            System.out.println("\t1. Le service n'est pas serializable");
            System.out.println("\t2. Mauvaise URL en raison d'un codebase incorrect");
            System.out.println("\t3. Le service n'est pas de la bonne classe");
        } catch (ExportException e) {
            System.out.println("Erreur d'exportation du service : le port est déjà utilisé");
        } catch (RemoteException e) {
            System.out.println("Erreur d'exportation du service de " + nomService);
            System.out.println("L'erreur est : " + e.getMessage());
            System.out.println("Vérfier que rmiregistry est lancé sur le port " + registryPort + " et qu'il est lancé dans le même répertoire que le service"); 
        }

    }
}
