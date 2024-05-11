document.addEventListener("DOMContentLoaded", function() {
  var searchForm = document.getElementById('searchForm');
  var searchTxt = document.getElementById('searchTxt');
  var resultsList = document.getElementById('results');
  var resetButton = document.getElementById('resetButton');

  searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    var searchTerm = searchTxt.value.trim();
    if (searchTerm === '') return;

    searchWikipedia(searchTerm);
    searchTxt.value = ''; // Clear the input field after submitting
  });


  function searchWikipedia(searchTerm) {
    var api = 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=';
    var callbackName = 'jsonpCallback';
    var script = document.createElement('script');
    script.src = api + searchTerm + '&callback=' + callbackName;

    window[callbackName] = function(data) {
      var pages = data.query.pages;
      for (var key in pages) {
        if (pages.hasOwnProperty(key)) {
          var v = pages[key];
          var page = 'https://en.wikipedia.org/?curid=' + v.pageid;
          displayResult({ title: v.title, body: v.extract, page: page });
        }
      }
      delete window[callbackName];
      document.body.removeChild(script);
    };

    document.body.appendChild(script);
  }

  function displayResult(result) {
    var listItem = document.createElement('li.list-group-item');
    var link = document.createElement('a');
    link.href = result.page;
    link.target = '_blank';
    var title = document.createElement('h3');
    title.textContent = result.title;
    var body = document.createElement('p');
    body.textContent = result.body;

    link.appendChild(title);
    listItem.appendChild(link);
    listItem.appendChild(body);
    resultsList.appendChild(listItem);
  }
  
  function resetForm() {
    searchTxt.value = ''; // Clear the input field
    resultsList.innerHTML = ''; // Clear the displayed results
  }
});
