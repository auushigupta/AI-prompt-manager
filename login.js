document.querySelector("#loginBtn").addEventListener("click", function () {

    let email = document.querySelector("#email").value;
    let password = document.querySelector("#password").value;

    fetch("http://localhost:5000/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email: email,
            password: password
        })

    })

    .then(function (response) {
        return response.json();
    })

    .then(function (data) {

        if (data.success) {

            localStorage.setItem("isLoggedIn", "true");

            alert(data.message);

            window.location.href = "index.html";

        } else {

            alert(data.message);

        }

    })

    .catch(function (error) {

        console.log(error);

        alert("Server Error");

    });

});