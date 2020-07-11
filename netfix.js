var api_key = "1aa1a11a";
// ^^INSERT YOUR API KEY HERE
// http://www.omdbapi.com/apikey.aspx
// select Account Type: Free

// Function to retrieve reviews from omdbapi
function retrieveReviews(title) {
  // replaces all spaces in title with underscores
  title = title.replace(/ /g, "_");

  // uses OMDb api to get ratings for the moves and TV shows
  // uses XML HTTP Request to get data from omdbapi.com
  var xhr = new XMLHttpRequest();
  var url = "https://www.omdbapi.com/?t=" + title + "&apikey=" + api_key;

  // initializes request
  xhr.open("GET", url);

  xhr.onload = function() {
    // parses response string into more manageable object format
    var response = JSON.parse(xhr.responseText);
    // initializes rating variables
    var rt_rating = "N/A";
    var imdb_rating = "N/A";
    var m_rating = "N/A";

    // extracts from response object
    if (response["imdbRating"] != null) {
      imdb_rating = response["imdbRating"];
    }
    if (response["Metascore"] != null) {
      m_rating = response["Metascore"];
    }

    try {
      var ratings = response["Ratings"];
      rt = ratings.filter(rating => rating.Source === "Rotten Tomatoes");
      rt_rating = rt[0].Value;
    }
    catch(err) {}

    // calls function to add review elements to web page
    addReviews(imdb_rating, rt_rating, m_rating);
  }
  xhr.onerror = function() {
    console.log("error");
  }
  // sends request to server
  xhr.send();

}

// Function to display reviews next to title
function addReviews(imdb_rating, rt_rating, m_rating) {
  const elements = document.getElementsByClassName('videoMetadata--container');
  element = elements[0];

  // imdb logo img and div for review
  const imdb_png = document.createElement("img");
	imdb_png.src = chrome.extension.getURL("images/imdb_logo.png");
	imdb_png.className = "imdbLogo";

  const imdb_div = document.createElement("div");
  imdb_div.style.width = "50px";
  imdb_div.style.height = "20px";
  imdb_div.style.color = "white";
  imdb_div.style.fontsize = "16px";
  imdb_div.style.textAlign = "center";
  imdb_div.innerHTML = imdb_rating;

  // rotten tomatoes logo img and div for review
  const rt_png = document.createElement("img");
  rt_png.src = chrome.extension.getURL("images/rt_logo.png");
	rt_png.className = "rtLogo";

  const rt_div = document.createElement("div");
  rt_div.style.width = "50px";
  rt_div.style.height = "20px";
  rt_div.style.color = "white";
  rt_div.style.fontsize = "16px";
  rt_div.style.textAlign = "center";
  rt_div.innerHTML = rt_rating;

  // metacritic logo img and div for review
  const m_png = document.createElement("img");
  m_png.src = chrome.extension.getURL("images/metacritic_logo.png");
	m_png.className = "mLogo";

  const m_div = document.createElement("div");
  m_div.style.width = "50px";
  m_div.style.height = "20px";
  m_div.style.color = "white";
  m_div.style.fontsize = "16px";
  m_div.style.textAlign = "center";
  m_div.innerHTML = m_rating;

  // appends the logo and div containing the rating from imdb, rotten tomatoes,
  // and metacritic respectively, to the videoMetadata--container
  element.appendChild(imdb_png);
  element.appendChild(imdb_div);

  element.appendChild(rt_png);
  element.appendChild(rt_div);

  element.appendChild(m_png);
  element.appendChild(m_div);
}

// Observe changes in the window to trigger extension
// MutationObserver listens to changes in the DOM and invokes the function that
// displays ratings for the viewer when the targetMutation occurs
let target = document.body;

let observer = new MutationObserver(function(mutations){
  let targetMutation = mutations.find(
    mutation => mutation.target.className === 'focus-trap-wrapper previewModal--wrapper detail-modal'
  );

  // Triggers when the preview modal is opened
  if (targetMutation) {
    let previewElements = document.getElementsByClassName('previewModal--section-header');
    let aboutTitleElement = previewElements[previewElements.length - 1];

    if (aboutTitleElement != null) {
      // extracts title from last previewModal--section-header and removes the "About "
      // this is the only place where the title of the movie can be reliably found
      let title = aboutTitleElement.textContent.split("About ")[1];
      retrieveReviews(title);
    }
  }
});
// defines elements that the MutationObserver observes
observer.observe(target, {
  subtree:true,
  attributes:true
});
