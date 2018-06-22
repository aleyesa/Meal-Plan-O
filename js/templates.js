const mealSectionTemplate = mealSecName =>
`  
  <div class="${mealSecName}">
    <a href="#">${mealSecName}</a>
    <button class="deleteMealSecBtn far fa-trash-alt"></button>
    <button class="addFoodItemBtn far fa-edit"></button>
  </div>
`;

const mealSectionInfoTemplate = mealSecName =>
`   
  <section class="${mealSecName} meal-section-info">
  <h2>Your ${mealSecName} consists of...</h2>
    <section class="foodItemSection">
    </section>
    <h2>Your Macros for ${mealSecName} are...</h2>
    <section class="macroSection">  
      <div id="chart_div"></div>
    </section>
  </section>
`;

const displayResultHtml = (foodName, macros) => 
`
  <div class="dropdown">
  <a href="#" class="foodName">${foodName}</a>
    <div class="nutritionInfo">
    <strong><u>Macros</u></strong>
    ${macros}
    </div>
  <button class="addBtn">Add</button>
  </div>
`;

const macroInfoTemplate = (data, i, nutritionType) => (
`
  <div class="${nutritionType}">
  <p>${nutritionType}: </p>
  <p class="value">${data.foods[0].food.nutrients[i].value}</p>
  <p class="unit">${data.foods[0].food.nutrients[i].unit}</p>
  </div>
`
);