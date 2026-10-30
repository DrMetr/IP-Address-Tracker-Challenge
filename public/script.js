const initialLocation = "8.8.8.8";

const defaultView = [40.6928, -73.9903]; // Brooklyn NY

const map = L.map("map").setView(defaultView, 13);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '© <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const customIcon = L.divIcon({
  className: "",
  html: '<img src="images/icon-location.svg" alt="" />',
  iconSize: [30, 42],
  iconAnchor: [15, 42],
});

const marker = L.marker(defaultView, { icon: customIcon }).addTo(map);

async function updateMapByIP(ip = initialLocation) {
  try {
    const url = `/api/geo${ip ? `?ip=${encodeURIComponent(ip)}` : ""}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data.location?.lat || !data.location?.lng) return;

    const { region, city, postalCode, timezone, lat, lng } = data.location;

    map.setView([lat, lng], 13);
    marker.setLatLng([lat, lng]).openPopup();

    document.querySelector("output[name='IP-adress']").textContent = data.ip;
    document.querySelector("output[name='Location']").textContent =
      `${city}, ${region} ${postalCode}`;
    document.querySelector("output[name='Timezone']").textContent = timezone;
    document.querySelector("output[name='ISP']").textContent = data.isp || "—";
  } catch (err) {
    console.error("Ошибка геолокации:", err);
  }
}

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  const ip =
    document.getElementById("search-input").value.trim() || initialLocation;
  updateMapByIP(ip);
});

updateMapByIP();
