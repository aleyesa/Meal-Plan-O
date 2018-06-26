const mealTableHtml = $('.meal-table-section').html();
let combineResultsHtml = '';
let currentFoodSearch = '';
let pageOffset = 0;
let totalResults = 0;
let mealNameSecIdentifier = 0;

let cals = 0;
let pros = 0;
let fats = 0;
let carbs = 0;
const foodInfoArray = [];

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
  $('.meal-name-form').on('submit', function(e) {
    e.preventDefault();
    const mealSecName = $(this).find('.js-meal-name').val();
    const thisDaysMealNameSec = $(this).siblings('.meal-names-section');

    $('.meal-section-menu').siblings(`.meal-section-info`).css('display', 'none');
    thisDaysMealNameSec.append(mealSectionNameTemplate(mealSecName));
    $(this).parent().after(mealSectionInfoTemplate(mealSecName));
    $('.js-meal-name').val("");
    mealNameSecIdentifier++;
    foodItemToAdd = '';
    currMealSec = '';
  });
};

const selectMealSection = () => {
  $('.meal-names-section').on('click', 'div', function(event) {
    const targetMealSecName = $(this).attr('class');
    const selectedDaysMealSecMenu = $(this).closest('.meal-section-menu');

    selectedDaysMealSecMenu.siblings().css('display', 'none');
    selectedDaysMealSecMenu.siblings(`.${targetMealSecName}`).css('display', 'flex');
  });
};
                          
const removeMealSection = () => {
  $('.meal-table-section').on('click', '.deleteMealSecBtn', function(event) {
    const selectedMealSecName = $(this).closest('div').attr('class');
    $(this).closest('.meal-section-menu').siblings(`.${selectedMealSecName}`).remove();
    $(this).closest('div').remove();
    cals  = 0;
    pros  = 0;
    fats  = 0;
    carbs = 0;

    //*Will most likely have to reset food item object with its nutrition values.
  });
};

const getFoodItemNameToSec = (currMealSec, targetMealSecName, foodItemToAdd) => {
  currMealSec.closest('.meal-section-menu')
  .siblings(`.${targetMealSecName}`)
  .find('.foodItemSection')
  .append(`<p class="addedFoodName">${foodItemToAdd}<button class="removeFoodItem">x</button></p>`);
};

const storeFoodItemInfo = (foodName, cals, pros, fats, carbs) => {
  foodInfoArray.push([
    [foodName], 
    [cals], 
    [pros], 
    [fats], 
    [carbs]
  ]
  );
};

const getMacroInfoToSec = (currMealSec, targetMealSecName, foodItemToAdd, macroInfo) => {
  // create bar graph with mac nutrients
  // let cals =  Number(macroInfo.find('.calories .value').text());
  // let pros =  Number(macroInfo.find('.proteins .value').text());
  // let fats =  Number(macroInfo.find('.fats .value').text());
  // let carbs = Number(macroInfo.find('.carbohydrates .value').text());
  // google.charts.setOnLoadCallback(nutrientChart(foodItemToAdd, cals, pros, fats, carbs));
  //normal text of macro nutrients
  cals =  Number(macroInfo.find('.calories .value').text());
  pros =  Number(macroInfo.find('.proteins .value').text());
  fats =  Number(macroInfo.find('.fats .value').text());
  carbs = Number(macroInfo.find('.carbohydrates .value').text());

  storeFoodItemInfo(foodItemToAdd, cals, pros, fats, carbs);

  console.log(foodInfoArray);

  currMealSec.closest('.meal-section-menu')
  .siblings(`.${targetMealSecName}`)
  .find('.macroSection')
  .replaceWith(macroInfoTemplateForPlanner(cals, pros, fats, carbs));
};

const addFoodItemInfoToSection = () => {
  $('.meal-table-section').on('click', '.addFoodItemBtn', function(event) {
    const currMealSec = $(this);
    const targetMealSecName = currMealSec.parent().attr('class');

    $('.meal-table-section').css('display', 'none');
    $('.search-add-section').css('display', 'block');

    $('.search-results').on('click', '.addBtn', function(event) {

      let  foodItemToAdd = $(this).parent().find('.foodName').text().replace(/\u002C UPC: [0-9]+/g, '');
      let macroInfo = $(this).siblings('div');

      console.log(foodItemToAdd);
      
      getFoodItemNameToSec(currMealSec, targetMealSecName, foodItemToAdd);

      console.log(foodItemToAdd);
      getMacroInfoToSec(currMealSec, targetMealSecName, foodItemToAdd, macroInfo);

      console.log(foodItemToAdd);

      $('.search-add-section').css('display', 'none');
      $('.search-results').empty();
      $('.meal-table-section').css('display', 'block');
    });    
  });
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
    $('.meal-table-section').css('display', 'flex');

    combineResultsHtml = '';
  });
};

const resetMealPlan = () => {
  $('.meal-table-section').on('click', '.resetTableBtn', () => {
    $('.delete-prompt').css('display', 'block');
    $('.delete-prompt').on('click', '.exitBtn', () => $('.delete-prompt').css('display', 'none'));
    $('.delete-prompt').on('click', '.proceedBtn', () => {
      $('.meal-table-section').html(mealTableHtml);
      createDayInfoTemplate();
  });
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
    let pdfFriendlyHtml = '';
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    $('.meal-section-info').css('display', 'block');
    const mealPlanReplacement = weekDaysArray =>  
      ` 
        ${$(`.${weekDaysArray.toLowerCase()}-section`).find('.meal-section-info').html(`
          <h2>${weekDaysArray}</h2>
          ${$(`.${weekDaysArray.toLowerCase()}-section`).find('.meal-section-info').html()}
        `)}
        ${$(`.${weekDaysArray.toLowerCase()}-section`).find('.meal-section-info').wrapAll(`<div class="pdfFriendly" />`).html()}
      `
      ;

      $('.meal-section-info').css('width', '100%');

    const showPdfFriendlyHtml = () => {
      $('main').html($('.pdfFriendly').html()).html();
    };

    weekDays.forEach( day => 
      mealPlanReplacement(day)
    );

    showPdfFriendlyHtml();


    // $('.sunday-section').removeClass();
    // $('.meal-section-info').removeClass();


    // window.print();
  });
};

//Problem 3: windows.print
//we can simply create an html and show the data we want to show.
//example:
//Monday
//meal section 1
//food items in that meal section
//meal section 2
//food items in that meal section

//Tuesday
//...

//Problem 4:
//bar graph duplicate items

//Problem 5: macro total miscalculation
//

// Task: modifying quantity.
// a form with text input
// the text input is a number
// once submitted we mutliply the macros



const runApplication = () => {
  createDayInfoTemplate();
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

