const socket = io();

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", longitude, latitude);
    },
    (error) => {
      console.error(error);
    },
    {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
    }
  );
}


const map = L.map("map").setView([0, 0], 10);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Gurpartap",
}).addTo(map);

const markers = {}; // Map to store markers per device

socket.on("receive-location", (data) => {
  console.log("data", data);

  const { id, latitude, longitude } = data;
 
  if (
    typeof latitude !== "number" ||
    typeof longitude !== "number" ||
    isNaN(latitude) ||
    isNaN(longitude)
  ) {
    console.warn("Invalid coordinates received!", latitude, longitude);
    return;
  }

  // Center map on this location
  map.setView([latitude, longitude], 16);

  if (markers[id]) {
    // Update marker position
    markers[id].setLatLng([latitude, longitude]);
  } else {
    // Create new marker and add to map
    markers[id] = L.marker([latitude, longitude])
      .addTo(map)
      .bindPopup(`Device ID: ${id}`)
      .openPopup();
  }
});

socket.on("user-disconnected",(id)=>{
    if(markers[id]){
        map.removeLayer(markers[id])
        delete markers[id];
    }
})