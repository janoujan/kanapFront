// création de la classe Cart
export class Cart {
  constructor () {
    const cart = localStorage.getItem('cart')
    if (cart === null) {
      this.cart = []
    } else {
      this.cart = JSON.parse(cart)
    }
  }

  // récupération du panier depuis le LS
  getCartFromLocalStorage () {
    const cart = localStorage.getItem('cart')
    return cart === null ? [] : JSON.parse(cart)
  }

  // sauve le panier dans le LS
  saveToLocalStorage (cart) {
    localStorage.setItem('cart', JSON.stringify(cart))
  }

  /**
   * ajoute un produit dans le panier ou augmente sa quantité si il existe deja
   * @param {product} product l'objet du produit à ajouter doit avoir une id: une color: et une quantity: pour fonctionner
   */
  addToLocalStorage (product) {
    const cart = this.getCartFromLocalStorage()
    const foundKanap = cart.find(
      kanap => kanap.id === product.id && kanap.color === product.color
    )
    if (foundKanap != null) {
      foundKanap.quantity += product.quantity
      if (product.quantity > 100) {
        product.quantity = 100
      }
    } else {
      cart.push(product)
    }
    this.saveToLocalStorage(cart)
  }

  /**
   * une fonction pour supprimer un produit du panier
   * @param {product} product l'objet du produit à supprimer doit avoir une id: et une color: pour fonctionner
   */
  removeFromLocalStorage (product) {
    let cart = this.getCartFromLocalStorage()
    const kanapToDelete = cart.find(
      kanap => kanap.id === product.id && kanap.color === product.color
    )
    cart = cart.filter(p => p !== kanapToDelete)
    this.saveToLocalStorage(cart)
  }

  /**
   * change la quantite d'un produit dans le panier ou le supprimme si sa quantite <= 0
   * @param {product} product l'objet produit à ajouter doit avoir une id: une color: et une quantity: pour fonctionner
   */
  changeQuantity (product) {
    this.cart = this.getCartFromLocalStorage()
    const foundKanap = this.cart.find(
      kanap => kanap.id === product.id && kanap.color === product.color
    )
    foundKanap.quantity = product.quantity
    if (foundKanap.quantity <= 0) {
      this.cart = this.cart.filter(
        kanap => kanap.id !== product.id || kanap.color !== product.color
      )
    }
    this.saveToLocalStorage(this.cart)
  }

  /**
   * retourne le prix d'un produit selon son Id
   * @param {productId}  Number l'id du produit à appeler
   * @returns Number  retourne le prix du produit appelé
   */
  fetchKanapPrice (kanapId) {
    let price = fetch(
      `https://kanapback-382417.oa.r.appspot.com/api/products/${kanapId}`
    )
      .then(function (response) {
        if (response.ok) {
          return response.json()
        }
      })
      .then(function (value) {
        price = value.price
        return price
      })
      .catch(new Error('impossible de contacter le serveur'))
    return Promise.resolve(price)
  }

  // renvoie la quantité total de produits
  getTotalQuantity () {
    const cart = this.getCartFromLocalStorage()
    let number = 0
    for (const kanap of cart) {
      number += kanap.quantity
    }
    return number
  }

  // renvoie le prix total
  async getTotalPrice () {
    const cart = this.getCartFromLocalStorage()
    let total = 0
    for (const kanap of cart) {
      const price = await this.fetchKanapPrice(kanap.id)
      total += kanap.quantity * price
    }
    return total
  }
}
