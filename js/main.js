// gettho session state 

let currentUser = 0
let currentHometown = 0
let currentUserId = 0
let currentUserObj = {}
let userLocations = {}


// DOM QUERIES 
const landmarkBar = document.querySelector(".landmark-bar")
const loginBtn = document.querySelector("#login-button")
const titleBar = document.querySelector(".title-bar")

const hometownDiv = document.querySelector(".hometown-bar")

const landmarkForm = document.querySelector(".landmark-form")
const landmarkInfo = document.querySelector(".landmark-info")
const imgBox = document.querySelector(".image-box")

const signInBar2 = document.querySelector(".sign-in-2")
const signInBar = document.querySelector(".sign-in-bar")
const loginInput = document.querySelector("#login-input")

const signinTab = document.querySelector("#sign-in-tab")
const signupTab = document.querySelector("#sign-up-tab")

// DOM SLAPPAGE

// FETCHES

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


// RENDER FUNCTIONS
function setCurrentUser(userObj) {
    signInBar.hidden = true
    // signInBar2.hidden = true

    landmarkBar.hidden = false
    imgBox.hidden = false
    landmarkForm.hidden = false
    hometownDiv.hidden = false

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

    const h1 = document.createElement("h1")
    h1.textContent = userObj.hometown

    hometownDiv.append(h1)

    currentHometown = userObj.hometown
    currentUser = userObj.username
    currentUserId = userObj.id
    currentUserObj = userObj

    fetchLandmarkCoord()
    geocode(currentHometown)
    // debugger
    runApp(hometownCoords)
}

function renderLandmarks(landmarksArray) {
    landmarkBar.innerHTML = ""
    const h5 = document.createElement("h5")
    h5.textContent = "My landmarks"
    landmarkBar.append(h5)

    landmarksArray.forEach(landmark => {
        const li = document.createElement("li")
        li.textContent = landmark.name
        li.dataset.id = landmark.id
        landmarkBar.append(li)
    })
}

function renderLandmarkInfo(id) {
    landmarkInfo.hidden = false
    const name = document.querySelector("#landmark-name")
    const address = document.querySelector("#landmark-address")
    const bio = document.querySelector("#landmark-bio")
    const genre = document.querySelector("#landmark-genre")
    const img = document.createElement("img")
    img.classList.add("landmark-image")


    fetch(`http://localhost:3000/api/v1/landmarks/${id}`)
        .then(resp => resp.json())
        .then(landmarkObj => {
            name.textContent = landmarkObj.name
            address.textContent = landmarkObj.address
            bio.textContent = landmarkObj.bio
            genre.textContent = landmarkObj.genre
            img.src = landmarkObj.img_url
            img.alt = landmarkObj.name
        })
    imgBox.innerHTML = ""
    imgBox.append(img)
}

function renderAllLandmarks(allLandmarks) {

    landmarkBar.innerHTML = ""
    const h5 = document.createElement("h5")
    h5.textContent = "All landmarks"
    landmarkBar.append(h5)

    allLandmarks.forEach(landmark => {
        const li = document.createElement("li")
        li.textContent = landmark.name
        li.dataset.id = landmark.id
        landmarkBar.append(li)
    })

}



// EVENT LISTENERS
landmarkBar.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        // debugger
        renderLandmarkInfo(parseInt(e.target.dataset.id))
    }
})

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
    // debugger
    fetch("http://localhost:3000/api/v1/landmarks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newLandmark)
    })
        .then(resp => resp.json())
        .then(newLandmarkobj => {
            // renderLandmarks(newLandmark)
            // debugger
            if (newLandmarkobj.error) {
                console.log(`${newLandmarkobj.exception}`)

            }
            else if (newLandmarkobj.name === newLandmark.name) {
                // console.log("success")
                // console.log(newLandmarkobj)
                fetchUserLandmarks(currentUserId)
            }
        })
        .catch(error => console.log(error))
    // debuggers

})

// v2
const loginInForm = document.querySelector("#login-form")
const signupForm = document.querySelector("#new-user-form")
loginInForm.addEventListener("submit", function (e) {
    e.preventDefault()



    currentUser = loginInput.value

    // debugger
    fetch("http://localhost:3000/api/v1/users")
        .then(resp => resp.json())
        .then(usersArr => {
            usersArr.forEach(user => {
                if (user.username === currentUser) {
                    currentUser = user
                }
            })
            // debugger

            if (usersArr.find(user => user.username === currentUser.username)) {
                setCurrentUser(currentUser)
                renderLandmarks(currentUser.landmarks)
            }
            else {
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

signupForm.addEventListener("submit", function (e) {
    e.preventDefault()

    // debugger
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
            // debugger
            if (newUserObj) {
                setCurrentUser(newUserObj)
            }
            else if (newUserObj.error === "Unprocessable Entity") {
                alert("Username already exists!")
            }
        })
        .catch(error => console.log(error))


})

hometownDiv.addEventListener("click", function (e) {
    e.preventDefault()
    if (e.target.id === "landmarks-button") {
        fetchAllLandmarks()
        testerFunction()
    }
    else if (e.target.id === "my-button") {
        fetchUserLandmarks(currentUserId)
    }
})

// function renderLocation () {
//     for (let i = 0; i < userLocations.length; i++) {
//         displayMap()
//     }
// }

imgBox.addEventListener("click", function (e) {
    e.preventDefault()

    if (e.target.tagName === "li") {

    }
})

//////////Map.js/////////////
// let mapDiv = document.getElementById('map');

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



function addMarkers(map) {
    let userLocations = { stevenHouse: { lat: 40.585665, lng: -73.984832 } }

    const markers = [];
    // setCurrentUser(currentUserObj)
    fetch(`http://localhost:3000/api/v1/landmarks`)
        .then(resp => resp.json())
        .then(landmarkArr => {
            // debugger
            landmarkArr.forEach(landmark => {
                if (landmark.user.username === currentUser) {
                    // debugger
                    userLocations[landmark.name] = landmark.coord
                }
            })
        })

    for (const location in userLocations) {
        const markerOptions = {
            map: map,
            position: userLocations[location],
        }
        const marker = new google.maps.Marker(markerOptions);
        markers.push(marker);
    }
    // userLocations.forEach(landmark => {
    //     const markerOptions = {
    //         map: map,
    //         position: userLocations[landmark],
    //     }
    //     const marker = new google.maps.Marker(markerOptions);
    //     markers.push(marker);
    // })
    return markers;
}

function fetchLandmarkCoord() {
    fetch(`http://localhost:3000/api/v1/landmarks`)
        .then(resp => resp.json())
        .then(landmarkArr => {
            // debugger
            landmarkArr.forEach(landmark => {
                if (landmark.user.username === currentUser) {
                    // debugger
                    userLocations[landmark.name] = landmark.coord
                }
            })
        })
}
//////////End of Map.js//////

///////////Geocode.js/////////

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

searchBar.addEventListener("submit", function (e) {
    e.preventDefault()
    // debugger
    const search = e.target.search.value
    geocode(search)
})

/////////End of Geocode.js/////

function testerFunction() {
    const mapCenter = hometownCoords
    const map = displayMap();
    const markers = addMarkers(map)
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
}