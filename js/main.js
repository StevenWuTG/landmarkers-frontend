// gettho session state 

let currentUser = 0
let currentHometown = 0
let currentUserId = 0
let currentUserObj = {}
let userLocations = {}
let hometownCoords = {}
let searchResultCoords = {}
let searchLandmarkId = 0
let currentLandmarkObj = {}


//////////////////// DOM ELEMENTS /////////////////////////
const titleBar = document.querySelector(".title-bar")
const landmarkBar = document.querySelector(".landmark-bar")
const hometownDiv = document.querySelector(".hometown-bar")
const imgBox = document.querySelector(".image-box")

const infoForm = document.querySelector(".info-form")
const landmarkForm = document.querySelector(".landmark-form")
const landmarkInfo = document.querySelector(".landmark-info")
const buttonContainer = document.querySelector("#button-container")
/* Log In / Sign Up */
const signInBar2 = document.querySelector(".sign-in-2")
const signInBar = document.querySelector(".sign-in-bar")
const loginInput = document.querySelector("#login-input")
const loginBtn = document.querySelector("#login-button")

const signinTab = document.querySelector("#sign-in-tab")
const signupTab = document.querySelector("#sign-up-tab")
const loginInForm = document.querySelector("#login-form")
const signupForm = document.querySelector("#new-user-form")
//////////////////// END OF DOM ELEMENTS /////////////////////

////////////////////////// FETCHES //////////////////////////

// not in use but works 
// function fetchUsers() {
//     fetch("http://localhost:3000/api/v1/users")
//         .then(resp => resp.json())
//         .then(userArr => {
//             console.log(userArr)
//         })
// }


function fetchUserLandmarks(user) {
    fetch(`http://localhost:3000/api/v1/users/${user}`)
        .then(resp => resp.json())
        .then(userObj => {
            currentUserObj = userObj
            renderLandmarks(userObj.landmarks)
        })
}

function fetchAllLandmarks() {
    fetch(`http://localhost:3000/api/v1/landmarks`)
        .then(resp => resp.json())
        .then(landmarkArr => {
            renderAllLandmarks(landmarkArr)
        })
}

// function findLandmarks() {
//     fetch(`http://localhost:3000/api/v1/landmarks`)
//         .then(resp => resp.json())
//         .then(landmarkArr => landmarkArr.forEach(landmark => {
//             if (landmark.name == locationName) {
//                 renderLandmarkInfo(landmark.id)
//             }
//         }))
// }

////////////////////// END OF FETCHES ////////////////////////

////////////////// RENDER FUNCITONS /////////////////////////

/* SetCurrentUser -> Loads after logging in or signing in */
function setCurrentUser(userObj) {
    signInBar.hidden = true
    // signInBar2.hidden = true
    landmarkBar.hidden = false
    imgBox.hidden = false
    // landmarkForm.hidden = true
    hometownDiv.hidden = false
    const h1 = document.createElement("h1")
    h1.textContent = userObj.hometown
    hometownDiv.append(h1)

    //Creating Buttons & Format Hometown Bar -> My Landmarks Button & All Landmarks 
    const button2 = document.createElement("button")
    button2.textContent = "All Landmarks"
    button2.classList.add("center")
    button2.id = "landmarks-button"
    button2.type = "button"

    const button1 = document.createElement("button")
    button1.textContent = "My Landmarks"
    button1.classList.add("center")
    button1.id = "my-button"
    button1.type = "button"

    hometownDiv.append(button2, button1)


    //Set Session State
    currentHometown = userObj.hometown
    currentUser = userObj.username
    currentUserId = userObj.id
    currentUserObj = userObj

    //Functions to run after creating page format/layout
    fetchLandmarkCoords() //Fetch User Landmarks & Adds to Global UserLocations Array
}

/* renderLandmarks -> Displays Landmarks as a list on the Landmark Bar */
function renderLandmarks(landmarksArray) {
    landmarkBar.innerHTML = ""
    const h3 = document.createElement("h3")
    h3.textContent = "My landmarks"
    h3.classList.add("bold")
    landmarkBar.append(h3)

    landmarksArray.forEach(landmark => {
        const li = document.createElement("li")
        li.textContent = landmark.name
        li.dataset.id = landmark.id
        landmarkBar.append(li)
    })
}

/* renderLandmarkInfo-> Displays Landmarks Info at the bottom after clicking li landmark */
function renderLandmarkInfo(id) {
    infoForm.hidden = false
    landmarkInfo.hidden = false
    const name = document.querySelector("#landmark-name")
    const address = document.querySelector("#landmark-address")
    const bio = document.querySelector("#landmark-bio")
    const genre = document.querySelector("#landmark-genre")
    const img = document.querySelector("#landmark-img")
    const img_url = document.querySelector("#landmark-image-url")

    //Fecth Specific Landmark to render info in appropiate places
    fetch(`http://localhost:3000/api/v1/landmarks/${id}`)
        .then(resp => resp.json())
        .then(landmarkObj => {
            name.value = landmarkObj.name
            address.value = landmarkObj.address
            bio.value = landmarkObj.bio
            genre.value = landmarkObj.genre
            img.src = landmarkObj.img_url
            img.alt = landmarkObj.name
            img_url.value = landmarkObj.img_url
            currentLandmarkObj = landmarkObj

            if (landmarkObj.user.id !== currentUserId) {
                name.disabled = true
                address.disabled = true
                bio.disabled = true
                genre.disabled = true
                img_url.hidden = true
                buttonContainer.innerHTML = ""
            }
            else {
                buttonContainer.innerHTML = ""

                const editButton = document.createElement("button")
                const deleteButton = document.createElement("button")

                img_url.hidden = false
                name.disabled = false
                address.disabled = false
                bio.disabled = false
                genre.disabled = false

                editButton.textContent = "Edit"
                editButton.id = "edit-button"
                deleteButton.id = "delete-button"
                deleteButton.textContent = "Delete"

                buttonContainer.append(editButton, deleteButton)
            }
        })
    // imgBox.innerHTML = ""
    // imgBox.append(img)
}

/* renderAllLandmarks-> Displays all landmarks as a list on the Landmark Bar */
function renderAllLandmarks(allLandmarks) {

    landmarkBar.innerHTML = ""
    const h3 = document.createElement("h3")
    h3.textContent = "All landmarks"
    landmarkBar.append(h3)
    let allLandmarkCoords = {}

    allLandmarks.forEach(landmark => {
        allLandmarkCoords[landmark.name] = landmark.coord

        const li = document.createElement("li")
        li.textContent = landmark.name
        li.dataset.id = landmark.id
        landmarkBar.append(li)
    })
    addMarkers(allLandmarkCoords, hometownCoords)
}
////////////////////// END OF FETCHES ////////////////////////


//////////////////// EVENT LISTENER /////////////////////////
buttonContainer.addEventListener("click", function (e) {
    if (e.target.id === "edit-button") {
        // debugger
        const name = landmarkInfo.querySelector("#landmark-name")
        const address = landmarkInfo.querySelector("#landmark-address")
        const bio = landmarkInfo.querySelector("#landmark-bio")
        const genre = landmarkInfo.querySelector("#landmark-genre")
        const img_url = landmarkInfo.querySelector("#landmark-image-url")

        const updatedLandmarkObj = {
            name: name.value,
            address: address.value, 
            bio: bio.value,
            genre: genre.value,
            img_url: img_url.value
        }

        fetch(`http://localhost:3000/api/v1/landmarks/${currentLandmarkObj.id}`, {
            method: 'PATCH', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedLandmarkObj),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }
    else if (e.target.id === "delete-button") {

        fetch(`http://localhost:3000/api/v1/landmarks/${currentLandmarkObj.id}`, {
            method: 'DELETE', // or 'PUT'
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                // debugger
                delete userLocations[currentLandmarkObj.name]
                fetchUserLandmarks(currentUserId)
                addMarkers(userLocations, hometownCoords)
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }
})

/* CLick on LI Landmark in LandmarkBar -> Populate Landmark Info */
landmarkBar.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        renderLandmarkInfo(parseInt(e.target.dataset.id))
    }
})

/* Submit on Landmark Form -> Add Landmark to DB & to LI List of My Landmarks */
landmarkForm.addEventListener("submit", function (e) {
    e.preventDefault()
    const newLandmark = {
        user_id: parseInt(currentUserId),
        name: e.target.name.value,
        address: e.target.address.value,
        img_url: e.target.image.value,
        bio: e.target.bio.value,
        genre: e.target.genre.value
    }

    fetch("http://localhost:3000/api/v1/landmarks", {
        method: 'POST', // or 'PUT'
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLandmark),
    })
        .then(response => response.json())
        .then(newLandmarkObj => {
            console.log('Success:', newLandmarkObj);
            searchLandmarkId = newLandmarkObj.id
            if (newLandmarkObj.name === newLandmark.name) {
                fetchUserLandmarks(currentUserId)
                createCoord()
                fetchLandmarkCoords()
                // addMarkers(userLocations,newLandmarkObj.coord.slice(lat, lng))
                debugger
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        })
})

function createCoord() {
    const newCoords = {
        lat: searchMarkers[0].position.lat(),
        lng: searchMarkers[0].position.lng(),
        landmark_id: searchLandmarkId
    }
    fetch("http://localhost:3000/api/v1/coords", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newCoords)
    })
        .then(resp => resp.json())
        .then(newCoordObj => {
            console.log(newCoordObj)
        })
}

/* <---------- LOGIN & SIGNUP FORMS V2 ------------> */
/* Click to LogIn/SignIn -> Fetch All Users to check for User & Set Session State andd Render User Landmarks */
loginInForm.addEventListener("submit", function (e) {
    e.preventDefault()
    currentUser = loginInput.value

    fetch("http://localhost:3000/api/v1/users")
        .then(resp => resp.json())
        .then(usersArr => {
            usersArr.forEach(user => {
                if (user.username === currentUser) {
                    currentUser = user
                }
            })
            if (usersArr.find(user => user.username === currentUser.username)) {
                setCurrentUser(currentUser)
                hometownCoords = geocodeHometown(currentHometown)

                renderLandmarks(currentUserObj.landmarks)
                // debugger

            }
            else { // Redirect to SignUp Form if User does not Exist
                alert("Username does not exist!")
                loginInForm.hidden = true
                signupForm.hidden = false

                signupTab.classList.remove("inactive", "underlineHover")
                signupTab.classList.add("active")

                signinTab.classList.add("inactive", "underlineHover")
                signinTab.classList.remove("active")

            }
        })
        .catch(error => console.log(error))
})
/* Toggle Between Forms By Clicking on Tab*/
signinTab.addEventListener("click", function (e) {
    e.preventDefault()

    loginInForm.hidden = false
    signupForm.hidden = true

    signinTab.classList.add("active")
    signinTab.classList.remove("inactive", "underlineHover")

    signupTab.classList.remove("active")
    signupTab.classList.add("inactive", "underlineHover")


})

signupTab.addEventListener("click", function (e) {
    e.preventDefault()

    loginInForm.hidden = true
    signupForm.hidden = false

    signupTab.classList.remove("inactive", "underlineHover")
    signupTab.classList.add("active")

    signinTab.classList.add("inactive", "underlineHover")
    signinTab.classList.remove("active")

})

/* Submit to Create New User (SignUp) -> POST Fetch UserInput & Set Session State */
signupForm.addEventListener("submit", function (e) {
    e.preventDefault()

    const newUser = {
        username: e.target.username.value,
        hometown: e.target.hometown.value,
        img_url: e.target.img_url.value,
        bio: e.target.bio.value
    }

    fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newUser)
    })
        .then(resp => resp.json())
        .then(newUserObj => {
            if (newUserObj) {
                setCurrentUser(newUserObj)
            }
            else if (newUserObj.error === "Unprocessable Entity") {
                alert("Username already exists!")
            }
        })
        .catch(error => console.log(error))


})
/* Click on My/All Landmark Buttons */
hometownDiv.addEventListener("click", function (e) {
    e.preventDefault()
    if (e.target.id === "landmarks-button") {
        infoForm.hidden = true
        landmarkInfo.hidden = true
        fetchAllLandmarks()
    }
    else if (e.target.id === "my-button") {
        infoForm.hidden = true
        landmarkInfo.hidden = true
        fetchUserLandmarks(currentUserId)
        fetchLandmarkCoords()
        addMarkers(userLocations, hometownCoords)
    }
})

// imgBox.addEventListener("click", function (e) {
//     e.preventDefault()
//     if (e.target.tagName === "li") {
//     }
// })
////////////////////// END OF EVENT LISTENER //////////////////

///////////////////////// MAP JS /////////////////////////////

/* Fetch Users Landmark & Adds to userLLocation Array */
function fetchLandmarkCoords() {
    fetch(`http://localhost:3000/api/v1/landmarks`)
        .then(resp => resp.json())
        .then(landmarkArr => {
            userLocations = {}
            landmarkArr.forEach(landmark => {
                if (landmark.user.username === currentUser) {
                    // debugger
                    userLocations[landmark.name] = landmark.coord
                }
            })
        })
}
////////////////////// END OF MAP.JS ///////////////////////////////

///////////////////////// GEOCODE.JS ///////////////////////////////
const searchBar = document.querySelector("#search-bar")

// let hometownCoords = geocode(currentHometown)
// let test5 = currentHometown

/* Gecode API -> Get coords from a Location(address) | Currently is coded to setting Global hometownCoords */
function geocodeHometown(location) {
    axios.get("https://maps.googleapis.com/maps/api/geocode/json?", {
        params: {
            address: location,
            key: 'AIzaSyDCMZIf7DhtFbXH8I1fB6wb3dcXAB5mrOM'
        }
    })
        .then(response => {
            let result = response.data.results[0].geometry.location
            // createCoords(variable)
            // debugger
            hometownCoords = result

        })
        .catch(error => {
            console.log(error)
        })
}
let searchBarCoords = {}

function geocodeSearchBar(location) {
    axios.get("https://maps.googleapis.com/maps/api/geocode/json?", {
        params: {
            address: location,
            key: 'AIzaSyDCMZIf7DhtFbXH8I1fB6wb3dcXAB5mrOM'
        }
    })
        .then(response => {
            let result = response.data.results[0].geometry.location
            // createCoords(variable)
            debugger
            return searchCoord[search] = result

        })
        .catch(error => {
            console.log(error)
        })
}


/* Submit on Search Bar -> Passes input to Geocode Function */
searchBar.addEventListener("submit", function (e) {
    e.preventDefault()
    infoForm.hidden = true
    landmarkInfo.hidden = true
    buttonContainer.innerHTML = ""
    // debugger
    initMap()
    const geocoder = new google.maps.Geocoder();
    if (searchMarkers.length === 0) {
        geocodeAddress(geocoder, currentMap);
    }
    else {
        searchMarkers[0].setMap(null)
        searchMarkers = []
        geocodeAddress(geocoder, currentMap);
    }

})

///////////////////////// END OF GEOCODE.JS ////////////////////////

function addMarkers(markersArray, centerCoord) {
    const mapCenter = centerCoord
    const map = displayMap();
    const markers = addMarkers(map)

    map.addListener("click", (e) => {
        if (searchMarkers.length === 0) {
            placeMarkerAndPanTo(e.latLng, map);
        }
        else {
            searchMarkers[0].setMap(null)
            searchMarkers = []
            placeMarkerAndPanTo(e.latLng, map)
        }
    })

    function placeMarkerAndPanTo(latLng, map) {
        const newMarker = new google.maps.Marker({
            position: latLng,
            map: map,
        })
        // searchMarkers = []
        searchMarkers.push(newMarker)
        // debugger
        // addMarkers(searchMarkers, latLng)
        map.panTo(latLng)
        newMarker.addListener("click", () => {
            buttonContainer.innerHTML = ""
            infoForm.hidden = false
            landmarkForm.hidden = false
        })
    }

    function displayMap() {
        const mapOptions = {
            center: mapCenter,
            zoom: 10
        };
        const mapDiv = document.getElementById('map');
        mapDiv.innerHTML = ""
        return new google.maps.Map(mapDiv, mapOptions);
    }



    function addMarkers(map) {
        const markers = [];
        // setCurrentUser(currentUserObj)
        for (const location in markersArray) {
            let locationName = location
            const markerOptions = {
                map: map,
                position: markersArray[location],
            }
            const marker = new google.maps.Marker(markerOptions);
            const infowindow = new google.maps.InfoWindow({
                content: contentString = `
                <h4 class="bold" id="location-header">${location}</h1> <br>
                `,
                maxWidth: 300
            })
            marker.setMap(map)
            marker.addListener("click", () => {
                console.log("clicked")
                map.setZoom(15);
                map.setCenter(marker.getPosition());
                infowindow.open(map, marker);
                fetch(`http://localhost:3000/api/v1/landmarks`)
                    .then(resp => resp.json())
                    .then(landmarkArr => landmarkArr.forEach(landmark => {
                        if (landmark.name == locationName) {
                            landmarkForm.hidden = true
                            renderLandmarkInfo(landmark.id)
                        }
                    }))
            })
            // markers.push(marker);
        }
        // debugger
        return markers;
    }

    map.addListener("rightclick", function (event) {
        map.setZoom(10);
        map.setCenter(mapCenter)
        infoForm.hidden = true
        landmarkInfo.hidden = true
    })
}

//////////// MAP WHEN FIRST SIGNING IN & SEARCH /////////////////////////
let currentMap;
let searchMarkers = []

function initMap() {
    mapCenter = { lat: 40.7128, lng: -74.0060 }
    currentMap = new google.maps.Map(document.getElementById("map"), {
        zoom: 10,
        center: mapCenter
    })

    currentMap.addListener("rightclick", () => {
        // debugger
        currentMap.setZoom(5);
        infoForm.hidden = true
        landmarkForm.hidden = true
    })

    currentMap.addListener("click", (e) => {
        if (searchMarkers.length === 0) {
            placeMarkerAndPanTo(e.latLng, currentMap);
        }
        else {
            searchMarkers[0].setMap(null)
            searchMarkers = []
            placeMarkerAndPanTo(e.latLng, currentMap)
        }
    })

    function placeMarkerAndPanTo(latLng, map) {
        const newMarker = new google.maps.Marker({
            position: latLng,
            map: map,
        })
        // searchMarkers = []
        searchMarkers.push(newMarker)
        // debugger
        // addMarkers(searchMarkers, latLng)
        currentMap.panTo(latLng)
        newMarker.addListener("click", () => {
            infoForm.hidden = false
            landmarkForm.hidden = false
        })
    }


}

function geocodeAddress(geocoder, resultsMap) {

    const address = document.getElementById("search-input").value;

    geocoder.geocode({ address: address }, (results, status) => {

        if (status === "OK") {
            resultsMap.setCenter(results[0].geometry.location);
            const marker = new google.maps.Marker({
                map: resultsMap,
                position: results[0].geometry.location,
            });
            searchMarkers.push(marker)
            marker.addListener("click", () => {
                currentMap.setZoom(15);
                currentMap.setCenter(marker.getPosition());
                infoForm.hidden = false
                landmarkForm.hidden = false

            })
            console.log("Geocode success")
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}
