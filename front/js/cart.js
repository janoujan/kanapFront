import { Cart } from './cartManager.js'

// création d'un objet avec la class Cart pour pouvoir utiliser les méthodes de cartManager
const cartManager = new Cart()

// une fonction pour afficher les totaux en utilisant les méthodes de cartManager
const displayTotal = async () => {
  document.getElementById('totalQuantity').innerHTML =
    await cartManager.getTotalQuantity()
  document.getElementById('totalPrice').innerHTML =
    await cartManager.getTotalPrice()
}

// une fonction pour afficher le panier
const displayCart = async () => {
  const cart = cartManager.getCartFromLocalStorage()
  let contentToLoad = ''
  for (const kanap of cart) {
    const kanapPrice = await cartManager.fetchKanapPrice(kanap.id)
    contentToLoad += `<article class="cart__item" data-id=${kanap.id} data-color=${kanap.color}>
                           <div class="cart__item__img">
                             <img src= ${kanap.image} alt="Photographie d'un canapé">
                           </div>
                           <div class="cart__item__content">
                             <div class="cart__item__content__description">
                                          <h2>${kanap.name}</h2>
                               <p>couleur : ${kanap.color}</p>
                               <p>prix unitaire : ${kanapPrice} </p>
                             </div>
                             <div class="cart__item__content__settings">
                               <div class="cart__item__content__settings__quantity">
                                 <p>Qté : </p>
                                 <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${kanap.quantity}">
                               </div>
                               <div class="cart__item__content__settings__delete">
                                 <p class="deleteItem">Supprimer</p>
                               </div>
                             </div>
                            </div>
                        </article>`
  }
  document.querySelector('#cart__items').innerHTML = contentToLoad
  itemQuantityListener()
  deleteItemListener()
}

// une fonction pour écouter chaque input quantité et modifier les totaux
const itemQuantityListener = () => {
  document.querySelectorAll('.itemQuantity').forEach(inputQuantity => {
    inputQuantity.addEventListener('change', e => {
      cartManager.changeQuantity({
        quantity: parseInt(e.target.value),
        id: e.target.closest('.cart__item').dataset.id,
        color: e.target.closest('.cart__item').dataset.color
      })
      if (parseFloat(e.target.value) === 0) {
        e.target.closest('.cart__item').remove()
      }
      displayTotal()
    })
  })
}

// une fonction pour écouter chaque bouton deleteItem et retirer le produit du panier
const deleteItemListener = () => {
  const deleteKanaps = document.getElementsByClassName('deleteItem')
  for (const deletekanap of deleteKanaps) {
    deletekanap.addEventListener('click', e => {
      cartManager.removeFromLocalStorage({
        id: e.target.closest('.cart__item').dataset.id,
        color: e.target.closest('.cart__item').dataset.color
      })
      displayTotal()
      e.target.closest('.cart__item').remove()
    })
  }
}

// une fonction pour écouter et vérifier les inputs du formulaire
const verifyFormInput = () => {
  const regexLettersOnly = '^[a-zA-Záàâäãåçéèêëíìîïñóòôöõúùûüýÿæœ\\-\\s]{1,31}$'
  const regexAddress = '^.{5,120}$'
  const regexEmail = '^[a-z0-9._+-/]+@[a-z0-9._-]{2,}\\.[a-z]{2,7}$'
  // une boucle pour gérer les inputs où seul les lettres sont acceptées
  const inputsNoNumbers = [
    document.getElementById('firstName'),
    document.getElementById('lastName'),
    document.getElementById('city')
  ]
  inputsNoNumbers.forEach(currentInput => {
    currentInput.setAttribute('pattern', regexLettersOnly)
    const id = currentInput.getAttribute('id')
    currentInput.addEventListener('input', e => {
      if (e.target.checkValidity() === false) {
        document.querySelector(`#${id}ErrorMsg`).innerHTML =
          'par sécurité, vous ne pouvez entrer que des lettres'
        currentInput.style.backgroundColor = '#fbbcbc'
      } else {
        document.querySelector(`#${id}ErrorMsg`).innerHTML = ''
        currentInput.style.backgroundColor = '#fff'
      }
    })
  })
  // maintenant on gère les adresses avec regexAddress
  const address = document.getElementById('address')
  address.setAttribute('pattern', regexAddress)
  address.addEventListener('input', e => {
    if (e.target.checkValidity() === false) {
      document.querySelector('#addressErrorMsg').innerHTML =
        'trop court pour une adresse'
      address.style.backgroundColor = '#fbbcbc'
    } else {
      document.querySelector('#addressErrorMsg').innerHTML = ''
      address.style.backgroundColor = '#fff'
    }
  })
  // ici on gère les email avec regexEmail
  const email = document.getElementById('email')
  email.setAttribute('pattern', regexEmail)
  email.addEventListener('input', e => {
    if (e.target.checkValidity() === false) {
      document.querySelector('#emailErrorMsg').innerHTML =
        'il manque des caractères dans votre email'
      email.style.backgroundColor = '#fbbcbc'
    } else {
      document.getElementById('emailErrorMsg').innerHTML = ''
      email.style.backgroundColor = '#ffff'
    }
  })
}

// une fonction pour récupérer le id des produits du panier pour le POST
const getProductIdFromCart = () => {
  const productIdList = cartManager.getCartFromLocalStorage()
  return productIdList.length > 0 ? productIdList.map(item => item.id) : []
}

// une fonction pour valider et poster les données du formulaire
const formCheckAndPost = () => {
  document
    .querySelector('.cart__order__form__submit')
    .addEventListener('click', e => {
      e.preventDefault()
      const valid = document
        .querySelector('.cart__order__form')
        .reportValidity()
      if (valid) {
        fetch('https://kanapbackend.onrender.com/api/products/order', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            contact: {
              firstName: document.getElementById('firstName').value,
              lastName: document.getElementById('lastName').value,
              address: document.getElementById('address').value,
              city: document.getElementById('city').value,
              email: document.getElementById('email').value
            },
            products: getProductIdFromCart()
          })
        })
          .then(res => res.json())
          .then(data => {
            window.location.href = `confirmation.html?orderId=${data.orderId}`
            window.localStorage.clear()
          })
      } else {
        alert("le formulaire de contact n'est pas valide")
      }
    })
}

const main = () => {
  displayCart()
  displayTotal()
  verifyFormInput()
  formCheckAndPost()
}
main()
