package service;

import java.net.InetSocketAddress;
import java.net.ProxySelector;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

import com.google.gson.JsonElement;
import com.google.gson.JsonParser;

public class OpenDataService {
    private final HttpClient client;

    public OpenDataService(String proxyHost, int proxyPort) {
        this.client = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .proxy(ProxySelector.of(new InetSocketAddress(proxyHost, proxyPort)))
                .build();
    }

    /** Récupère et parse le JSON d'une URL donnée via proxy. */
    public JsonElement fetchData(String url) throws Exception {
        HttpRequest req = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .timeout(Duration.ofSeconds(10))
                .header("Accept", "application/json")
                .GET()
                .build();

        HttpResponse<String> resp = client.send(req, HttpResponse.BodyHandlers.ofString());
        if (resp.statusCode() != 200) {
            throw new RuntimeException("Erreur HTTP : " + resp.statusCode());
        }
        return JsonParser.parseString(resp.body());
    }
}
