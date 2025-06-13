

import { listerStation } from './velib.js';

const map = L.map('map').setView([48.692054, 6.184417], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// a changer par infos de la bd
const restaurants = [
  { id: 1, name: 'Le Bon Miam',    address: '1 rue du Goût',          lat: 48.6925,   lng: 6.1848 },
  { id: 2, name: 'Chez Savoureux', address: '2 place de la Fourchette', lat: 48.69,     lng: 6.18   },
  { id: 3, name: 'Chez Joey',      address: '1 rue de la Montagne',   lat: 49.079853, lng: 7.002365 },
  { id: 4, name: 'Chez Jonesy',      address: '26 Rue de France',   lat: 872406, lng: 2438104 }
];
const tplResto    = Handlebars.compile(document.getElementById('tpl-restaurant').innerHTML);
const restoListEl = document.getElementById('restaurantList');
restoListEl.innerHTML = tplResto(restaurants);


let lastMarker = null;

// clic resto  supprimer ancien marker, en poser un nouveau
restoListEl.addEventListener('click', e => {
  const item = e.target.closest('.restaurant-item');
  if (!item) return;

  const resto = restaurants.find(r => r.id === +item.dataset.id);
  if (!resto) return;

  // enlever ancien marker
  if (lastMarker) map.removeLayer(lastMarker);

  // en poser un nouveau
  lastMarker = L.marker([resto.lat, resto.lng])
    .addTo(map)
    .bindPopup(`<strong>${resto.name}</strong><br>${resto.address}`)
    .openPopup();

  map.setView([resto.lat, resto.lng], 15);
});


const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', () => {
  const q = searchInput.value.toLowerCase();
  const filt = restaurants.filter(r => r.name.toLowerCase().includes(q));
  restoListEl.innerHTML = tplResto(filt);

  // nettoyer le marker courant si on change la liste
  if (lastMarker) {
    map.removeLayer(lastMarker);
    lastMarker = null;
  }
});


let stations = [];
listerStation(map).then(data => {
  stations = data;

  // clic voir carte d’une station
  document.getElementById('stationList').addEventListener('click', e => {
    const btn = e.target.closest('.btn-show');
    if (!btn) return;
    const id = btn.closest('.station-item').dataset.id;
    const st = stations.find(s => s.id === id);
    if (!st) return;

    // enlever ancien marker
    if (lastMarker) map.removeLayer(lastMarker);

    // en poser un nouveau
    lastMarker = L.marker([st.lat, st.lng])
      .addTo(map)
      .bindPopup(
        `<strong>${st.name}</strong><br>` +
        `${st.address}<br>` +
        `🚲 ${st.num_bikes_available} — 🅿️ ${st.num_docks_available}`
      )
      .openPopup();

    map.setView([st.lat, st.lng], 15);
  });
});
