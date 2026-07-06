let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

let prompts = [];

let container = document.querySelector("#prompt-container");
let search = document.querySelector("#search");
let category = document.querySelector("#category");
let typeFilter = document.querySelector("#typeFilter");
let addBtn = document.querySelector("#addBtn");

if (!isLoggedIn) {
    document.querySelector(".add-area").style.display = "none";
}

// ================= LOAD PROMPTS =================

function loadPrompts() {

    fetch("http://localhost:5000/prompts")
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {

            prompts = data;
            filterData();

        });

}

// ================= SHOW PROMPTS =================

function showPrompts(data) {

    container.innerHTML = "";

    data.forEach(function (item) {

        let shortText =
            item.text.length > 100
                ? item.text.substring(0, 100) + "..."
                : item.text;

        container.innerHTML += `

        <div class="prompt">

            <h2>${item.title}</h2>

            <p id="text-${item.id}">
                ${shortText}
            </p>

            ${
                item.text.length > 100
                ? `<button id="btn-${item.id}" onclick="toggleText(${item.id})">
                        Read More
                   </button>`
                : ""
            }

            <p><strong>Category:</strong> ${item.category}</p>

            <p><strong>Type:</strong> ${item.type || "N/A"}</p>

            <p><strong>Created:</strong> ${item.created_at || "N/A"}</p>

            <button onclick="copyPrompt('${item.text}')">
                Copy
            </button>

            ${
                isLoggedIn
                ? `
                    <button onclick="editPrompt(${item.id})">
                        Edit
                    </button>

                    <button onclick="deletePrompt(${item.id})">
                        Delete
                    </button>
                  `
                : ""
            }

        </div>

        `;

    });

}

loadPrompts();

// ================= COPY =================

function copyPrompt(text) {

    navigator.clipboard.writeText(text);

    alert("Copied!");

}

// ================= READ MORE =================

function toggleText(id) {

    let item = prompts.find(function (p) {
        return p.id == id;
    });

    let text = document.getElementById(`text-${id}`);
    let btn = document.getElementById(`btn-${id}`);

    if (btn.innerText === "Read More") {

        text.innerText = item.text;
        btn.innerText = "Read Less";

    } else {

        text.innerText =
            item.text.length > 100
                ? item.text.substring(0, 100) + "..."
                : item.text;

        btn.innerText = "Read More";

    }

}
// ================= ADD =================

addBtn.addEventListener("click", function () {

    let title = document.querySelector("#title").value;
    let text = document.querySelector("#text").value;
    let cat = document.querySelector("#newCategory").value;
    let type = document.querySelector("#newType").value;

    let newPrompt = {
        title: title,
        text: text,
        category: cat,
        type: type
    };

    fetch("http://localhost:5000/prompts", {

        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "isloggedin": 
            localStorage.getItem("isLoggedIn") === "true" ? "true" : "false"
        },

        body: JSON.stringify(newPrompt)

    })

    .then(function () {

        loadPrompts();

    });

});


// ================= DELETE =================

function deletePrompt(id) {

    fetch(`http://localhost:5000/prompts/${id}`, {

        method: "DELETE",
        headers: {
            "isloggedin": localStorage.getItem("isLoggedIn") === "true" ? "true" : "false"
        }
    })

    .then(function () {

        loadPrompts();

    });

}


// ================= EDIT =================

function editPrompt(id) {

    let item = prompts.find(function (p) {
        return p.id == id;
    });

    let newTitle = prompt("Edit Title", item.title);
    let newText = prompt("Edit Text", item.text);
    let newCat = prompt("Edit Category", item.category);
    let newType = prompt("Edit Type", item.type || "template");

    if (
        newTitle === null ||
        newText === null ||
        newCat === null ||
        newType === null
    ) {
        return;
    }

    let updatedPrompt = {
        title: newTitle,
        text: newText,
        category: newCat,
        type: newType
    };

    fetch(`http://localhost:5000/prompts/${id}`, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json",
            "isloggedin": localStorage.getItem("isLoggedIn") === "true" ? "true" : "false"
        },

        body: JSON.stringify(updatedPrompt)

    })

    .then(function () {

        loadPrompts();

    });

}
// ================= SEARCH + FILTER =================

function filterData() {

    let searchValue = search.value.toLowerCase();
    let categoryValue = category.value;
    let typeValue = typeFilter.value;

    let result = prompts.filter(function (item) {

        return (
            item.title.toLowerCase().includes(searchValue) &&
            (categoryValue === "all" || item.category === categoryValue) &&
            (typeValue === "all" || item.type === typeValue)
        );

    });

    showPrompts(result);

}

search.addEventListener("keyup", filterData);
category.addEventListener("change", filterData);
typeFilter.addEventListener("change", filterData);


// ================= LOGIN / LOGOUT =================

if (isLoggedIn) {

    document.querySelector("#loginPageBtn").style.display = "none";
    document.querySelector("#logoutBtn").style.display = "inline-block";


} else {


}

document.querySelector("#logoutBtn").addEventListener("click", function () {

    localStorage.removeItem("isLoggedIn");

    alert("Logout Successful!");

    window.location.href = "index.html";

});