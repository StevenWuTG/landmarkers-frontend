// gettho session state 

let currentUser = 0
let currentHometown = 0
let currentUserId = 0
let currentUserObj = {}


// DOM QUERIES 
const landmarkBar = document.querySelector(".landmark-bar")
const loginBtn = document.querySelector("#login-button")
const hometownDiv = document.querySelector(".hometown-bar")
const landmarkForm = document.querySelector(".landmark-form")
const landmarkInfo = document.querySelector(".landmark-info")
const imgBox = document.querySelector(".image-box")

const signInBar2 = document.querySelector(".sign-in-2")
const signInBar = document.querySelector(".sign-in-bar")
const loginInput = document.querySelector("#login-input")
const hometownInput = document.querySelector("#hometown-input")
// DOM SLAPPAGE

// FETCHES
function fetchUsers() {
    fetch("http://localhost:3000/api/v1/users")
        .then(resp => resp.json())
        .then(userArr => {
            console.log(userArr)
        })

}

// fetch("http://localhost:3000/api/v1/users/1/")
//     .then(resp => resp.json())
//     .then(userObj => {
//         console.log(userObj)
//     })

function fetchUserLandmarks(user) {
    fetch(`http://localhost:3000/api/v1/users/${user}`)
    .then(resp => resp.json())
    .then(userObj => {
        currentUserObj = userObj
        renderLandmarks(userObj.landmarks)
    })
}

function fetchAllLandmarks () {
    fetch(`http://localhost:3000/api/v1/landmarks`)
    .then(resp => resp.json())
    .then(landmarkArr => {
        renderLandmarks(landmarkArr)
    })
}


// RENDER FUNCTIONS
function setCurrentUser(newUserObj) {
    signInBar.hidden = true
    signInBar2.hidden = true
    
    currentHometown = newUserObj.hometown
    currentUser = newUserObj.username
    currentUserId = newUserObj.id
}

function renderLandmarks(landmarksArray) {
    landmarkBar.innerHTML = ""
    const h5 = document.createElement("h5")
    h5.textContent = "List of landmarks"
    landmarkBar.append(h5)

    landmarksArray.forEach(landmark => {
      const li = document.createElement("li")
      li.textContent = landmark.name
      li.dataset.id = landmark.id
      landmarkBar.append(li)
    })
}

function renderLandmarkInfo (id) {
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

// EVENT LISTENERS
landmarkBar.addEventListener("click", function(e) {
    if (e.target.tagName === "LI") {
        // debugger
        renderLandmarkInfo(parseInt(e.target.dataset.id))
    }
})

landmarkForm.addEventListener("submit", function(e) {
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

signInBar2.addEventListener("submit", function (e) {
    e.preventDefault()
    const imageInput = document.querySelector("#image-input")
    const bioInput = document.querySelector("#bio-input")

    // debugger
    currentUser = loginInput.value
    currentHometown = hometownInput.value
    // signInBar.classList.remove("black-background")
    // signInBar2.innerHTML = ""
    hometownDiv.innerHTML = `<h3> ${currentHometown}</h3>`
    const newUser = {
        username: loginInput.value,
        hometown: hometownInput.value,
        img_url: imageInput.value,
        bio: bioInput.value
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
        if (newUserObj.username === currentUser) {
            setCurrentUser(newUserObj)
        }
        else if (newUserObj.error === "Unprocessable Entity") {
            alert("Username already exists!")
        }
    })
    .catch(error => console.log(error))
})

// INITIALIZER
fetchUsers()
// fetchUserLandmarks()
// fetchAllLandmarks()