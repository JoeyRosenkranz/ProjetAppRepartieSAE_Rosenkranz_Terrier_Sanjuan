import {listerStation} from './velib.js';

const map = L.map('map').setView([48.692054, 6.184417], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Définir l'URL de base pour l'API
const API_BASE_URL = 'http://localhost:8000';

// a changer par infos de la bd
/*const restaurants = [
  { id: 1, name: 'Le Bon Miam',    address: '1 rue du Goût',          lat: 48.6925,   lng: 6.1848 },
  { id: 2, name: 'Chez Savoureux', address: '2 place de la Fourchette', lat: 48.69,     lng: 6.18   },
  { id: 3, name: 'Chez Joey',      address: '1 rue de la Montagne',   lat: 49.079853, lng: 7.002365 },
  { id: 4, name: 'Chez Jonesy',      address: '26 Rue de France',   lat: 872406, lng: 2438104 }
];
const tplResto    = Handlebars.compile(document.getElementById('tpl-restaurant').innerHTML);
=======
  { id: 3, name: 'Chez Joey',      address: '1 rue de la Montagne',   lat: 49.079853, lng: 7.002365 }
];*/
const tplResto = Handlebars.compile(document.getElementById('tpl-restaurant').innerHTML);

const restoListEl = document.getElementById('restaurantList');
let restaurants = [];
fetch(`${API_BASE_URL}/restaurants`)
    .then(res => {
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        return res.json();
    })
    .then(data => data.map(r => ({
        id: r.id,
        name: r.nom,
        address: r.adresse,
        lat: r.latitude,
        lng: r.longitude
    })))
    .then(data => {
        restaurants = data; // <-- ici
        restoListEl.innerHTML = tplResto(data);
    })
    .catch(err => {
        console.error('Erreur de chargement des restaurants:', err);
        restaurants = [];
    });


let lastMarker = null;

// clic resto  supprimer ancien marker, en poser un nouveau
restoListEl.addEventListener('click', e => {
    // Gestion des boutons Réserver et Lister tables
    const reserveBtn = e.target.closest('.btn-reserve');
    if (reserveBtn) {
        const item = reserveBtn.closest('.restaurant-item');
        if (!item) return;
        const resto = restaurants.find(r => r.id === +item.dataset.id);
        if (!resto) return;

        // Afficher le formulaire Handlebars dans une modal ou un conteneur
        const formTpl = Handlebars.compile(document.getElementById('tpl-reservation-form').innerHTML);
        let modal = document.getElementById('reservationModal');
        modal.innerHTML = `<div class="reservation-modal-content">${formTpl(resto)}</div>`;
        modal.style.display = 'flex';

        // Gestion soumission formulaire
        const form = document.getElementById('reservationForm');
        form.onsubmit = function(ev) {
            ev.preventDefault();
            const formData = new FormData(form);
            const nom = formData.get('nom');
            const prenom = formData.get('prenom');
            const telephone = formData.get('telephone');
            const nb = formData.get('nb');
            const idResto = formData.get('idResto');
            if (!nom || !prenom || !telephone || !nb || isNaN(nb)) return;
            fetch(`${API_BASE_URL}/reservation`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: `nom=${encodeURIComponent(nom)}&prenom=${encodeURIComponent(prenom)}&telephone=${encodeURIComponent(telephone)}&nb=${encodeURIComponent(nb)}&idResto=${encodeURIComponent(idResto)}`
            })
            .then(res => res.json())
            .then(data => {
                alert(data.message || 'Réservation effectuée !');
                modal.style.display = 'none';
            })
            .catch(err => {
                alert('Erreur lors de la réservation');
                console.error(err);
            });
        };
        // Annulation
        document.getElementById('cancelReservation').onclick = function() {
            modal.style.display = 'none';
        };
        return;
    }

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
