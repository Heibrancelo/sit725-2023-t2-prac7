//Adding cards
const addCards = (items) => {
  items.forEach(item => {
      let itemToAppend = 
      
          `<div class="col s12 m4 l4"><div class="card large"><div class="card-image waves-effect waves-block waves-light">`+
          `<img class="activator" src="${item.imagePath}"></div>`+
              `<div class="card-content"><br><span class="card-title activator black-text">${item.firstName} ${item.lastName}<i class="material-icons right">more_vert</i>`+
              `</span><p class="black-text">Contact: ${item.email}</p></div><div class="card-reveal">`+
                  `<span class="card-title black-text">${item.firstName} ${item.lastName} <i class="material-icons right">close</i>`+
                  `</span><p class="black-text">${item.description}</p></div></div></div>`;


          $("#card-section").append(itemToAppend);
  });
};


// Submit Form 
const submitForm = () => {
  let formData = {};
  formData.imagePath = $("#image_path").val();
  formData.firstName = $("#first_name").val();
  formData.lastName = $("#last_name").val();
  formData.description = $("#description").val();
  formData.email = $("#email").val();

  console.log("Form Data Submitted: ", formData);
  postCat(formData);
}

function postCat(cat) {
  $.ajax({
    url: "/api/cat",
    type: "POST",
    data: cat,
    success: (result) => {
      if (result.statusCode === 201) {
        alert("Cat is added.");
      }
    },
  });
}

function getAllCats() {
  $.get("/api/cats", (response) => {  
    if (response.statusCode === 200) {
      addCards(response.data);
    }
  });
}

$(document).ready(function () {
  $(".materialboxed").materialbox();
  $("#submitForm").click(() => {
    submitForm();
  });

  $(".modal").modal();
  getAllCats(); 
});
