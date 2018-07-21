const createDayInfoTemplate = () => {
  $('.meal-table-section').children('section').html(
  `
    <aside class="meal-section-menu">
      <form class="meal-name-form">
        <fieldset>
          <legend>Create a new meal section</legend>
          <input type="text" name="meal-name" class="js-meal-name-input" 
            placeholder="i.e. lunch" autofocus required/><input type="submit" class="addMealSecBtn" value="+"/>
        </fieldset>
      </form>
      <section class="meal-section-features">
          <button class="resetTableBtn">Reset Planner</button>
          <button class='pdfBtn'>Save as PDF</button>   
      </section>
      <section class="meal-names-section">
      </section>
    </aside>
    <div class="step2">
    <p>No meal sections created.</p>
    <p>Start organizing your meals!</p>
    </div>
  `
  )};

const mealSectionNameTemplate = mealSecName =>
`  
  <div class="meal${mealNameSecIdentifier}">
    <a href="#mealInfo">${mealSecName}</a>
    <div>
    <button class="addFoodItemBtn" value="add_food_item_button"><i class="far fa-edit"></i></button>
    <button class="deleteMealSecBtn" value="remove_meal_section_button"><i class="far fa-trash-alt"></i></button>
    </div>
  </div>
`;

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
  `
  ;

const addedFoodItemTemplate = (foodItemToAdd) => 
`
  <div class="addedFoodItem">
    <h2 class="addedFoodName">
      ${foodItemToAdd}
    </h2>
    <button class="removeFoodItem"><i class="far fa-trash-alt"></i></button>
  </div>
`

const mealSectionInfoTemplate = mealSecName =>
`     
  <section class="meal${mealNameSecIdentifier} meal-section-info" id="mealInfo">
  <h2>${mealSecName}</h2>
    <section class="foodItemSection">
      <p class="noFoodNotification">No food has been added to planner.</p>
    </section>
    <h2>Total Macros</h2>
    <section class="macroSection">
    ${macroInfoTotalTemplate(totalMacros)}
    </section>
  </section>
`;

// const displayResultHtml = (foodName, macros) => 
// `
//   <div class="foodItem">
//   <div class="nutritionInfo">
//   <h2 class="foodName">
//     <i class="fas fa-utensils"></i>
//     ${foodName.replace(/\u002C [UPC:]* [0-9]*/g, '').replace(/\u002C [GTIN:]* [0-9]*/g, '')}
//   </h2>
//       <h2>Macros</h2>
//       ${macros}
//       <button class="addBtn">Add</button>  
//     </div>  
//   <div class="notification">
//     <p>${foodName.replace(/\u002C [UPC:]* [0-9]*/g, '').replace(/\u002C [GTIN:]* [0-9]*/g, '')} was added to planner.</p>
//   </div>
//   </div>
// `;

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
  <button class="addBtn">Add</button>    
  <div class="notification">
    <p>${foodName.replace(/\u002C [UPC:]* [0-9]*/g, '').replace(/\u002C [GTIN:]* [0-9]*/g, '').toLowerCase()}</p>
    <p>Added to planner</p>
  </div>
  </div>
`;

const macroInfoTemplateForResults = (name, value, unit) => (
`
<p><span class="capName">${name}</span>: <span class="${name}">${value}</span>${unit}</p>
`
);

// <div id="chart_div"></div>