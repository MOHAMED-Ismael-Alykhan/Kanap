const urlParams = new URLSearchParams(window.location.search); //On récupère l'URL de la page
const id = urlParams.get("_id"); // on récupère ensuite la valeur de l'id.
console.log(id);

/*const urlPage = window.location.search;
console.log(urlPage);
const id = urlPage.slice(5);
console.log(id);*/

fetch("http://localhost:3000/api/products") //Requête vers API
  .then((response) => response.json()) //Récupération des données en format json
  .then((data) => {
    console.table(data); //Résultats dans la console présentés dans un tableau
    lesKanaps(data); //Appel à la fonction lesKanaps(data).
  })
  // Si données non récupérées, afficher erreur au niveau du h1 et dans la console
  .catch((err) => {
    console.log("erreur" + err);
    document.querySelector(".item").innerHTML = "<h1>erreur</h1>";
  });

//Déclaration de la fonction lesKanaps(data)
function lesKanaps(data) {
  //variables ciblant les zones du DOM pour insertion
  let imageEtAltTxt = document.querySelector(".item__img");
  let nom = document.querySelector("#title");
  let prix = document.querySelector("#price");
  let description = document.querySelector("#description");

  for (let produit of data) {
    /* Condition d'affichage des données du produit si l'id dans l'url de la page est identique à l'id des données récupérées précédemment*/
    if (id === produit._id) {
      //Affichage des données du produit
      imageEtAltTxt.innerHTML = `<img src="${produit.imageUrl}" alt="${produit.AltTxt}">`;
      nom.textContent = `"${produit.name}"`;
      prix.textContent = `"${produit.price}"`;
      description.textContent = `"${produit.description}"`;

      /*Déclaration de la variable ciblant la zone du DOM pour insertion de la sélection des couleurs par produit*/
      let couleurSelection = document.querySelector("#colors");

      for (let couleurs of produit.colors) {
        //Affichage des couleurs disponibles du produit
        couleurSelection.innerHTML += `"<option value="${couleurs}">${couleurs}</option>;"`;
        console.log("choix des couleurs");
      }
    }
  }
}
