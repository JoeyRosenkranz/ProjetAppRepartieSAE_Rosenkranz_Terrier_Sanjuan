// restaurant.js
// Gère la récupération et l'affichage des restaurants

export async function listerRestaurants(apiBaseUrl) {
    try {
        const res = await fetch(`${apiBaseUrl}/restaurants`);
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
        const restaurants = await res.json();
        return restaurants;
    } catch (err) {
        console.error('Erreur Restaurants :', err);
        return [];
    }
}

export function handleRestaurantClick(restoListEl, restaurants, map, lastMarker, API_BASE_URL) {
    restoListEl.addEventListener('click', e => {
        // Gestion des boutons Réserver
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
            form.onsubmit = function (ev) {
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
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
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
            document.getElementById('cancelReservation').onclick = function () {
                modal.style.display = 'none';
            };
            return;
        }

        // Gestion du clic sur un restaurant pour afficher le marker
        const item = e.target.closest('.restaurant-item');
        if (!item) return;
        const resto = restaurants.find(r => r.id === +item.dataset.id);
        if (!resto) return;

        // enlever ancien marker
        if (lastMarker.value) map.removeLayer(lastMarker.value);

        // en poser un nouveau
        lastMarker.value = L.marker([resto.lat, resto.lng])
            .addTo(map)
            .bindPopup(`<strong>${resto.name}</strong><br>${resto.address}`)
            .openPopup();

        map.setView([resto.lat, resto.lng], 15);
    });
}
