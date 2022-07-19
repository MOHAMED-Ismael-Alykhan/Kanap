let url = "http://localhost:3000/api/products"; // url de l'API

fetch(url) //Requête vers API
  .then((response) => response.json()) //Récupération des données en format json
  .then((data) => {
    affichageGammeProduits(data); //Fonction affichage des produits du site
  })
  // Si données non récupérées, afficher erreur au niveau du h1 et dans la console
  .catch((err) => {
    document.querySelector(".titles").innerHTML = "<h1>Erreur</h1>";
    console.log("erreur" + err);
  });

function affichageGammeProduits(data) {
  let affichageProduits = document.querySelector("#items"); //variable ciblant la zone du DOM pour insertion
  //Boucle pour chaque produit du tableau résultat
  for (let produit of data) {
    //affichage de chaque produit dans la zone du DOM définit précedemment en fonction de son: id, imageUrl, altTxt, name, description
    affichageProduits.innerHTML += `<a href="./product.html?_id=${produit._id}">
    <article>
      <img src="${produit.imageUrl}" alt="${produit.altTxt}">
      <h3 class="productName">${produit.name}</h3>
      <p class="productDescription">${produit.description}</p>
    </article>
  </a>`;
  }
}
