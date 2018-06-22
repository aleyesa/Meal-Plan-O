const mealTableHtml = $('.meal-table-section').html();
let combineResultsHtml = '';
let currentFoodSearch = '';
let pageOffset = 0;
let totalResults = 0;

let cals = 0;
let pros = 0;
let fats = 0;
let carbs = 0;

const specifyTabAndShowSection = () => {
  $('.meal-table-section nav').on('click', '.weekDay', function(event) {
    const that = $(this);
    const text = that.text().toLowerCase();

    that.parent().addClass('focus');
    that.parent().siblings('div').removeClass('focus');

    const mapDayTabToItsSection = { 
      sun: '.sunday-section', 
      mon: '.monday-section',                         
      tue: '.tuesday-section', 
      wed: '.wednesday-section', 
      thu: '.thursday-section', 
      fri: '.friday-section', 
      sat: '.saturday-section', 
    };

    const showCurDay = selector => {
      $(selector).removeClass('hide');
      $(selector).addClass('showMealSection');
    };

    const hideOtherDays = selector => {
      $(selector).siblings('section').addClass('hide');
      $(selector).siblings('section').removeClass('showMealSection');
    };

    for (let key in mapDayTabToItsSection) {
      const selector = mapDayTabToItsSection[key];

      if (key === text) {
        showCurDay(selector);
        hideOtherDays(selector);
      }
    }
  });
};

const addMealSection = () => {              
  $('.meal-name-form').on('submit', function(event) {
    event.preventDefault();
    const mealSecName = $(this).find('.js-meal-name').val();

    $('.meal-names-section div').removeClass('mealSectionFocus');
    $('.meal-section-menu').siblings(`.meal-section-info`).css('display', 'none');
    $(this).siblings('.meal-names-section').append(mealSectionTemplate(mealSecName));
    $(this).siblings('.meal-names-section').children(`.${mealSecName}`).addClass('mealSectionFocus');
    $(this).parent().after(mealSectionInfoTemplate(mealSecName));
    $('.js-meal-name').val("");
    foodItemToAdd = '';
    currMealSec = '';
  });
};

const selectMealSection = () => {
  $('.meal-names-section').on('click', 'div', function(event) {
    const targetMealSecName = $(this).find('a').text();
    $(this).siblings().removeClass('mealSectionFocus');
    $(this).addClass('mealSectionFocus');

    $(this).closest('.meal-section-menu')
    .siblings().css('display', 'none');
    $(this).closest('.meal-section-menu')
    .siblings(`.${targetMealSecName}`).css('display', 'block');
  });
};
                          
const removeMealSection = () => {
  $('.meal-table-section').on('click', '.deleteMealSecBtn', function(event) {
    const mealSecName = $(this).closest('div').find('a').text();
    $(this).closest('.meal-section-menu').siblings($(`.${mealSecName}`)).remove();
    $(this).closest('div').remove();
    cals  = 0;
    pros  = 0;
    fats  = 0;
    carbs = 0;
  });
};

const getFoodItemNameToSec = (currMealSec, targetMealSecName, foodItemToAdd) => {
  $(currMealSec).closest('.meal-section-menu')
  .siblings(`.${targetMealSecName}`)
  .find('.foodItemSection')
  .append(`<p class="addedFoodName">${foodItemToAdd}<button class="removeFoodItem">x</button></p>`);
  foodItemToAdd = '';
  currMealSec = '';
};

const getMacroInfoToSec = (currMealSec, targetMealSecName, foodItemToAdd, macroInfo) => {
  // create bar graph with mac nutrients
  // let cals =  Number(macroInfo.find('.calories .value').text());
  // let pros =  Number(macroInfo.find('.proteins .value').text());
  // let fats =  Number(macroInfo.find('.fats .value').text());
  // let carbs = Number(macroInfo.find('.carbohydrates .value').text());
  // google.charts.setOnLoadCallback(nutrientChart(foodItemToAdd, cals, pros, fats, carbs));

  //normal text of macro nutrients
  cals +=  Number(macroInfo.find('.calories .value').text());
  pros +=  Number(macroInfo.find('.proteins .value').text());
  fats +=  Number(macroInfo.find('.fats .value').text());
  carbs += Number(macroInfo.find('.carbohydrates .value').text());
  $(currMealSec).closest('.meal-section-menu')
  .siblings(`.${targetMealSecName}`)
  .find('.macroSection')
  .html(`
    <h2>Total Macros for ${targetMealSecName}</h2>
    <p>Calories: ${cals}kcals</p>
    <p>Proteins: ${pros}g</p>
    <p>Fats: ${fats}g</p>
    <p>Carbohydrates: ${carbs}g</p>
  `);
};

const addFoodItemInfoToSection = () => {
  $('.meal-table-section').on('click', '.addFoodItemBtn', function(event) {
    event.stopPropagation();
    let currMealSec = $(this);
    let targetMealSecName = $(currMealSec).siblings('a').text();

    $('.meal-table-section').css('display', 'none');
    $('.search-add-section').css('display', 'block');
    $('.search-results').on('click', '.addBtn', function(event) {

      let  foodItemToAdd = ($(this).parent().find('.foodName').text()).replace(/\u002C UPC: [0-9]+/g, '');
      let macroInfo = $(this).siblings('div');
      combineResultsHtml;
      getFoodItemNameToSec(currMealSec, targetMealSecName, foodItemToAdd);
      getMacroInfoToSec(currMealSec, targetMealSecName, foodItemToAdd, macroInfo);

      $('.search-add-section').css('display', 'none');
      $('.search-results').empty();
      $('.meal-table-section').css('display', 'block');

      foodItemToAdd = '';
      currMealSec = '';
      macroInfo = '';
    });    
  });
};

const createFoodItemObject = (foodName, cals, pro, fat, carb) => {
  // create an array of object to keep added food item info, be able to sum, subtract total.
  const addedfoodItems = [{
    foodName: [
    cals,
    pro,
    fat,
    carb
    ]
  }
]
};

const removeFoodItem = () => {
  $('.meal-table-section').on('click', '.removeFoodItem', function(event) {
    $(this).parent().remove();
  });
};

const goBackToTable = () => {
  $('.search-add-section').on('click', '.tableBtn', () => {    
    $('.search-add-section').css('display', 'none');
    $('.search-results').empty();
    $('.meal-table-section').css('display', 'block');

    combineResultsHtml = '';
  });
};

const resetMealPlan = () => {
  $('.meal-table-section').on('click', '.resetTableBtn', () => {
    $('.delete-prompt').css('display', 'block');
    $('.delete-prompt').on('click', '.exitBtn', () => $('.delete-prompt').css('display', 'none'));
    $('.delete-prompt').on('click', '.proceedBtn', () => $('.meal-table-section').html(mealTableHtml));
  });
};
  
const handleSearch = () => {
  $('.search-form').on('submit', function(event) {
    event.preventDefault();
    combineResultsHtml = '';
    totalResults = 0;
    pageOffset = 0;
    
    const query = $(this).find('.js-query');
    const foodItem = $(this).find('.js-query').val();
    currentFoodSearch = foodItem;
    query.val('');

    handleFoodSearchRequest(foodItem, pageOffset);
  });
};

const loadMoreResults = () => {
  $('.search-add-section').on('click', '.loadBtn', function(event) {
    if (currentFoodSearch === '') {
      console.log('no food item searched');
    } else if (pageOffset > totalResults) {
      console.log('pageOffset is higher than totalResults');
    } else {
      pageOffset += 10;
      handleFoodSearchRequest(currentFoodSearch, pageOffset);
    }
  });
};

const saveAsPdf = () => {
  $('.meal-section-features').on('click', '.pdfBtn', function(event) {
    window.print();
  });
};

const runApplication = () => {
    specifyTabAndShowSection();
    addMealSection();
    selectMealSection();
    removeMealSection();
    addFoodItemInfoToSection();
    removeFoodItem();
    goBackToTable();
    resetMealPlan();
    handleSearch();
    loadMoreResults();
    saveAsPdf();
};

runApplication();

