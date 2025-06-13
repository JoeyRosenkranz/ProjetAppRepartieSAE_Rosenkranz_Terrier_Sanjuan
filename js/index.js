// js/index.js
import { listerStation } from './velib.js';

const map = L.map('map').setView([48.692054, 6.184417], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// fetch restaurants depuis votre API
const restoListEl = document.getElementById('restaurantList');
const tplResto = Handlebars.compile(document.getElementById('tpl-restaurant').innerHTML);
let restaurants = [];

fetch('http://localhost:8000/restaurants')
  .then(res => { if(!res.ok) throw new Error(res.status); return res.json(); })
  .then(data => {
    restaurants = data.map(r => ({
      id: r.id,
      name: r.nom,
      address: r.adresse,
      lat: r.latitude,
      lng: r.longitude
    }));
    restoListEl.innerHTML = tplResto(restaurants);
  })
  .catch(err => console.error('Erreur fetch restos:', err));

let lastMarker = null;
const formContainer = document.getElementById('formContainer');

// Délégation d’événements dans la sidebar
document.querySelector('.sidebar').addEventListener('click', e => {
  const item = e.target.closest('.restaurant-item');
  if (item) {
    const id = +item.dataset.id;
    const resto = restaurants.find(r => r.id === id);

    // Si on clique sur Réserver
    if (e.target.matches('.btn-reserve')) {
      // effacer ancien marker et form
      if (lastMarker) map.removeLayer(lastMarker);
      formContainer.innerHTML = `
        <form id="reserveForm">
          <h3>Réserver @ ${resto.name}</h3>
          <label>Nom</label><input name="nom" required>
          <label>Prénom</label><input name="prenom" required>
          <label>Convives</label><input name="convives" type="number" required>
          <label>Téléphone</label><input name="tel" type="tel" required>
          <input name="restoId" type="hidden" value="${resto.id}">
          <button type="submit">Envoyer Réservation</button>
        </form>`;

      // centrer + marker
      lastMarker = L.marker([resto.lat, resto.lng]).addTo(map)
        .bindPopup(`<strong>${resto.name}</strong><br>${resto.address}`)
        .openPopup();
      map.setView([resto.lat, resto.lng], 15);
    }

    // Si on clique sur Lister tables
    if (e.target.matches('.btn-lister')) {
      // effacer ancien marker et form
      if (lastMarker) map.removeLayer(lastMarker);
      formContainer.innerHTML = `
        <form id="listForm">
          <h3>Tables dispo @ ${resto.name}</h3>
          <label>Restaurant ID</label><input name="restoId" value="${resto.id}" readonly>
          <button type="submit">Lister</button>
        </form>
        <div id="listResult"></div>`;

      // centrer + marker
      lastMarker = L.marker([resto.lat, resto.lng]).addTo(map)
        .bindPopup(`<strong>${resto.name}</strong><br>${resto.address}`)
        .openPopup();
      map.setView([resto.lat, resto.lng], 15);
    }
  }
});

// Soumission des formulaires (ajax basique)
formContainer.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  if (f.id === 'reserveForm') {
    const data = Object.fromEntries(new FormData(f).entries());
    console.log('POST /reserve', data);
    // fetch('http://localhost:8000/reserve', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) })
    //   .then(...)
  }
  if (f.id === 'listForm') {
    const restoId = f.restoId.value;
    console.log('GET /tables?restoId=', restoId);
    // fetch(`http://localhost:8000/tables?restoId=${restoId}`)
    //   .then(r=>r.json()).then(json=>{
    //     document.getElementById('listResult').innerHTML = JSON.stringify(json, null, 2);
    //   })
  }
});

// Stations Vélib’
listerStation(map).then(stations => {
  document.querySelector('.sidebar').addEventListener('click', e => {
    if (e.target.matches('.btn-show')) {
      const item = e.target.closest('.station-item');
      const id = item.dataset.id;
      const st = stations.find(s => s.id === id);
      if (lastMarker) map.removeLayer(lastMarker);
      lastMarker = L.marker([st.lat, st.lng]).addTo(map)
        .bindPopup(`<strong>${st.name}</strong><br>${st.address}`)
        .openPopup();
      map.setView([st.lat, st.lng], 15);
      formContainer.innerHTML = ''; // vider le formulaire
    }
  });
});
