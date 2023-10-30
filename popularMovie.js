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
let searchList = [];

const scoreModal = () => {
  document.querySelector("#modal").style.display = "block";
};

const closeModal = () => {
  document.querySelector("#modal").style.display = "none";
  document.querySelector("#score").value = ``;
};

const makeMovieCard = (movieId, postImg, movieTitle, voteAverage, overView) => {
  const movieCard = document.createElement("div");

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

const searchResults = async (searchParams) => {
  let response = await fetch(
    `${searchMultiUrl}?query=${searchParams}&include_adult=false&language=ko-KR&page=1`,
    options
  );
  let data = await response.json();
  searchList = data.results; // 영화 검색을하면 검색 결과 요소들을 저장
  movieList = []; // 영화 검색결과를 보여주면서 메인에 있던 영화 리스트를 비워 줌

  console.log(searchList);
  clearCard();

  searchList.forEach((movie) => {
    switch (movie.media_type) {
      case "movie":
        let movieId = movie.id;
        let movieTitle = movie.title;
        let voteAverage = movie.vote_average;
        let postImg =
          movie.poster_path === null
            ? emptyImg
            : `${imgUrl}${movie.poster_path}`;
        let overView = movie.overview;

        makeMovieCard(movieId, postImg, movieTitle, voteAverage, overView);
        break;

      case "person":
        searchList = movie.known_for;
        searchList.forEach((item) => {
          let movieId = item.id;
          let media_type = item.media_type;

          console.log(media_type);
          let movieTitle = item.title;
          let voteAverage = item.vote_average.toFixed(2);
          let postImg =
            item.poster_path === null
              ? emptyImg
              : `${imgUrl}${item.poster_path}`;
          let overView = item.overview;

          if (item.media_type === "movie") {
            makeMovieCard(movieId, postImg, movieTitle, voteAverage, overView);
          } else if (item.media_type === "tv") {
            return;
          }
        });
        break;
    }
  });
};

/// 각 Sort 버튼 클릭 후 카드 리셋과 재정렬
const sortCards = (movie_List) => {
  clearCard();

  if (movie_List === searchList) {
    searchList.forEach((res) => {
      switch (res.media_type) {
        case "movie":
          let postImg =
            res.poster_path === null ? emptyImg : `${imgUrl}${res.poster_path}`;
          let movieTitle = res.title;
          let voteAverage = res.vote_average;
          let overView = res.overview;

          makeMovieCard(res.id, postImg, movieTitle, voteAverage, overView);
          break;

        case "person":
          searchList = movie.known_for;

          searchList.forEach((item) => {
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
          break;
      }
    });
  } else if (movie_List === movieList) {
    movieList.forEach((res) => {
      let postImg =
        res.poster_path === null ? emptyImg : `${imgUrl}${res.poster_path}`;
      let movieTitle = res.title;
      let voteAverage = res.vote_average;
      let overView = res.overview;

      makeMovieCard(res.id, postImg, movieTitle, voteAverage, overView);
    });
  }
};

/// Sort by Released Date ///
let clickedReleasedDate = true;

const sortByReleasedYear = () => {
  clickedReleasedDate = !clickedReleasedDate;

  if (searchList.length !== 0) {
    searchList.sort((a, b) => {
      if (clickedReleasedDate) {
        return new Date(a.release_date) - new Date(b.release_date);
      } else {
        return new Date(b.release_date) - new Date(a.release_date);
      }
    });

    sortCards(searchList);
  } else if (movieList.length !== 0) {
    movieList.sort((a, b) => {
      if (clickedReleasedDate) {
        return new Date(a.release_date) - new Date(b.release_date);
      } else {
        return new Date(b.release_date) - new Date(a.release_date);
      }
    });

    sortCards(movieList);
  }
};

/// Sort by Movie Title ///
let clickedTitle = true;

const sortByTitle = () => {
  clickedTitle = !clickedTitle;

  if (searchList.length !== 0) {
    searchList.sort((a, b) => {
      if (clickedTitle) {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
    sortCards(searchList);
  } else if (movieList.length !== 0) {
    movieList.sort((a, b) => {
      if (clickedTitle) {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
    sortCards(movieList);
  }
};

/// Sort by Rating ///
let clickedRating = true;

const sortByRating = () => {
  clickedRating = !clickedRating;

  if (searchList.length !== 0) {
    searchList.sort((a, b) => {
      if (clickedRating) {
        return a.vote_average - b.vote_average;
      } else {
        return b.vote_average - a.vote_average;
      }
    });
    sortCards(searchList);
  } else if (movieList.length !== 0) {
    movieList.sort((a, b) => {
      if (clickedRating) {
        return a.vote_average - b.vote_average;
      } else {
        return b.vote_average - a.vote_average;
      }
    });
    sortCards(movieList);
  }
};
