const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMTFkYzVlZGU3M2I0YzdkOTkzMjFkNDA0MTE2YjVlOSIsInN1YiI6IjY1MzA4OWY2OTQ1ZDM2MDEwYzM1YjQzYSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.i5MmyxAS9JKVxACccWkvKjFLsa4ULu9ZrpNNyXhDgvE",
  },
};

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
        <div>
        <img src="https://image.tmdb.org/t/p/w500${image}"alt="">
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
