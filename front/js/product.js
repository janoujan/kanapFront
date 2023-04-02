import { Cart } from './cartManager.js'

// création d'un objet Cart pour recuperer les methodes de cartManager.js
const cartManager = new Cart()

// création d'un objet vide pour récuperer les choix de l'utilisateur dans les listeners
const userSelection = {}

// recuperartion de l'id de l'url pour le fetch de la fonction displayKanap
const searchParams = new URLSearchParams(document.location.search)
const id = searchParams.get('id')
if (id === null || id === undefined) {
  document.querySelector('article').innerHTML =
    "<h1>ne jouez pas avec l'URL SVP :)</h1>"
}
// récupération des noeuds du DOM
const kanapImg = document.querySelector('.item__img')
const kanapPrice = document.getElementById('price')
const kanapDescription = document.getElementById('description')
const kanapName = document.getElementById('title')
const optionColor = document.getElementById('colors')

// une fonction pour recupérer les données de l'API et les afficher
const displayKanap = () => {
  fetch(`https://kanapback-382417.oa.r.appspot.com/api/products/${id}`)
    .then(data => data.json())
    .then(jsonKanap => {
      kanapImg.innerHTML = `<img src="${jsonKanap.imageUrl}" alt="${jsonKanap.altTxt}">`
      kanapName.innerHTML = jsonKanap.name
      kanapDescription.innerHTML = jsonKanap.description
      kanapPrice.innerHTML = jsonKanap.price
      let options = ''
      jsonKanap.colors.forEach(
        color => (options += `<option value="${color}">${color}</option>`)
      )
      optionColor.innerHTML += options
      // on recupere les données non dynamique du produit pour peupler l'objet userSelection
      const productImage = jsonKanap.imageUrl
      userSelection.image = productImage
      const productName = jsonKanap.name
      userSelection.name = productName
    })
    .catch(_error => {
      document.querySelector('article').innerHTML =
        '<h1>vérifiez la connection au serveur, impossible de contacter le serveur</h1>'
    })
}

// une fonction pour ecouter et recuperer les données utilisateurs dans l'objet 'userSelection' declaré vide au début
const getUserSelection = () => {
  userSelection.id = id
  optionColor.addEventListener('change', event => {
    const colorSelected = event.target.value
    userSelection.color = colorSelected
  })
  document.getElementById('quantity').addEventListener('input', e => {
    const quantitySelected = e.target.value
    userSelection.quantity = parseFloat(quantitySelected)
  })
}

// une fonction pour gerer le bouton "ajouter au panier" en envoyant dans le LS les données utilisateurs
// et rediriger l'utilisateur vers sa page panier
const addToCart = () => {
  getUserSelection()
  const addToCartButton = document.querySelector('button')
  addToCartButton.addEventListener('click', () => {
    if (userSelection.color == null) {
      alert('Veuillez saisir une couleur SVP')
    } else if (
      userSelection.quantity == null ||
      userSelection.quantity <= 0 ||
      userSelection.quantity > 100
    ) {
      alert("Veuillez saisir un nombre d'article valide SVP")
    } else {
      cartManager.addToLocalStorage(userSelection)
      window.location.assign('cart.html')
    }
  })
}

const main = () => {
  displayKanap()
  addToCart()
}

main()
