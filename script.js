const searchResultContainer = document.getElementById("search-result");
const inputField = document.getElementById("song-name-input");
const submitBtn = document.getElementById("submit");
let loaderHtml = `
        <div class="text-center">
          <p><span class="spinner-border"></span></p>
          <p>loading...</p>
        </div>
        `;
let lyricsHtml = "";
let lyrics = "";
let lyricsDiv = document.createElement("div");
let previewDiv = document.createElement("div");
let lyricsContainer = "";
// finding the songs
function findingSong() {
  const searchedSong = inputField.value;
  fetch(`https://api.lyrics.ovh/suggest/${searchedSong}`)
    .then((response) => response.json())
    .then((data) => displaySong(data))
    .catch((err) => alert(err));
  inputField.value = "";
  inputField.focus();
}
submitBtn.addEventListener("click", findingSong);
inputField.addEventListener("keypress", () => {
  if (event.keyCode === 13) {
    findingSong();
  }
});

// display 10 songs info in the view
const displaySong = (data) => {
  searchResultContainer.innerHTML = "";
  const songList = data.data;
  songList.map((data, index) => {
    if (index <= 9) {
      const songInfo = `
        <div class="search-result col-md-8 mx-auto text-center text-md-left" id="song-div-${index}">
          <div class="single-result row align-items-center my-3 p-3">
            <div class="col-md-9">
              <h3 class="lyrics-name">${data.title}</h3>
              <p class="author lead">Album by <span>${data.artist.name}</span></p>
              <button class="btn btn-warning my-2 my-md-0" id="preview-${index}">preview</button>
              <a  target="_blank" class="btn btn-info" href="${data.link}">full song</a>
            </div>
            <div class="col-md-3 text-md-right text-center">
              <button class="btn btn-success lyrics-btn" id="btn-${index}">Get Lyrics</button>
            </div>
        </div>
          `;
      searchResultContainer.insertAdjacentHTML("beforeend", songInfo);
      let songDiv = document.getElementById(`song-div-${index}`);
      const artist = data.artist.name;
      const title = data.title;
      // preview event
      const previewBtn = document.getElementById("preview-" + index);
      const previewURL = data.preview;
      previewBtn.addEventListener("click", () => {
        previewDiv.innerHTML = "";
        lyricsDiv.innerHTML = "";
        songDiv.insertAdjacentElement("afterend", previewDiv);
        let previewContainer = `<div class="d-flex flex-column justify-content-center align-items-center">
                  <button class="btn cross-btn">&#x274C;</button>
        <iframe src="${previewURL}" frameborder="0"></iframe>
        </div>`;
        previewDiv.innerHTML = previewContainer;
        deleteNode();
      });

      // lyrics Display event
      const getLyricsButton = document.getElementById(`btn-${index}`);
      getLyricsButton.addEventListener("click", () => {
        lyricsDiv.innerHTML = "";
        previewDiv.innerHTML = "";
        songDiv.insertAdjacentElement("afterend", lyricsDiv);
        lyricsContainer = document.createElement("div");
        lyricsContainer.innerHTML = loaderHtml;
        lyricsDiv.insertAdjacentElement("beforeend", lyricsContainer);
        getLyrics(artist, title);
      });
    }
  });
};

// getting the lyrics
const getLyrics = async (artist, title) => {
  await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`)
    .then((res) => {
      if (res.status == "200") {
        return res.json();
      }
    })
    .then((data) => {
      lyrics = data.lyrics;
      lyricsHtml = `
    <div class="single-lyrics text-center">
        <h2 class="text-success mb-4">
          <span class="text-center">${title}</span>
          <button class="btn cross-btn">&#x274C;</button>
        </h2>
        <pre class="text-white text-center">${lyrics}</pre>
    </div>
        `;
      lyricsContainer = document.createElement("div");
      lyricsContainer.classList.add("col-12");
      lyricsContainer.innerHTML = lyricsHtml;
    })
    .catch(() => {
      let error = "No lyrics found.";
      lyrics = error;
      lyricsHtml = `
    <div class="single-lyrics text-center">
        <h2 class="text-success mb-4">
          <span class="text-center">${title}</span>
          <button class="btn cross-btn">&#x274C;</button>
        </h2>
        <pre class="text-white text-center">${lyrics}</pre>
    </div>
        `;
      lyricsContainer = document.createElement("div");
      lyricsContainer.classList.add("col-12");
      lyricsContainer.innerHTML = lyricsHtml;
    });
  lyricsDiv.innerHTML = "";
  lyricsDiv.insertAdjacentElement("beforeend", lyricsContainer);
  deleteNode();
};

function deleteNode() {
  const crossBtn = document.getElementsByClassName("cross-btn");
  for (let i = 0; i < crossBtn.length; i++) {
    const element = crossBtn[i];
    element.addEventListener("click", () => {
      event.target.parentElement.parentElement.remove();
    });
  }
}
