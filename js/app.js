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
  getTemplate('single-product.html', product);
}

