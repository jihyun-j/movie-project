const url = `https://api.themoviedb.org/3/movie`;
const searchUrl = `https://api.themoviedb.org/3/search/movie`;
const imgUrl = `https://image.tmdb.org/t/p/original`

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

const scoreModal = () => {
	document.querySelector('#modal').style.display = 'block';
}
const closeModal = () => {
	document.querySelector('#modal').style.display = 'none';
	document.querySelector('#score').value = ``;
}

const makeMovieCard = (movieId, postImg, movieTitle, voteAverage, overView) => {
	const movieCard = document.createElement('div');

	movieCard.className = 'movieCard';
	movieCard.addEventListener('click', () => alert(`Movie id : ${movieId}`))
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
		console.log(response.results)
		movieList = response.results;
		response.results.map((res) => {
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
	closeModal()

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

		response.results.map((res) => {
			let postImg = `${imgUrl}${res.poster_path}`
			let movieTitle = res.title;
			let voteAverage = res.vote_average;
			let overView = res.overview;

			makeMovieCard(res.id, postImg, movieTitle, voteAverage, overView);

		})

  	})
  	.catch(err => console.error(err));

}
