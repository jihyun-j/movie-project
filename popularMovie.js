const url = `https://api.themoviedb.org/3/movie`;
const searchUrl = `https://api.themoviedb.org/3/search/movie`;
const imgUrl = `https://image.tmdb.org/t/p/original`
const emptyImg = `https://s3-us-west-1.amazonaws.com/files.delesign/assets/Not-Found-1.svg`;

const options = {
	method: 'GET',
	headers: {
		accept: 'application/json',
		Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmZmMyZGZhZDQ3YThlZDRmMWUwYWQxYjc1MGVhMzBhMSIsInN1YiI6IjY1MzA5NGQ3YWVkZTU5MDE0YzM4MDBjZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.F6qLqVKcX12Lxl8WUe5P3sDfhlIdJ44DaMgj0Dvuq1M'
  	}
};


window.addEventListener('load', () => {
	document.querySelector(`#search`).focus();
})
let movieList = [];

//키보드 이벤트


//모달 보이게
const scoreModal = () => {
	document.querySelector('#searchModal').style.display = 'block';
}
const infoModalOpen = (movieId) => {
	document.querySelector('#infoModal').style.display = 'block';
	movieInfo(movieId)
}

//모달 닫고 모달안에 있는 input 데이터 초기화
const scoreModalClose = () => {
	document.querySelector('#searchModal').style.display = 'none';
	document.querySelector('#score').value = ``;
}
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
	const movieCard = document.createElement('div');

	movieCard.className = 'movieCard';
	movieCard.addEventListener('click', () => infoModalOpen(movieId))
	movieCard.innerHTML = `<div class="moviePoster">
								<img src=${postImg} alt="">
							</div>
							<div class="movieTitle">${movieTitle}</div>
							<div class="voteAverage" >🍅 : <span id="voteAverage">${voteAverage}</span></div>
							<div class="overView">${overView}</div>`

	return document.querySelector("#movieList").appendChild(movieCard)
}

  //영화 리스트
fetch(`${url}/popular?language=ko-KR&page=1`, options)
	.then(response => response.json())
	.then(response => {
		movieList = response.results;
		response.results.forEach((res) => {
			let postImg = `${imgUrl}${res.poster_path}`
			let movieTitle = res.title;
			let voteAverage = res.vote_average;
			let overView = res.overview;

			makeMovieCard(res.id, postImg, movieTitle, voteAverage, overView);

		})
  	})
  	.catch(err => console.error(err));

// 영화 검색
const enterKey = (event) => {
	if (event.keyCode === 13) {
		searchQuery()
	}
}

const searchQuery = () => {
	const searchParams = document.querySelector('#search').value;
	searchParams ? clearCard() : alert("검색어를 입력해주세요")
	
	findMovie(searchParams)
}

const scoreSearch = () => {
	const inputScore = document.querySelector('#score').value
	const scoreCheck = document.querySelector('#scoreCheck > option:checked').value
	
	const scoreFilter = movieList;
	
	clearCard()
	scoreModalClose()

	scoreFilter.filter((res) => {
		let score =  res.vote_average

		let movieId = res.id
		let postImg = `${imgUrl}${res.poster_path}`
		let movieTitle = res.title;
		let overView = res.overview;

		switch (scoreCheck) {
			case "up": 
			if (score >= inputScore) {
				makeMovieCard(movieId,postImg,movieTitle,score,overView);
			}
			break;
			case "down": 
			if (score <= inputScore) {
				makeMovieCard(movieId,postImg,movieTitle,score,overView);
			}
			break;
		}
	})

}


const clearCard = () => {
	const cardList = document.querySelectorAll(`.movieCard `)
	cardList.forEach(element => {
		element.remove()
	});
}

const findMovie = (searchParams) => {
	fetch(`${searchUrl}?query=${searchParams}&include_adult=false&language=ko-KR&page=1`, options)
		.then(response => response.json())
		.then(response => {

		response.results.forEach((res) => {
			let postImg = `${imgUrl}${res.poster_path}`
			let movieTitle = res.title;
			let voteAverage = res.vote_average;
			let overView = res.overview;

			makeMovieCard(res.id, postImg, movieTitle, voteAverage, overView);

		})

  	})
  	.catch(err => console.error(err));

}

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
	.catch(err => console.log(err));
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
        console.log(data.profile_path ,!data.profile_path)
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