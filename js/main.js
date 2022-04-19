let carousel = document.querySelector(".carousel");
let current = 0;

function createList(cocktailsList) {
  for (let i = 0; i < cocktailsList.length; i++) {
    let div = document.createElement("div");
    div.classList.add("carousel-item");
    let imageDiv = document.createElement("div");
    imageDiv.classList.add("carousel-item__image");
    imageDiv.style.backgroundImage = `url(${cocktailsList[i].strDrinkThumb})`;
    div.innerHTML = `
      ${imageDiv.outerHTML}
      <div class="carousel-item__info">
        <div class="carousel-item__container">
          <h1 class="carousel-item__title">${cocktailsList[i].strDrink}</h1>
          <button class="carousel-item__btn">Details</button>
          <section class="details hidden">
            <h3>Ingredients</h3>
            <span class="ingredients"></span>
            
            <h3>Instructions</h3>
            <span class="instructions"></span>
          </section> 
        </div>
      </div>
        <span class='hidden'>${cocktailsList[i].idDrink}</span>
    `;
    carousel.appendChild(div);
  }
}

let cocktails;
fetch("https://www.thecocktaildb.com/api/json/v1/1/filter.php?a=Non_Alcoholic")
  .then((response) => response.json())
  .then((data) => {
    cocktails = data.drinks;
    createList(cocktails);
    let items = document.querySelectorAll(".carousel-item");

    return items;
  })
  .then((x) => {
    console.log(x[0]);
    x[0].classList.add("active");
    let total = x.length;
    document.querySelector("#moveRight").addEventListener("click", () => {
      let next = current;
      current = current + 1;
      setSlide(next, current);
      document
        .querySelectorAll(".details")
        .forEach((el) => el.classList.add("hidden"));
      document
        .querySelectorAll("button")
        .forEach((el) => el.classList.remove("hidden"));
    });
    document.querySelector("#moveLeft").addEventListener("click", () => {
      let prev = current;
      current = current - 1;
      setSlide(prev, current);
      document
        .querySelectorAll(".details")
        .forEach((el) => el.classList.add("hidden"));
      document
        .querySelectorAll("button")
        .forEach((el) => el.classList.remove("hidden"));
    });
    function setSlide(prev, next) {
      let slide = current;
      if (next > total - 1) {
        slide = 0;
        current = 0;
      }
      if (next < 0) {
        slide = total - 1;
        current = total - 1;
      }
      x[prev].classList.remove("active");
      x[slide].classList.add("active");
      setTimeout(function () {}, 800);
      console.log("current: ", current);
      console.log("prev: ", prev);
    }

    x.forEach((l) => {
      l.children[1].children[0].children[1].addEventListener("click", () =>
        clickItem(l)
      );
    });
  });

function clickItem(e) {
  console.log("clicked");
  console.log(e);
  e.children[1].children[0].children[1].classList.add("hidden");
  let id = e.children[2].innerText;
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then((response) => response.json())
    .then((data) => data.drinks[0])
    .then((drink) => {
      console.log(drink);
      // ingredients
      e.children[1].children[0].children[2].children[1].innerText =
        getIngredients(drink);
      // instructions
      e.children[1].children[0].children[2].children[3].innerText =
        drink.strInstructions;
      // show the details
      e.children[1].children[0].children[2].classList.toggle("hidden");
    });
}

function getIngredients(ing) {
  console.log(ing);
  let ingredients = "";
  for (let i = 1; i <= 15; i++) {
    ing[`strIngredient${i}`]
      ? (ingredients += `${ing[`strIngredient${i}`]} (${
          ing[`strMeasure${i}`]
        })\n`)
      : "";
  }
  return ingredients;
}
