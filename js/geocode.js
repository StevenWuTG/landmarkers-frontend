// geocode()
let home = ""
let test5 = "2543 W 16th ST Brooklyn"
geocode(test5)
function geocode(location) {
    axios.get("https://maps.googleapis.com/maps/api/geocode/json?", {
        params: {
            address: location,
            key: 'AIzaSyCaT0W4HA3I3Yh2BC8ZM-sFcmlRXj7cXdo'
        }
    })
    .then(response => {
        // console.log(response)
        // debugger
        let variable = response.data.results[0].geometry.location
        // createCoords(variable)
        // debugger
        locations.push({variableName: variable})
    })
    .catch(error => {
        console.log(error)
    })
}

