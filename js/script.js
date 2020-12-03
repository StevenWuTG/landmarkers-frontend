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

// v1 
// signInBar2.addEventListener("submit", function (e) {
//     e.preventDefault()
//     const imageInput = document.querySelector("#image-input")
//     const bioInput = document.querySelector("#bio-input")

//     // debugger
//     currentUser = loginInput.value
//     currentHometown = hometownInput.value
//     // signInBar.classList.remove("black-background")
//     // signInBar2.innerHTML = ""
//     hometownDiv.innerHTML = `<h3> ${currentHometown}</h3>`

//     const button2 = document.createElement("button")
//     button2.textContent = "All Landmarks"
//     button2.classList.add("center")
//     button2.id = "landmarks-button"

//     const button1 = document.createElement("button")
//     button1.textContent = "My Landmarks"
//     button1.classList.add("center")
//     button1.id = "my-button"

//     hometownDiv.append(button2,button1) 

//     const newUser = {
//         username: loginInput.value,
//         hometown: hometownInput.value,
//         img_url: imageInput.value,
//         bio: bioInput.value
//     }
//     fetch("http://localhost:3000/api/v1/users", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(newUser)
//     })
//     .then(resp => resp.json())
//     .then(newUserObj => {
//         // debugger
//         if (newUserObj.username === currentUser) {
//             setCurrentUser(newUserObj)
//         }
//         else if (newUserObj.error === "Unprocessable Entity") {
//             alert("Username already exists!")
//         }
//     })
//     .catch(error => console.log(error))
// })

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


            // debugger
            // usersArr.forEach(user => {
            //     if (user.username === currentUser) {
            //         setCurrentUser(user)
            //         renderLandmarks(user.landmarks)
            //     }
            //     else {
            //         const div = document.createElement("div")
            //         div.classList.add("signup-form")
            //         div.innerHTML = `
            //         <h3>Create User Form</h3><br>
            //         Username:<input id="login-input" name="username" type="text"><br>
            //         Hometown:<input id="hometown-input" name="hometown" type="text"><br>
            //         Image:<input id="image-input" name="img_url" type="text"><br>
            //         Bio:<input id="bio-input" name="bio" type="text"><br>
            //         <button id="signup-button">Sign Up</button></br>
            //         `
            //         signInBar2.append(div)
            //         const nameInput = document.querySelector("#login-input")
            //         nameInput.value = currentUser

            //         div.addEventListener("submit", handleSignup)

            //         // signInBar2.append( h3, nameInput, hometownInput, imageInput, bioInput )
            //     }

            // });
        })
        .catch(error => console.log(error))

    // NEED TO MAKE INTO NEW FUNCTION 
    // const button2 = document.createElement("button")
    // button2.textContent = "All Landmarks"
    // button2.classList.add("center")
    // button2.id = "landmarks-button"
    // button2.type = "button"

    // const button1 = document.createElement("button")
    // button1.textContent = "My Landmarks"
    // button1.classList.add("center")
    // button1.id = "my-button"
    // button1.type = "button"

    // hometownDiv.append(button2, button1)
    // -//

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
    }
    else if (e.target.id === "my-button") {
        fetchUserLandmarks(currentUserId)
    }
})

imgBox.addEventListener("click", function (e) {
    e.preventDefault()

    if (e.target.tagName === "li") {

    }
})

// INITIALIZER


// fetchUsers()
// fetchUserLandmarks()
// fetchAllLandmarks()