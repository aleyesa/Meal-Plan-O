const createDayInfoTemplate = () => {
  $('.meal-table-section').children('section').html(
  `
    <section class="meal-section-menu">
      <form class="meal-name-form">
        <fieldset>
          <legend class="legend">Create a new meal section</legend>
          <input type="text" name="meal-name" class="js-meal-name" 
            placeholder="New Meal Section: Lunch" autofocus required/>
          <input type="submit" class="addMealSecBtn" value="+"/>
        </fieldset>
      </form>
      <section class="meal-section-features">
      <button class="resetTableBtn">Reset Meal Planner</button>
      <a href="#">
        <button class='pdfBtn'>Save as PDF</button>
      </a>            
      </section>
      <section class="meal-names-section">
      </section>
    </section>
  `
  )};

const mealSectionNameTemplate = mealSecName =>
`  
  <div class="meal${mealNameSecIdentifier}">
    <a href="#">${mealSecName}</a>
    <button class="deleteMealSecBtn far fa-trash-alt"></button>
    <button class="addFoodItemBtn far fa-edit"></button>
  </div>
`;

const macroInfoTemplateForPlanner = (cals, pros, fats, carbs) => 
  `
  <div class="singleFoodMacros">
    <p>Calories: <span class="calcCals">${cals}</span> kcals</p>
    <p>Proteins: <span class="calcPros">${pros}</span> g</p>
    <p>Fats: <span class="calcFats">${fats}</span> g</p>
    <p>Carbohydrates: <span class="calcCarbs">${carbs}</span> g</p>
  </div>
  `
  ;

const addedFoodItemTemplate = (foodItemToAdd) => 
`
  <p class="addedFoodName">${foodItemToAdd}
    <button class="removeFoodItem">x</button>
  </p> 
`


const mealSectionInfoTemplate = mealSecName =>
`   
  <section class="meal${mealNameSecIdentifier} meal-section-info">
  <h2>${mealSecName} consists of...</h2>
    <section class="foodItemSection">
    </section>
    <h2>${mealSecName} macros are...</h2>
    <section class="macroSection">

      <div id="chart_div"></div>
    </section>
  </section>
`;

const displayResultHtml = (foodName, macros) => 
`
  <div class="foodItem">
  <a href="#" class="foodName">${foodName.replace(/\u002C UPC: [0-9]+/g, '')}</a>
    <div class="nutritionInfo">
    <h2>Macros</h2>
    ${macros}
    </div>
  <button class="addBtn">Add</button>
  </div>
`;

const macroInfoTemplateForResults = (data, i, nutritionType) => (
`
  <div class="${nutritionType}">
  <p>${nutritionType}: </p>
  <p class="value">${Math.round(data.foods[0].food.nutrients[i].value)}</p>
  <p class="unit">${data.foods[0].food.nutrients[i].unit}</p>
  </div>
`
);

