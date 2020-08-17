const searchResultContainer = document.getElementById("search-result");
const inputField = document.getElementById("song-name-input");
const submitBtn = document.getElementById("submit");
let lyricsHtml = "";
let lyrics = "";
function findingSong() {
  const searchedSong = inputField.value;
  fetch(`https://api.lyrics.ovh/suggest/${searchedSong}`)
    .then((response) => response.json())
    .then((data) => display(data))
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

function display(data) {
  const songList = data.data;
  songList.map((data, index) => {
    if (index <= 9) {
      const songInfo = `
        <div class="search-result col-md-8 mx-auto">
          <div class="single-result row align-items-center my-3 p-3">
            <div class="col-md-9">
              <h3 class="lyrics-name">${data.title}</h3>
              <p class="author lead">Album by <span>${data.artist.name}</span></p>
            </div>
            <div class="col-md-3 text-md-right text-center">
              <button class="btn btn-success lyrics-btn" id="btn-${index}">Get Lyrics</button>
            </div>
        </div>
          `;
      searchResultContainer.insertAdjacentHTML("beforeend", songInfo);
      const lyricsButton = document.getElementById(`btn-${index}`);
      const artist = data.artist.name;
      const title = data.title;
      lyricsButton.addEventListener("click", () => {
        getLyrics(artist, title);
        let lyricsContainer = document.createElement("div");
        lyricsContainer.innerHTML = lyricsHtml;
        event.target.parentElement.parentElement.appendChild(lyricsContainer);
      });
    }
  });
}

const getLyrics = async (artist, title) => {
  await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`)
    .then((res) => res.json())
    .then((data) => {
      lyrics = data.lyrics;
    })
    .catch((err) => {
      lyrics = err.error;
    });
  lyricsHtml = `
    <div class="single-lyrics text-center">
        <button class="btn go-back">&lsaquo;</button>
        <h2 class="text-success mb-4">
          <span>${title}</span>
          <span>&#x274C;</span>
        </h2>
        <pre>${lyrics}</pre>
    </div>
        `;
};
