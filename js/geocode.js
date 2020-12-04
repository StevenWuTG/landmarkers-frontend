
const searchBar = document.querySelector("#search-bar")

let hometownCoords = {}
let test5 = "2543 W 16th ST Brooklyn"
geocode(test5)
function geocode(location) {
    axios.get("https://maps.googleapis.com/maps/api/geocode/json?", {
        params: {
            address: location,
            key: 'AIzaSyDCMZIf7DhtFbXH8I1fB6wb3dcXAB5mrOM'
        }
    })
    .then(response => {
        // console.log(response)
        // debugger
        let result = response.data.results[0].geometry.location
        // createCoords(variable)
        // debugger
        console.log(result)
        hometownCoords = result
    })
    .catch(error => {
        console.log(error)
    })
}

searchBar.addEventListener("submit", function(e){
    e.preventDefault()
    // debugger
    const search = e.target.search.value
    geocode(search)
})
