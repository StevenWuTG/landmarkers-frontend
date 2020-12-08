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
const landmarkBarList = document.querySelector(".landmark-bar-list")
const hometownDiv = document.querySelector(".hometown-bar")
const mapBox = document.querySelector(".map-box")
const mainMap = document.querySelector("#map")

const infoForm = document.querySelector(".info-bar")
const landmarkForm = document.querySelector(".landmark-form")
const landmarkInfo = document.querySelector(".landmark-info")
const buttonContainer = document.querySelector("#button-container")
const searchBar = document.querySelector("#search-bar")
const avatarImg = document.querySelector(".avatar")
const userButtons = landmarkBar.querySelector("#user-buttons")
const userInfo = document.querySelector(".user-info")
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
    searchBar.hidden = false
    landmarkBar.hidden = false
    landmarkBarList.hidden = false
    userInfo.hidden = true
    mapBox.hidden = false
    mapBox.classList.remove("map-box-bg")
    mainMap.hidden = false
    // landmarkForm.hidden = true
    hometownDiv.hidden = false
    hometownDiv.innerHTML = ""
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

    avatarImg.src = userObj.img_url
    avatarImg.alt = userObj.username
    avatarImg.hidden = false

    //Functions to run after creating page format/layout
    fetchLandmarkCoords() //Fetch User Landmarks & Adds to Global UserLocations Array
}

/* renderLandmarks -> Displays Landmarks as a list on the Landmark Bar */
function renderLandmarks(landmarksArray) {
    landmarkBarList.innerHTML = ""
    const h3 = document.createElement("h3")
    h3.textContent = "My landmarks"
    h3.classList.add("bold")
    landmarkBarList.append(h3)

    landmarksArray.forEach(landmark => {
        const li = document.createElement("li")
        li.textContent = landmark.name
        li.dataset.id = landmark.id
        landmarkBarList.append(li)
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
    const img_url = document.querySelector("#landmark-img-url")

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
                buttonContainer.hidden = true
            }
            else {

                img_url.hidden = false
                name.disabled = false
                address.disabled = false
                bio.disabled = false
                genre.disabled = false


                // buttonContainer.innerHTML = ""
                // const editButton = document.createElement("button")
                // const deleteButton = document.createElement("button")
                // editButton.textContent = "Edit"
                // editButton.id = "edit-button"
                // deleteButton.id = "delete-button"
                // deleteButton.textContent = "Delete"


                // buttonContainer.append(editButton, deleteButton)

                buttonContainer.hidden = false
            }
        })
    // mapBox.innerHTML = ""
    // mapBox.append(img)
}

/* renderAllLandmarks-> Displays all landmarks as a list on the Landmark Bar */
function renderAllLandmarks(allLandmarks) {

    landmarkBarList.innerHTML = ""
    const h3 = document.createElement("h3")
    h3.textContent = "All landmarks"
    landmarkBarList.append(h3)
    let allLandmarkCoords = {}

    allLandmarks.forEach(landmark => {
        allLandmarkCoords[landmark.name] = landmark.coord

        const li = document.createElement("li")
        li.textContent = landmark.name
        li.dataset.id = landmark.id
        landmarkBarList.append(li)
    })
    addMarkers(allLandmarkCoords, hometownCoords)
}
////////////////////// END OF FETCHES ////////////////////////


//////////////////// EVENT LISTENER /////////////////////////
userButtons.addEventListener("click", function (e) {
    e.preventDefault()
    if (e.target.id === "user-edit") {
        const username = landmarkBar.querySelector("#edit-username")
        const hometown = landmarkBar.querySelector("#edit-hometown")
        const bio = landmarkBar.querySelector("#edit-bio")
        const img_url = landmarkBar.querySelector("#edit-image")

        const updatedUserObj = {
            username: username.value,
            hometown: hometown.value,
            bio: bio.value,
            img_url: img_url.value
        }
        debugger

        fetch(`http://localhost:3000/api/v1/users/${currentUserObj.id}`, {
            method: 'PATCH', // or 'PUT'
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedUserObj),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                setCurrentUser(data)
                hometownCoords = geocodeHometown(currentHometown)

                renderLandmarks(currentUserObj.landmarks)
            })
            .catch((error) => {
                console.error('Error:', error);
            });

    }
    else if (e.target.id === "user-delete") {
        e.target.hidden = true
        const deleteConfirm = document.querySelector("#delete-confirm")
        deleteConfirm.hidden = false
        alert("YOU WILL PERMANENTLY DELETE YOUR ACCOUNT")

    }
    else if (e.target.id === "delete-confirm") {


        fetch(`http://localhost:3000/api/v1/users/${currentUserObj.id}`, {
            method: 'DELETE', // or 'PUT'
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);                        // debugger
                window.location.reload();
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        const deleteConfirm = document.querySelector("#delete-confirm")
        deleteConfirm.hidden = false

    }
})


avatarImg.addEventListener("click", function (e) {
    e.preventDefault()
    // debugger
    landmarkBarList.hidden = true
    userButtons.hidden = false
    userInfo.hidden = false

    userInfo.username.value = currentUserObj.username
    userInfo.hometown.value = currentUserObj.hometown
    userInfo.img_url.value = currentUserObj.img_url
    userInfo.bio.value = currentUserObj.bio

    // const form = document.createElement("form")

    // form.innerHTML = `
    //     Username:<input name="username" id="edit-username" placeholder="${currentUserObj.username}"></input><br>
    //     Hometown:<input name="hometown" id="edit-hometown" placeholder="${currentUserObj.hometown}"></input><br>
    //     Image:<input name="img_url" id="edit-image" placeholder="${currentUserObj.img_url}"></input><br>
    //     Bio:<input name="bio" id="edit-bio" placeholder="${currentUserObj.bio}"></input><br>
    //     <div id="user-buttons">
    //             <button name="edit">Edit</button>
    //             <button name="delete">Delete</button>
    //     </div>


    // `

    // landmarkBar.append(form)


})


buttonContainer.addEventListener("click", function (e) {
    if (e.target.id === "landmark-edit") {
        debugger
        const name = landmarkInfo.querySelector("#landmark-name")
        const address = landmarkInfo.querySelector("#landmark-address")
        const bio = landmarkInfo.querySelector("#landmark-bio")
        const genre = landmarkInfo.querySelector("#landmark-genre")
        const img_url = landmarkInfo.querySelector("#landmark-img-url")

        const updatedLandmarkObj = {
            name: name.value,
            address: address.value,
            bio: bio.value,
            genre: genre.value,
            img_url: img_url.value
        }

        // debugger
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
    else if (e.target.id === "landmark-delete") {
        debugger
        e.target.hidden = true
        const deleteConfirm = buttonContainer.querySelector("#delete-confirm")
        deleteConfirm.hidden = false
        alert("YOU WILL PERMANENTLY DELETE YOUR LANDMARK")

    }
    else if (e.target.id === "delete-confirm") {

        fetch(`http://localhost:3000/api/v1/landmarks/${currentLandmarkObj.id}`, {
            method: 'DELETE', // or 'PUT'
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                // debugger
                delete userLocations[currentLandmarkObj.name]
                setCurrentUser(currentUserObj)
                fetchUserLandmarks(currentUserId)
                addMarkers(userLocations, hometownCoords)

            })
            .catch((error) => {
                console.error('Error:', error);
            });

        const deleteButton = document.querySelector("#landmark-delete")
        deleteButton.hidden = false
        e.target.hidden = true
        infoForm.hidden = true

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
    landmarkForm.hidden = true
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
                // debugger
                infoForm.hidden = true
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        })
    e.target.reset()
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
                hometownCoords = geocodeHometown(currentHometown)
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
        landmarkBarList.hidden = false
        userInfo.hidden = true
        infoForm.hidden = true
        userButtons.hidden = true
        landmarkInfo.hidden = true
        fetchAllLandmarks()
    }
    else if (e.target.id === "my-button") {
        userInfo.hidden = true
        landmarkBarList.hidden = false
        userButtons.hidden = true
        infoForm.hidden = true
        landmarkInfo.hidden = true
        fetchUserLandmarks(currentUserId)
        fetchLandmarkCoords()
        addMarkers(userLocations, hometownCoords)
    }
})

// mapBox.addEventListener("click", function (e) {
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
    buttonContainer.hidden = true
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
            buttonContainer.hidden = true
            infoForm.hidden = false
            landmarkForm.hidden = false
            landmarkInfo.hidden = true
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
