const API_KEY = 'Coi2ftZfDu9tz8s5eVYWdaAnZN594eZs';
// here we grab our 'search-input' and 'hintEl'
const searchEl = document.querySelector('.search-input');
const hintEl = document.querySelector('.search-hint');
//grab out videos element and add our newly created video to it
const videosEl = document.querySelector('.videos');
//clear search function
const clearEl = document.querySelector('.search-clear');

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

const createVideo = src => {
  // '.createElement' lets us create HTML elements inside JS
  const video = document.createElement('video');
  //set attributes to our video using dot notation
  video.src = src;
  video.muted = true;
  video.autoplay = true;
  video.loop = true;
  //sets the class name using JS - overwrites them though
  video.className = 'video';
  //we 'return' is used, it tells the function to give us something back
  return video;
};

const toggleLoading = state => {
  //toggle the page loading state between on and off
  if (state) {
    document.body.classList.add('loading');
    //disables search input while it's searching
    searchEl.disable = true;
  } else {
    document.body.classList.remove('loading');
    //reenables the search input
    searchEl.disable = false;
    searchEl.focus();
  }
};

//wrap up all of the fetch functionality into its own function
const searchGiphy = searchTerm => {
  //toggle loading screen
  toggleLoading(true);
  console.log('search for', searchTerm);
  //backticks used to embed our API_KEY and searchTerm variables
  //searchTerm part will be different for each varying search made
  fetch(
    `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${searchTerm}&limit=50&offset=0&rating=PG-13&lang=en`
  )
    .then(response => {
      //converting our response to json
      return response.json();
    })
    //use '.then()'again to handle the json data'
    .then(json => {
      //call randomChoice function to give back a random result
      //from the array of images
      const gif = randomChoice(json.data);
      //grabs the original mp4 src within the first result
      const src = gif.images.original.mp4;
      //logs data so we can work with it
      console.log(src);
      //here we use the 'createVideo' function, which is given the 'src'
      //attribute. it gives us back a video element
      const video = createVideo(src);

      //'.appendChild' inserts element add the end of our HTML
      videosEl.appendChild(video);
      //listen out for the video loaded event to fire
      video.addEventListener('loadeddata', event => {
        //toggles the fading in effect of the videos
        video.classList.add('visible');
        //toggles the loading state off
        toggleLoading(false);
        //add 'has-results' class to toggle the close button
        document.body.classList.add('has-results');
        //changes hint text to 'see more results'
        hintEl.innerHTML = `Hit enter to search more ${searchTerm}`;
      });
    })
    //use '.catch()' to do something in case our fetch fails
    .catch(error => {
      toggleLoading(false);
      hintEl.innerHTML = `Nothing found for ${searchTerm}`;
    });
};

//here we seperate the 'keyup' function so it can be called in
//different places in our code
const doSearch = event => {
  const searchTerm = searchEl.value;
  //set the search hint
  if (searchTerm.length > 2) {
    //here we set the text to embed our variable as the hint suggestion
    hintEl.innerHTML = `Hint enter to search ${searchTerm}`;
    //here we add a class to our body tag ans ude it to show our hint
    //using CSS
    document.body.classList.add('show-hint');
  } else {
    //otherwise we remove it
    document.body.classList.remove('show-hint');
  }

  //only run search when there is a search term longer than 2
  // characters, and only when they press the enter key
  if (event.key === 'Enter' && searchEl.value.length > 2) {
    //call to our searchGiphy function and pass along the searchTerm
    searchGiphy(searchTerm);
  }
};

const clearSearch = event => {
  //toggle off the result status
  document.body.classList.remove('has-results');
  //resets the content
  videosEl.innerHTML = '';
  hintEl.innerHTML = '';
  searchEl.value = '';
  //focus's the cursor back to our input position
  searchEl.focus();
};

//if the user presses the escape key. the clearSearch function runs
document.addEventListener('keyup', event => {
  if (event.key === 'Escape') {
    clearSearch();
  }
});

//event listeners
searchEl.addEventListener('keyup', doSearch);
clearEl.addEventListener('click', clearSearch);
