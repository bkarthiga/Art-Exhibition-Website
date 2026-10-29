window.addEventListener('load', (event) => {
    const delButtons = document.querySelectorAll('.deleteButton');

    delButtons.forEach(delButton => {
        delButton.addEventListener('click', function handleClick(event) {
            console.log('button clicked', this.id);
            let xhttp = new XMLHttpRequest()
            
            xhttp.onreadystatechange = function() { //An event 
                //When the response from the server is received 
                //indicating that the user has been deleted, the
                //browser should be redirected to the page 
                //to view the list of people in Bedrock.
                console.log("delete User")
                if (this.readyState == 4 && this.status == 200) {
                    console.log(this.responseText)   
                    location.href='http://localhost:3000/users'
                }
            }
            //Send a DELETE request to the server with the userID in the
            //URL
            xhttp.open("DELETE", `http://localhost:3000/user/${this.id}`)
            xhttp.send()

      });
    });
});


// function addPerson(){  
//     console.log("Adding a new Person")
//     let firstName = document.getElementById("firstName").value
//     let lastName = document.getElementById("lastName").value
//     let age = Number(document.getElementById("age").value)

//     let newPerson = {'firstName' : firstName, 'surName' : lastName, age : age}    
//     let xhttp = new XMLHttpRequest()
//     xhttp.onreadystatechange = function() { //An event 
//         //  When the response from the server is received 
//         //indicating that the vendor has been added, the
//         //browser should be redirected to the page 
//         //to view the newly created vendor.
//             console.log("Add New Person")
//             if (this.readyState == 4 && this.status == 200) {
//                 let responsePerson = JSON.parse(this.responseText)
//                 console.log(this.responseText)
//                 console.log(typeof(responsePerson._id))
                
//                 location.href=`http://localhost:3000/person/${responsePerson._id}`

//         }
//     }
    
//     xhttp.open("POST", "http://localhost:3000/addPerson")
//     xhttp.setRequestHeader("Content-Type", "application/json");
//     xhttp.send(JSON.stringify(newPerson))
// }
