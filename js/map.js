// map.js
// Gère l'initialisation de la carte Leaflet

export function initMap() {
    const map = L.map('map').setView([48.692054, 6.184417], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    return map;
}

