const options2 = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMTFkYzVlZGU3M2I0YzdkOTkzMjFkNDA0MTE2YjVlOSIsInN1YiI6IjY1MzA4OWY2OTQ1ZDM2MDEwYzM1YjQzYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.i5MmyxAS9JKVxACccWkvKjFLsa4ULu9ZrpNNyXhDgvE",
  },
};

fetch(
  "https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=Ko-Kr&page=1&sort_by=popularity.desc",
  options2
)
  .then((response) => response.json())
  .then((response) => {
    const movie_li = response.results;
    //이미지, 제목 , 줄거리 데이터 가져오기
    let mainslide = document.querySelector(".slidelist");
    movie_li.forEach((i) => {
      let image = i["backdrop_path"];
      let title = i["title"];
      let overview = i["overview"];
      let slidelist = ` 
      <li class="slideitem">
        <div>
        <img class = "slideimg" 
        src="https://image.tmdb.org/t/p/original${image}" alt="">     
        <h1 class = "image_title" >${title}</h1>
        <p class = "image-overview">${overview}</p>   
       </div>
      </li>
    </div>
      `;

      // let creatediv = document.createElement("div");
      // creatediv.innerHTML = slidelist;
      // mainslide.append(creatediv);
      mainslide.innerHTML += slidelist;
    });

    setInterval(function () {
      let randomIndex = Math.floor(Math.random() * mainslide.children.length);
      for (i = 0; i < mainslide.children.length; i++) {
        mainslide.children[i].classList.remove("opacity");
      }
      mainslide.children[randomIndex].classList.add("opacity");
    }, 5000);
  })

  .catch((err) => console.error(err));
