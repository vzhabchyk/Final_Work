const appContainer = document.getElementById('app');

function getTemplate () {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    appContainer.innerHTML = xhr.responseText;
  }
  xhr.open('GET', './templates/main.html', true);
  xhr.send();
}

getTemplate();