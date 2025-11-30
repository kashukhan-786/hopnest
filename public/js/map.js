// mapboxgl.accessToken = mapToken;

// const map = new mapboxgl.Map({
//   container: "map",
//   style: "mapbox://styles/mapbox/streets-v12",
//   center: [-74.5, 40],
//   zoom: 9,
// });

document.addEventListener("DOMContentLoaded", () => {
  mapboxgl.accessToken = mapToken;

  const map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/mapbox/streets-v12",
    center: listing.geometry.coordinates, // [lng, lat]
    zoom: 9,
  });

  // ADD MARKER HERE
  const marker = new mapboxgl.Marker({ color: "red" })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(
      new mapboxgl.Popup({ offset: 25 }).setHTML(
        `<h4>${listing.title}</h4> <p> Exact Location will be provided after booking</p>`
      )
    )
    .addTo(map);
});
