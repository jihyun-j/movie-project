const url = `https://api.themoviedb.org/3/movie`;
const searchMultiUrl = `https://api.themoviedb.org/3/search/multi`;
const imgUrl = `https://image.tmdb.org/t/p/original`;
const emptyImg = `https://s3-us-west-1.amazonaws.com/files.delesign/assets/Not-Found-1.svg`; // image가 null 일때

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZmMyZGZhZDQ3YThlZDRmMWUwYWQxYjc1MGVhMzBhMSIsInN1YiI6IjY1MzA5NGQ3YWVkZTU5MDE0YzM4MDBjZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.F6qLqVKcX12Lxl8WUe5P3sDfhlIdJ44DaMgj0Dvuq1M",
  },
};

window.addEventListener("load", () => {
  document.querySelector(`#search`).focus();
});
let movieList = [];

const scoreModal = () => {
  document.querySelector("#modal").style.display = "block";
};
const closeModal = () => {
  document.querySelector("#modal").style.display = "none";
  document.querySelector("#score").value = ``;
};

const makeMovieCard = (movieId, postImg, movieTitle, voteAverage, overView) => {
  const movieCard = document.createElement("div");

  // 영화 title이 undefined로 나올때 name을 보여준다
  // 영화 포스터가 없을 때 다른 이미지를 보여준다
  movieCard.className = "movieCard";
  movieCard.addEventListener("click", () => alert(`Movie id : ${movieId}`));
  movieCard.innerHTML = `<div class="moviePoster">
								<img src=${postImg === null ? emptyImg : postImg} alt="">
							</div>
							<div class="movieTitle">${movieTitle}</div> 
							<div class="voteAverage" >🍅 : <span id="voteAverage">${voteAverage}</span></div>
							<div class="overView">${overView}</div>`;

  return document.querySelector("#movieList").appendChild(movieCard);
};

//영화 리스트
fetch(`${url}/popular?language=ko-KR&page=1`, options)
  .then((response) => response.json())
  .then((response) => {
    movieList = response.results;
    response.results.map((res) => {
      let postImg =
        res.poster_path === null ? emptyImg : ` ${imgUrl}${res.poster_path}`;
      let movieTitle = res.title;
      let movieName = res.name;
      let voteAverage = res.vote_average;
      let overView = res.overview;

      makeMovieCard(
        res.id,
        postImg,
        movieTitle,
        movieName,
        voteAverage,
        overView
      );
    });
  })
  .catch((err) => console.error(err));

// 영화 검색
const enterKey = (event) => {
  if (event.keyCode === 13) {
    searchQuery();
  }
};

const searchQuery = () => {
  const searchParams = document.querySelector("#search").value;
  document.querySelector("#score").value = ``;
  searchParams ? clearCard() : alert("검색어를 입력해주세요");

  searchResults(searchParams);
};

const scoreSearch = () => {
  const inputScore = document.querySelector("#score").value;
  const scoreCheck = document.querySelector(
    "#scoreCheck > option:checked"
  ).value;

  const scoreFilter = movieList;

  clearCard();
  closeModal();

  scoreFilter.filter((res) => {
    let score = res.vote_average;
    let movieId = res.id;
    let postImg =
      res.poster_path === null ? emptyImg : ` ${imgUrl}${item.poster_path}`;
    let movieTitle = res.title;
    let overView = res.overview;

    switch (scoreCheck) {
      case "up":
        if (score >= inputScore) {
          makeMovieCard(movieId, postImg, movieTitle, score, overView);
        }
        break;
      case "down":
        if (score <= inputScore) {
          makeMovieCard(movieId, postImg, movieTitle, score, overView);
        }
        break;
    }
  });
};

const clearCard = () => {
  const cardList = document.querySelectorAll(`.movieCard `);
  cardList.forEach((element) => {
    element.remove();
  });
};

const searchResults = (searchParams) => {
  fetch(
    `${searchMultiUrl}?query=${searchParams}&include_adult=false&language=ko-KR&page=1`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      response.results.map((item) => {
        if (item.media_type === "movie") {
          let postImg =
            item.poster_path === null
              ? emptyImg
              : ` ${imgUrl}${item.poster_path}`;
          let movieTitle = item.title;
          let voteAverage = item.vote_average;
          let overView = item.overview;

          makeMovieCard(item.id, postImg, movieTitle, voteAverage, overView);
        } else if (item.media_type === "person") {
          let knownFor = item.known_for;
          console.log(knownFor);

          knownFor.filter((item) => {
            let postImg =
              item.poster_path === null
                ? emptyImg
                : ` ${imgUrl}${item.poster_path}`;
            let movieTitle = item.title;
            let voteAverage = item.vote_average.toFixed(2);
            let overView = item.overview;

            makeMovieCard(item.id, postImg, movieTitle, voteAverage, overView);
          });
        }
      });
    })
    .catch((err) => console.error(err));
};
