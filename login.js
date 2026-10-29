function login() {

    let username = document.getElementById("username-input").value;
    let password = document.getElementById("password-input").value;

    const reqBody = {
        username,
        password
    }

    let req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        console.log(req)
        if (req.status === 200) {
          alert("Succesfully Logged-In.\n Redirecting to home page.\n");
          window.location = "/pokedex";
        }
        if(req.status === 401) {
            window.location = "/fourohone";
        }
    };
    req.open("POST", "/login", true);
    req.setRequestHeader("Content-Type", "application/json");
    req.send(JSON.stringify(reqBody));
}
