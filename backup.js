const url = `https://api.themoviedb.org/3/movie`;
const searchMultiUrl = `https://api.themoviedb.org/3/search/multi`;
const imgUrl = `https://image.tmdb.org/t/p/original`;
const emptyImg = `https://s3-us-west-1.amazonaws.com/files.delesign/assets/Not-Found-1.svg`;

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
      let voteAverage = res.vote_average;
      let overView = res.overview;

      makeMovieCard(res.id, postImg, movieTitle, voteAverage, overView);
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
      movieList = response.results;

      clearCard();

      movieList.map((movie) => {
        console.log(movie);
        if (movie.media_type !== "tv") {
          let movieId = movie.id;
          let movieTitle = movie.title;
          let voteAverage = movie.vote_average;
          let postImg =
            movie.poster_path === null
              ? emptyImg
              : `${imgUrl}${movie.poster_path}`;
          let overView = movie.overview;

          makeMovieCard(movieId, postImg, movieTitle, voteAverage, overView);
        }
        if (movie.media_type === "person") {
          // let knownFor = movie.known_for;
          movieList = movie.known_for;
          movieList.forEach((item) => {
            let movieId = item.id;
            let movieTitle = item.title;
            let voteAverage = item.vote_average.toFixed(2);
            let postImg =
              item.poster_path === null
                ? emptyImg
                : `${imgUrl}${item.poster_path}`;
            let overView = item.overview;

            if (item.media_type === "movie") {
              makeMovieCard(
                movieId,
                postImg,
                movieTitle,
                voteAverage,
                overView
              );
            }
          });
        }
      });
    })
    .catch((err) => console.error(err));
};

/// 각 Sort 버튼 클릭 후 카드 리셋과 재정렬
const sortCards = (movieList) => {
  clearCard();

  movieList.forEach((res) => {
    let postImg =
      res.poster_path === null ? emptyImg : `${imgUrl}${res.poster_path}`;
    let movieTitle = res.title;
    let voteAverage = res.vote_average;
    let overView = res.overview;

    makeMovieCard(res.id, postImg, movieTitle, voteAverage, overView);
  });
};

/// Sort by Released Date ///
let clickedReleasedDate = true;

const sortByReleasedYear = () => {
  clickedReleasedDate = !clickedReleasedDate;

  let filteredMovie = movieList.filter((movie) => {
    return movie.media_type !== "tv";
  });

  console.log(filteredMovie);

  filteredMovie.sort((a, b) => {
    if (clickedReleasedDate) {
      return new Date(a.release_date) - new Date(b.release_date);
    } else {
      return new Date(b.release_date) - new Date(a.release_date);
    }
  });

  sortCards(movieList);
};

/// Sort by Movie Title ///
let clickedTitle = true;

const sortByTitle = () => {
  clickedTitle = !clickedTitle;

  movieList.sort((a, b) => {
    if (clickedTitle) {
      return a.title.localeCompare(b.title);
    } else {
      return b.title.localeCompare(a.title);
    }
  });

  sortCards(movieList);
};

/// Sort by Rating ///

let clickedRating = true;
const sortByRating = () => {
  clickedRating = !clickedRating;

  movieList.sort((a, b) => {
    if (clickedRating) {
      return a.vote_average - b.vote_average;
    } else {
      return b.vote_average - a.vote_average;
    }
  });

  sortCards(movieList);
};

// 슬라이드 기능
/*
fetch(
  "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=Ko-kr&page=1&sort_by=popularity.desc",
  options
)
  .then((response) => response.json())
  .then((response) => {
    const movie_list = response.results;
    movie_list.forEach((i) => {
      let image = i["backdrop_path"];
      let title = i["title"];
      let overview = i["overview"];

      let slidelist = ` 
      <div class="slidebox">
        <ul class="slidelist">
          <li class="slideitem">
              <img src="https://image.tmdb.org/t/p/w500${image}"alt="">
              <div class="movieInfo">
                <h1>${title}</h1>
                <p>${overview}</p>
              </div>
            </li>
        </ul>
      </div>
      `;

      let mainslide = document.querySelector(".slidelist");
      let temp_html = document.createElement("div");
      temp_html.innerHTML = slidelist;
      mainslide.append(temp_html);
    });
  })
  .catch((err) => console.error(err));
*/
