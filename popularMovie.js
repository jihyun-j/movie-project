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

//키보드 이벤트


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
	document.querySelector('#infoModal').style.display = 'none';
	clearActorCard()
}

document.addEventListener('DOMContentLoaded', function () {
    const infoModal = document.querySelector('#infoModal');

    infoModal.addEventListener('click', (event) => {
        if (event.target === infoModal) {
            infoModalClose(); // 모달을 닫는 함수 호출
        }
    });
    const exitKey = (event) => {
        if (event.key === 'Escape' || event.key === 'Esc') {
            infoModalClose();
        }
    }

    document.addEventListener('keyup', exitKey);
});
	
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
	.then(response => response.json())
	.then(response => {
		movieList = response.results;
		response.results.forEach((res) => {
			let postImg = !res.poster_path ? emptyImg : ` ${imgUrl}${res.poster_path}`;
			let movieTitle = res.title;
			let voteAverage = res.vote_average;
			let overView = res.overview;

			makeMovieCard(res.id, postImg, movieTitle, voteAverage, overView);
            
            sortByRating(voteAverage);
		})
  	})
  	.catch(err => console.error(err));


// 영화 검색
const enterKey = (event) => {
  if (event.keyCode === 13) {
    searchQuery();
  }
};

const searchQuery = () => {
  const searchParams = document.querySelector("#search").value;

  searchParams ? clearCard() : alert("검색어를 입력해주세요");
  searchResults(searchParams);
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

///
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


// 관람연령 가져오는 함수
const getMovieAge = (movieId) => {
	return fetch(`${url}/${movieId}/release_dates`, options)
	.then(response => response.json())
	.then(response => {
        let age
		response.results.forEach((res) => {
			switch (res.iso_3166_1) {
				case "KR":
					if (res.release_dates[res.release_dates.length - 1]) {
						age =  res.release_dates[res.release_dates.length - 1].certification;
					}
			
				case "US":
					if (!age) {
						age = res.release_dates[res.release_dates.length - 1].certification;
					}
				default:
			}
		})
		return age;
	})
	.catch(err => console.error(err));
}

// 장르 가져오는 함수
const movieGenres = (genres) => {
	const genresArray = genres.map(data => data.name)
	genresArray.join(`, `)
	document.querySelector(`.tabContent .movieGenres span`).textContent = genresArray

}

// 배우 및 감독 정보 가져오는 함수
const getMovieCredits = (movieId) => {
	return fetch(`${url}/${movieId}/credits?language=ko-KR`, options)
  .then(response => response.json())
  .then(response => {
    
    let directer = [];
    let actors = [];

    response.crew.forEach((crewList) => {
        if(crewList.department === "Directing") {
            directer.push( crewList.name)
        }
    })
    directer.join(', ')
    document.querySelector(`.tabContent .movieDirect span`).textContent = directer;

    response.cast.forEach((data) => {
		const profileImg = data.profile_path ? imgUrl + data.profile_path : emptyImg;
		makeActorCard(data.name, profileImg);
    })

}).catch(err => console.error(err));
}

const makeActorCard = (name, profileImg) =>{
    const actorBox = document.createElement('li');
    actorBox.className = 'actorBox';
    actorBox.innerHTML = `
    <img class = "actorImg" src="${profileImg}" alt="">
    <div class = "actorName">${name}</div>
    `
    return document.querySelector('.movieActors').appendChild(actorBox)
}
const clearActorCard = () =>{
	const actorBox = document.querySelectorAll('.actorBox')
	actorBox.forEach(actor => {
		actor.remove()
	})

}
const movieInfo = (movieId) => {
	fetch(`${url}/${movieId}?language=ko-KR&page=1`, options)
	  .then(response => response.json())
	  .then(async response => {
		let postImg = `${imgUrl}${response.poster_path}`
		let movieTitle = response.title;
		let voteAverage = response.vote_average;
		let overView = response.overview;
		let runTime = `${Math.floor(response.runtime/60)}시간 ${response.runtime%60}분`;
		let movieDate = `개봉일 : ${response.release_date}`;
		let movieAge = await getMovieAge(movieId);
		movieGenres(response.genres)
		getMovieCredits(movieId);

		document.querySelector(`.movieInfo > .moviePoster > img`).src = postImg
		document.querySelector(`.movieInfo .movieContent .movieTitle`).textContent = movieTitle
		document.querySelector(`.movieInfo .movieSubInfo .movieDate`).textContent = movieDate
		document.querySelector(`.movieInfo .movieSubInfo .movieRuntime`).textContent = runTime
		document.querySelector(`.movieInfo .movieSubInfo .movieAge`).textContent = movieAge
		document.querySelector(`.movieInfo .movieContent .overView`).textContent = overView
		document.querySelector(`.movieInfo .movieSubInfo .movieAge`).textContent = movieAge

		const tabList = document.querySelectorAll(`.tabList`)
		const tabContent = document.querySelectorAll(`.tabContent`)
		tabList.forEach((tab,idx) => {
			tab.addEventListener("click", () => {
				tabContent.forEach((content) => {
					content.classList.remove(`active`)
				})
				tabList.forEach((list) => {
					list.classList.remove(`active`)
				})
				tabList[idx].classList.add(`active`)
				tabContent[idx].classList.add(`active`)
			})
		})

	})
	.catch(err => console.error(err));

}
