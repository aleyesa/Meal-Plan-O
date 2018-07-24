//meal table html for each day
const createDayInfoTemplate = () => {
  $('.meal-table-section').children('section').html(
  `
    <aside class="meal-section-menu" role="complementary">
      <form class="meal-name-form" role="form">
        <fieldset>
          <legend>Create a new meal section</legend>
          <input type="text" name="meal-name" class="js-meal-name-input" 
            placeholder="i.e. lunch" aria-label="meal section name" autofocus required/><input type="submit" class="addMealSecBtn" value="+" aria-label="create meal name section"/>
        </fieldset>
      </form>
      <section class="meal-section-features">
          <button class="resetTableBtn" role="button">Reset Planner</button>
          <button class="pdfBtn" role="button">Save as PDF</button>   
      </section>
      <section class="meal-names-section">
      </section>
    </aside>
    <div class="step2">
    <p>No meal sections created, create a meal section now!</p>
    </div>
  `);
};

//html for meal section name
const mealSectionNameTemplate = mealSecName =>
`  
  <div class="meal${mealNameSecIdentifier}">
    <a href="#" aria-label="show ${mealSecName} meal section">${mealSecName}</a>
    <div>
    <button class="addFoodItemBtn" aria-label="search for food for ${mealSecName}" role="button"><i class="far fa-edit"></i></button>
    <button class="deleteMealSecBtn" aria-label="remove meal section for ${mealSecName}" role="button"><i class="far fa-trash-alt"></i></button>
    </div>
  </div>
`;

//html for macro info
const macroInfoTemplateForPlanner = (macroInfo) => 
  `
  <div class="macro">
    <p>Calories: <span class="calories">${macroInfo.cals}</span>kcals</p>
    <p>Proteins: <span class="proteins">${macroInfo.pros}</span>g</p>
    <p>Fats: <span class="fats">${macroInfo.fats}</span>g</p>
    <p>Carbohydrates: <span class="carbohydrates">${macroInfo.carbs}</span>g</p>
  </div>
  `
  ;

//html for macro section total
const macroInfoTotalTemplate = (macroInfo) =>
  `
    <div>
      <p>Calories(kcals)</p>
      <h2 class="calories">${macroInfo.cals}</h2>
    </div>
    <div>
      <p>Proteins(g)</p>
      <h2 class="proteins">${macroInfo.pros}</h2>
    </div>
    <div>
      <p>Fats(g)</p>
      <h2 class="fats">${macroInfo.fats}</h2>
    </div>
    <div>
      <p>Carbohydrates(g)</p>
      <h2 class="carbohydrates">${macroInfo.carbs}</h2>
    </div>
  `;

//html for food name with remove button for food item section
const addedFoodItemTemplate = (foodItemToAdd) => 
`
  <div class="addedFoodItem">
    <h2 class="addedFoodName">
      ${foodItemToAdd}
    </h2>
    <button class="removeFoodItem" role="button"><i class="far fa-trash-alt"></i></button>
  </div>
`;

//html for meal section info
const mealSectionInfoTemplate = mealSecName =>
`     
  <section class="meal${mealNameSecIdentifier} meal-section-info" id="mealInfo">
  <h2>${mealSecName}</h2>
    <section class="foodItemSection">
      <p class="noFoodNotification">No food has been added to planner, start adding food items!</p>
    </section>
    <h2>Total Macros</h2>
    <section class="macroSection">
    ${macroInfoTotalTemplate(totalMacros)}
    </section>
  </section>
`;

//html for search results
const displayResultHtml = (foodName, macros) => 
`
  <div class="foodItem">
  <h2 class="foodName">
    <i class="fas fa-utensils"></i>
    ${foodName.replace(/\u002C [UPC:]* [0-9]*/g, '').replace(/\u002C [GTIN:]* [0-9]*/g, '')}
  </h2>
    <div class="nutritionInfo">
      <h2>Macros</h2>
      ${macros}
    </div>
  <button class="addBtn" role="button" aria-label="${foodName.replace(/\u002C [UPC:]* [0-9]*/g, '').replace(/\u002C [GTIN:]* [0-9]*/g, '')} add food">Add</button>    
  <div class="notification">
    <p>${foodName.replace(/\u002C [UPC:]* [0-9]*/g, '').replace(/\u002C [GTIN:]* [0-9]*/g, '').toLowerCase()}</p>
    <p>Added to planner</p>
  </div>
  </div>
`;

//html for macro info in results
const macroInfoTemplateForResults = (name, value, unit) => (
`
<p><span class="capName">${name}</span>: <span class="${name}">${value}</span>${unit}</p>
`
);
