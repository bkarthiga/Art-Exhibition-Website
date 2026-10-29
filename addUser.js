window.addEventListener('load', (event) => {
    document.getElementById("addUser").addEventListener("click", addUser);
});


function addUser(){  
    console.log("Adding a new User")
    let firstName = document.getElementById("firstName").value
    let lastName = document.getElementById("lastName").value
    let age = Number(document.getElementById("age").value)

    let newUser = {'firstName' : firstName, 'surName' : lastName, age : age}    
    let xhttp = new XMLHttpRequest()
    xhttp.onreadystatechange = function() { //An event 
        //  When the response from the server is received 
        //indicating that the user has been added, the
        //browser should be redirected to the page 
        //to view the newly created user.
            console.log("Add New User")
            if (this.readyState == 4 && this.status == 200) {
                let responseUser = JSON.parse(this.responseText)
                console.log(this.responseText)
                console.log(typeof(responseUser._id))
                
                location.href=`http://localhost:3000/user/${responseUser._id}`

        }
    }
    //Send a POST request to the server with the new user information
    //in the newUser JSON object.
    xhttp.open("POST", "http://localhost:3000/addUser")
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.send(JSON.stringify(newUser))
}
