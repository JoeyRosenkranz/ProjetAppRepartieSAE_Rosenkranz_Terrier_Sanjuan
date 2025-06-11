// on cree la map
const map = L.map('map').setView([48.692054, 6.184417], 13);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// juste pour test a remplacer par bd
const restaurants = [
  { id: 1, name: 'Le Bon Miam', address: '1 rue du Goût', lat: 48.6925, lng: 6.1848 },
  { id: 2, name: 'Chez Savoureux', address: '2 place de la Fourchette', lat: 48.6900, lng: 6.1800 },
  { id: 3, name: 'Chez Joey', address: '1 Rue de la montagne woustviller', lat: 49.079853, lng: 7.002365 },
];

// compiler et afficher la liste avec Handlebars
const source = document.getElementById('tpl-restaurant').innerHTML;
const template = Handlebars.compile(source);
document.getElementById('restaurantList').innerHTML = template(restaurants);

// gérer le clic sur un resto
document.getElementById('restaurantList').addEventListener('click', e => {
  const item = e.target.closest('.restaurant-item');
  if (!item) return;

  const id = +item.dataset.id;
  const resto = restaurants.find(r => r.id === id);
  if (!resto) return;

  // on centre on fonctione de la latitude longitude
  map.setView([resto.lat, resto.lng], 15);

  // ouvrir un marker
  L.marker([resto.lat, resto.lng])
    .addTo(map)
    .bindPopup(`<strong>${resto.name}</strong><br>${resto.address}`)
    .openPopup();

  // TODO : lister les tables dispo et activer le bouton "Réserver" avec la bd 
});

// filtrage simple
document.getElementById('searchInput').addEventListener('input', e => {
  const q = e.target.value.toLowerCase();
  const filt = restaurants.filter(r => r.name.toLowerCase().includes(q));
  document.getElementById('restaurantList').innerHTML = template(filt);
});
