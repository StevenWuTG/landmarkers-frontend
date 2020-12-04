const mapDiv = document.getElementById('map');

function displayMap(coords) {
    const mapOptions = {
        center: coords,
        zoom: 10
    };
    const mapDiv = document.getElementById('map');
    return new google.maps.Map(mapDiv, mapOptions);
}

function runApp(coords) {
    // debugger
    console.log('Maps JS API loaded');
    const map = displayMap(coords);
    const markers = addMarkers(map)
}
const locations = {
    operaHouse: { lat: 40.73062, lng: -73.98298 },
    tarongaZoo: { lat: 40.75027, lng: -74.00013 },
}

// const userLocations = {{lat: 40.73062, lng: -73.98298 }, {lat: 40.73062, lng: -73.98298 }}

let userLocations = {}

currentUser.landmarks.forEach(landmark => {
    // let landmark.name = landmark.coords.slice(:lat, :lng)
    userLocations[landmark.name] = landmark.coord.slice(:lat, :lng)
    
});

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