const url = `https://api.themoviedb.org/3/movie`;
const searchUrl = `https://api.themoviedb.org/3/search/movie`;
const imgUrl = `https://image.tmdb.org/t/p/original`;

const searchMultiUrl = `https://api.themoviedb.org/3/search/multi`;
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
// slide();

let movieList = [];
let searchList = [];

//모달 보이게
const scoreModal = () => {
  slide();
  document.querySelector("#modal").style.display = "block";
};

const closeModal = () => {
  document.querySelector("#modal").style.display = "none";
  document.querySelector("#score").value = ``;
};

const infoModalOpen = (movieId) => {
  document.querySelector("#infoModal").style.display = "block";
  movieInfo(movieId);
};

//모달 닫고 모달안에 있는 input 데이터 초기화
const scoreModalClose = () => {
  document.querySelector("#searchModal").style.display = "none";
  document.querySelector("#score").value = ``;
};
const infoModalClose = () => {
  document.querySelector("#infoModal").style.display = "none";
};

const makeMovieCard = (movieId, postImg, movieTitle, voteAverage, overView) => {
  const movieCard = document.createElement("div");

  movieCard.className = "movieCard";
  movieCard.addEventListener("click", () => infoModalOpen(movieId));
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

      sortByRating(voteAverage);
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

  searchParams ? clearCard() : alert("검색어를 입력해주세요");
  findMovie(searchParams);
};

const clearCard = () => {
  const cardList = document.querySelectorAll(`.movieCard `);

  cardList.forEach((element) => {
    element.remove();
  });
};

const findMovie = (searchParams) => {
  fetch(
    `${searchUrl}?query=${searchParams}&include_adult=false&language=ko-KR&page=1`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      response.results.map((res) => {
        let postImg = `${imgUrl}${res.poster_path}`;
        let movieTitle = res.title;
        let voteAverage = res.vote_average;
        let overView = res.overview;

        makeMovieCard(res.id, postImg, movieTitle, voteAverage, overView);
      });
    })
    .catch((err) => console.error(err));
};

const searchResults = async (searchParams) => {
  fetch(
    `${searchMultiUrl}?query=${searchParams}&include_adult=false&language=ko-KR&page=1`,
    options
  );
  let data = await response.json();
  searchList = await data.results; // 영화 검색을하면 검색 결과 요소들을 저장
  movieList = []; // 영화 검색결과를 보여주면서 메인에 있던 영화 리스트를 비워 줌

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

// 관람연령 가져오는 함수
const getMovieAge = (movieId) => {
  let age;
  return fetch(`${url}/${movieId}/release_dates`, options)
    .then((response) => response.json())
    .then((response) => {
      response.results.map((res) => {
        switch (res.iso_3166_1) {
          case "KR":
            if (!age) {
              age = res.release_dates[0].certification;
            }
            console.log("KR:", age);
            return age;
            break;

          case "US":
            if (!age) {
              age = res.release_dates[0].certification;
            }
            console.log("US:", age);
            return age;
            break;
          default:
            break;
        }
        console.log(age);
      });
      return age;
    })
    .catch((err) => console.log(err));
};

// 장르 가져오는 함수
const movieGenres = (genres) => {
  let genresArray = [];

  genres.map((data) => {
    genresArray = [...genresArray, data.name];
  });
  genresArray.join(`,`);
  document.querySelector(`.tabContent .movieGenres span`).textContent =
    genresArray;
};

// 배우 및 감독 정보 가져오는 함수
const getMovieCredits = (movieId) => {
  return fetch(`${url}/${movieId}/credits?language=ko-KR`, options)
    .then((response) => response.json())
    .then((response) => {
      response.cast.map((data) => {
        // console.log(document.querySelector(`.tabContent .movieGenres span`))
        // document.querySelector(`.tabContent .movieGenres span`).textContent = data.name
      });
    })
    .catch((err) => console.error(err));
};

const movieInfo = (movieId) => {
  fetch(`${url}/${movieId}?language=ko-KR&page=1`, options)
    .then((response) => response.json())
    .then(async (response) => {
      console.log(response);
      let postImg = `${imgUrl}${response.poster_path}`;
      let movieTitle = response.title;
      let voteAverage = response.vote_average;
      let overView = response.overview;
      let runTime = `${Math.floor(response.runtime / 60)}시간 ${
        response.runtime % 60
      }분`;
      let movieDate = `개봉일 : ${response.release_date}`;
      let movieAge = await getMovieAge(movieId);
      // let movieGenres = response.genres;
      movieGenres(response.genres);
      getMovieCredits(movieId);

      document.querySelector(`.movieInfo > .moviePoster > img`).src = postImg;
      document.querySelector(
        `.movieInfo .movieContent .movieTitle`
      ).textContent = movieTitle;
      document.querySelector(
        `.movieInfo .movieSubInfo .movieDate`
      ).textContent = movieDate;
      document.querySelector(
        `.movieInfo .movieSubInfo .movieRuntime`
      ).textContent = runTime;
      document.querySelector(`.movieInfo .movieSubInfo .movieAge`).textContent =
        movieAge;
      document.querySelector(`.movieInfo .movieContent .overView`).textContent =
        overView;
      document.querySelector(`.movieInfo .movieSubInfo .movieAge`).textContent =
        movieAge;
      console.log(movieAge);
      // response.map((res) => {
      //

      // })

      const tabList = document.querySelectorAll(`.tabList`);
      const tabContent = document.querySelectorAll(`.tabContent`);

      console.log(tabList);
      tabList.forEach((tab, idx) => {
        tab.addEventListener("click", () => {
          tabContent.forEach((content) => {
            content.classList.remove(`active`);
          });
          tabList.forEach((list) => {
            list.classList.remove(`active`);
          });
          tabList[idx].classList.add(`active`);
          tabContent[idx].classList.add(`active`);
        });
      });
    })
    .catch((err) => console.error(err));
};

// const tabList = document.querySelectorAll(`.tabList`)
// const tabContent = document.querySelectorAll(`.tabContent`)

// console.log(tabList)
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
