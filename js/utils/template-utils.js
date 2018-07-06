const createDayInfoTemplate = () => {
  $('.meal-table-section').children('section').html(
  `
    <section class="meal-section-menu">
      <form class="meal-name-form">
        <fieldset>
          <legend>Create a new meal section</legend>
          <input type="text" name="meal-name" class="js-meal-name-input" 
            placeholder="i.e. Lunch" autofocus required/><input type="submit" class="addMealSecBtn" value="+"/>
        </fieldset>
      </form>
      <section class="meal-section-features">
          <button class="resetTableBtn">Reset Planner</button>
          <button class='pdfBtn'>Save as PDF</button>   
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
    <button class="addFoodItemBtn far fa-edit"></button>
    <button class="deleteMealSecBtn far fa-trash-alt"></button>
  </div>
`;

const macroInfoTemplateForPlanner = (macroInfo) => 
  `
  <div>
    <p>Calories: <span class="calories">${macroInfo.cals}</span> kcals</p>
    <p>Proteins: <span class="proteins">${macroInfo.pros}</span> g</p>
    <p>Fats: <span class="fats">${macroInfo.fats}</span> g</p>
    <p>Carbohydrates: <span class="carbohydrates">${macroInfo.carbs}</span> g</p>
  </div>
  `
  ;

const macroInfoTotalTemplate = (macroInfo) =>
  `
    <div>
      <h2 class="calories">${macroInfo.cals}</h2>
      <p>Calories(kcals)</p>
    </div>
    <div>
      <h2 class="proteins">${macroInfo.pros}</h2>
      <p>Proteins(g)</p>
    </div>
    <div>
      <h2 class="fats">${macroInfo.fats}</h2>
      <p>Fats(g)</p>
    </div>
    <div>
      <h2 class="carbohydrates">${macroInfo.carbs}</h2>
      <p>Carbohydrates(g)</p>
    </div>
  `
  ;

const addedFoodItemTemplate = (foodItemToAdd) => 
`
  <h2 class="addedFoodName">
  <img src="./img/dish.png"/>
  ${foodItemToAdd}
    <button class="removeFoodItem">x</button>
  </h2>
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

const macroInfoTemplateForResults = (name, value, unit) => (
`
<p>${name}: <span class="${name}">${value}</span> ${unit}</p>
`
);

