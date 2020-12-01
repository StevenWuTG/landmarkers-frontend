// gettho session state 

let currentUser = 0
let currentHometown = 0


// DOM QUERIES 
const landmarkBar = document.querySelector(".landmark-bar")
const loginBtn = document.querySelector("#login-button")
const hometownDiv = document.querySelector(".hometown-bar")

const signInBar2 = document.querySelector(".sign-in-2")
const signInBar = document.querySelector(".sign-in-bar")
const loginInput = document.querySelector("#login-input")
const hometownInput = document.querySelector("#hometown-input")
// DOM SLAPPAGE

// FETCHES
    function fetchUsers(){
        fetch("http://localhost:3000/api/v1/users")
        .then(resp => resp.json())
        .then(userArr => {
            console.log(userArr)
        })
    
    }

fetch("http://localhost:3000/api/v1/users/1/")
.then(resp => resp.json())
.then(userObj => {
    console.log(userObj)
})

// RENDER FUNCTIONS

// EVENT LISTENERS

signInBar2.addEventListener("submit", function(e){
    e.preventDefault()  
    
    // debugger
    signInBar.hidden = true
    signInBar2.hidden = true
    currentUser = loginInput.value
    currentHometown = hometownInput.value
    hometownDiv.innerHTML = `<h3> ${currentHometown}</h3>`
    alert(`WELCOME ${currentUser}`)
    // signInBar.classList.remove("black-background")
    // signInBar2.innerHTML = ""
    
})

// INITIALIZER
fetchUsers()