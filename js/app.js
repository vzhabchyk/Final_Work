'use strict';

const appContainer = document.getElementById('app');
const routes = {
  '/': 'main.html',
  '/cart': 'cart.html',
  '/shop': 'category.html',
  '/product': 'single-product.html',
  '/contact': 'contact.html',
};

// Подгружает

function getTemplate (template, data) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    appContainer.innerHTML = _.template(xhr.responseText)(data);
  }
  xhr.open('GET', './templates/' + template, true);
  xhr.send();
}

getTemplate('main.html', {items:data});

function navigateTo(event) {
  console.log(event);
  event.preventDefault();

  let href = '';
  if (event.target.tagName === 'I') {
    href = event.target.parentNode.getAttribute('href');
  } else {
    href = event.target.getAttribute('href');
  }

  let templateData = data;

  if (href.startsWith('/shop')) {
    const url = href.split('?');
    href = url[0];
    const searchParams = new URLSearchParams(url[1]);
    const material = searchParams.get('material');
    const color = searchParams.get('color');
    if (material) {
      templateData = _.filter(templateData, function(item) {
        return item.material === material;
      });
    }
    if (color) {
      templateData = _.filter(templateData, function(item) {
        return item.color === color;
      });
    }
  } else if (href.startsWith('/cart')) {
    let cartList = localStorage.getItem('cart');
    if (cartList) {
      templateData = JSON.parse(cartList);
    } else {
      templateData = [];
    }
  }

  const template = routes[href];

  getTemplate(template, {items:templateData});
  window.history.pushState({}, '', href);
}``

window.addEventListener('popstate', function(event) {
  console.log(event);
  const href = event.target.location.pathname;
  const template = routes[href];

  getTemplate(template);
});

function showProduct(event) {
  const id = +event.target.getAttribute('data-id');
  const product = data.find(function(item) {
    return item.id === id;
  });
  let reviews = localStorage.getItem('reviews-' + id);
  if (reviews) {
    reviews = JSON.parse(reviews);
  } else {
    reviews = [];
  }
  product.items = reviews;
  getTemplate('single-product.html', product);
}

function addToCart(event) {
  event.preventDefault();
  event.stopPropagation();

  const idTarget = +event.target.getAttribute('data-id');
  let cartList = localStorage.getItem('cart');

  if (cartList) {
    cartList = JSON.parse(cartList);
  } else {
    cartList = [];
  }

  const productIndex = cartList.findIndex(function(item) {
    return item.id === idTarget;
  }) 

  if (productIndex !== -1) {
    cartList[productIndex].count += 1;
  } else {
    const {id, name, price, imgUrl} = data.find(function(item) {
      return item.id === idTarget;
    });
    cartList.push({
      id,
      name,
      price,
      imgUrl,
      count: 1
    })
    }

  localStorage.setItem('cart', JSON.stringify(cartList));
}

function changeCartCount(event) {
  console.log(event)
  const id = +event.target.getAttribute('data-id');
  const dataAction = event.target.getAttribute('data-action');
  let cartList = localStorage.getItem('cart');
  cartList = JSON.parse(cartList);

  const productIndex = cartList.findIndex(function(item) {
    return item.id === id;
  }) 

  if (dataAction === 'increment') {
    cartList[productIndex].count += 1;
  } else if (dataAction === 'decrement'){
    cartList[productIndex].count -= 1;
  }
  if (cartList[productIndex].count === 0) {
    cartList.splice(productIndex, 1);
    event.path[3].remove();
  } else {
    const countInputElement = event.target.parentNode.children[1];
    countInputElement.value = cartList[productIndex].count;

    const productSum = event.path[2].nextElementSibling.children[0];
    productSum.innerHTML ='$' + cartList[productIndex].count * cartList[productIndex].price;
  }

  const cartTotal = document.getElementsByClassName('cart-total')[0];
    cartTotal.innerHTML = '$' + _.sumBy(cartList, function(item) { return item.price*item.count; });

  localStorage.setItem('cart', JSON.stringify(cartList));
}

function proceedToCheckout(event) {
  event.preventDefault();
  let cartList = localStorage.getItem('cart');
  cartList = JSON.parse(cartList);
  getTemplate('checkout.html', {items:cartList});
}

function validateForm (formElements) {
  console.log(formElements);
  const error = document.getElementsByClassName('error')[0];
  if (!formElements.name.value.match(/[A-Z]{1}[a-z]+/)) {
    error.innerText = 'Name should contain only letters!';
    return false;
  }
  if (!formElements.email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)) {
    error.innerText = 'Email is not valid!'
    return false;
  }
  if (!formElements.phoneNumber.value.match(/^\+380[0-9]{9}$/)) {
    error.innerText = 'Phone number is not valid!'
    return false;
  }
  error.innerText = '';
  return true;
}

function proceedOrder (event) {
  event.preventDefault();
  const formElements = document.forms[0].elements;
  const formValid = validateForm(formElements);
  if (formValid) {
    showModal();
    document.getElementsByClassName('contact_form')[0].reset();
    localStorage.setItem('cart', []);
  }

}

function showModal () {

  document.getElementById('modal-text').innerText = `
  Your order is accepted.
  `;

  const modal = document.getElementById('modal');
  modal.style.display = 'block';
  setTimeout( function() {
    modal.style.display = 'none';
  }, 2000);
}

function addReview (event) {
  const id = +event.target.getAttribute('data-id');
  let reviews = localStorage.getItem('reviews-' + id);
  if (reviews) {
    reviews = JSON.parse(reviews);
  } else {
    reviews = [];
  }
  const formElements = document.forms[0].elements;
  const review = {
    name: formElements.name.value,
    email: formElements.email.value,
    number: formElements.number.value,
    message: formElements.message.value,
    imageUrl: `images/reviews/review-${_.random(1,3)}.png`
  };
  reviews.push(review);
  localStorage.setItem('reviews-' + id, JSON.stringify(reviews));

  document.getElementsByClassName('contact_form')[0].reset();

  const container = document.getElementsByClassName('review_list')[0];
  const reviewElement = document.createElement('div');

  reviewElement.classList.add('review_item');
  reviewElement.innerHTML = `
    <div class="media">
      <div class="d-flex">
        <img src="${review.imageUrl}" alt="" />
      </div>
      <div class="media-body">
        <h4>${review.name}</h4>
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
        <i class="fa fa-star"></i>
      </div>
    </div>
    <p>
      ${review.message}
    </p>
  `;
  container.appendChild(reviewElement);
}
