// incidents.js
// Gère l'affichage des incidents sur la carte

export function afficherIncidents(map, apiBaseUrl) {
    fetch(`${apiBaseUrl}/incidents`)
        .then((res) => res.json())
        .then((data) => {
            data.incidents.forEach((incident) => {
                const [lat, lon] = incident.location.polyline.split(" ").map(Number);
                const lieu = incident.location.location_description || incident.location.street || "Lieu inconnu";
                const description = incident.short_description || "Travaux";
                const debut = incident.starttime?.split("T")[0];
                const fin = incident.endtime?.split("T")[0];
                const marker = L.circleMarker([lat, lon], {
                    color: "red",
                    radius: 6,
                    fillOpacity: 0.7,
                }).addTo(map);
                marker.bindPopup(`
                    <strong>${description}</strong><br/>
                    📍 ${lieu}<br/>
                    📅 Du <strong>${debut}</strong> au <strong>${fin}</strong>
                `);
            });
        });
}

