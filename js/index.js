import { initMap } from './map.js';
import { listerRestaurants, handleRestaurantClick } from './restaurant.js';
import { renderTemplate } from './template.js';
import { listerStation, handleStationClick } from './velib.js';
import { afficherIncidents } from './incidents.js';

const map = initMap();

const API_BASE_URL = 'http://localhost:8000';

let restaurants = [];
const restoListEl = document.getElementById('restaurantList');

// Chargement des restaurants via module
listerRestaurants(API_BASE_URL)
    .then(data => {
        restaurants = data.map(r => ({
            id: r.id,
            name: r.nom,
            address: r.adresse,
            lat: r.latitude,
            lng: r.longitude
        }));
        renderTemplate('tpl-restaurant', restaurants, 'restaurantList');
        handleRestaurantClick(restoListEl, restaurants, map, lastMarker, API_BASE_URL);
    })
    .catch(err => {
        console.error('Erreur de chargement des restaurants:', err);
        restaurants = [];
    });

// Chargement des stations Vélib
listerStation(map);

// Affichage des incidents sur la carte
afficherIncidents(map, API_BASE_URL);

let lastMarker = { value: null };


const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', () => {
    const q = searchInput.value.toLowerCase();
    const filt = restaurants.filter(r => r.name.toLowerCase().includes(q));
    restoListEl.innerHTML = tplResto(filt);

    // nettoyer le marker courant si on change la liste
    if (lastMarker.value) {
        map.removeLayer(lastMarker.value);
        lastMarker.value = null;
    }
});

let stations = [];
listerStation(map).then(data => {
    stations = data;
    handleStationClick(map, stations, lastMarker);
});
