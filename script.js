function hasPaywall() {
  return document.getElementsByClassName('js-paywall').length !== 0;
}

async function getContent() {
  const url = encodeURIComponent(window.location.href)
  let response = await fetch(`https://outlineapi.com/v3/parse_article?source_url=${url}`);
  let data = await response.json()
  return data.data.html;
}

function showLoading() {
  var popup = document.createElement('div');
  popup.className += 'popup-loading'
  popup.innerHTML = '<div class="loading-text"><div class="loader">Loading...</div><p>Loading Premium Article</p></div>';
  const content = document.getElementsByClassName('section-content')[0]
  content.innerHTML = ''
  content.prepend(popup);
  removePaywall();
}

function filterHTML(html) {
  const figures = html.querySelectorAll('figure');
  const length = figures.length;

  for(var i = 0; i < figures.length; i++) {
    if (figures[i].getElementsByTagName('figcaption').length === 0) {
      figures[i].remove();
    }
  }
}

function removePaywall() {
  document.getElementsByClassName('js-paywall')[0].remove();
}


function replaceArticle() {
  if (hasPaywall()) {
    showLoading();
    getContent().then(data => {
      let contained = `<div class=container-outline>${data}</div>`
      var parser = new DOMParser();
      var htmlDoc = parser.parseFromString(contained, 'text/html');
      filterHTML(htmlDoc);
      document.getElementsByClassName('section-content')[0].innerHTML = `${htmlDoc.documentElement.innerHTML}`
    })
  }
}

replaceArticle()

document.onclick = function () {
  setTimeout(() => {
    replaceArticle();
  }, 2500);
}
