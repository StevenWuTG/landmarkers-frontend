const mapDiv = document.getElementById('map');

function displayMap() {
    const mapOptions = {
        center: { lat: 40.7128, lng: -74.0060 },
        zoom: 10
    };
    const mapDiv = document.getElementById('map');
    return new google.maps.Map(mapDiv, mapOptions);
}

function runApp() {
    console.log('Maps JS API loaded');
    const map = displayMap();
    const markers = addMarkers(map)
}
const locations = {
    operaHouse: { lat: 40.73062, lng: -73.98298 },
    tarongaZoo: { lat: 40.75027, lng: -74.00013 },
}

const userLocations = {operaHouse: { lat: 40.73062, lng: -73.98298 }}

function addMarkers(map) {
    const markers = [];
    for (const location in userLocations) {
        const markerOptions = {
            map: map,
            position: userLocations[location],
        }
        const marker = new google.maps.Marker(markerOptions);
        markers.push(marker);
    }
    return markers;
}