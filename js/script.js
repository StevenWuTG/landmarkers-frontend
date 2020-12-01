
// DOM QUERIES 
const landmarkBar = document.querySelector(".landmark-bar")
const loginBtn = document.querySelector("#login-button")

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

loginBtn.addEventListener("click", function(e){
    e.preventDefault()  

    const signInBar = document.querySelector(".sign-in-bar")
    const signInBar2 = document.querySelector(".sign-in-2")
    signInBar.classList.remove("black-background")
    signInBar2.innerHTML = ""
    // debugger
    console.log("click")
})

// INITIALIZER
fetchUsers()