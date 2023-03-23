// affiche le numéro de commande
const searchParams = new URLSearchParams(document.location.search)
const orderId = searchParams.get('orderId')
if (orderId === null) {
  document.querySelector('.confirmation').innerHTML = '<p>commande invalide</p>'
} else {
  document.getElementById('orderId').innerHTML = `${orderId}`
  document.querySelector('.confirmation p').style.boxShadow =
    '0px 0px 22px 6px green'
}
