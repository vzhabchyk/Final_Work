'use strict';

const appContainer = document.getElementById('app');
const routes = {
  '/': 'main.html',
  '/cart': 'cart.html',
  '/shop': 'category.html',
  '/product': 'single-product.html'
};

function getTemplate (template) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    appContainer.innerHTML = xhr.responseText;
  }
  xhr.open('GET', './templates/' + template, true);
  xhr.send();
}

getTemplate('main.html');

function navigateTo(event) {
  console.log(event);
  event.preventDefault();

  let href = '';
  if (event.target.tagName === 'I') {
    href = event.target.parentNode.getAttribute('href');
  } else {
    href = event.target.getAttribute('href');
  }

  const template = routes[href];

  getTemplate(template);
  window.history.pushState({}, '', href);
}

window.addEventListener('popstate', function(event) {
  const href = event.target.location.pathname;
  const template = routes[href];

  getTemplate(template);
});



