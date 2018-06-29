let combineResultsHtml = '';
let currentFoodSearch = '';
let pageOffset = 0;
let totalResults = 0;
let mealNameSecIdentifier = 0;
let currMealSec = '';
let targetMealSecName = '';

let totalCals = 0;
let totalPros = 0;
let totalFats = 0;
let totalCarbs = 0;

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
      // $('.meal-section-menu').siblings('.meal-section-info').css('display', 'none');
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
  });
};

const selectMealSection = () => {
  $('.meal-names-section').on('click', 'div', function(event) {
    const targetMealSecName = $(this).attr('class');
    const selectedDaysMealSecMenu = $(this).closest('.meal-section-menu');

    $('.meal-section-menu').siblings(`.meal-section-info`).css('display', 'none');
    // selectedDaysMealSecMenu.siblings().css('display', 'none');
    selectedDaysMealSecMenu.siblings(`.${targetMealSecName}`).css('display', 'flex');
  });
};
                          
const removeMealSection = () => {
  $('.meal-table-section').on('click', '.deleteMealSecBtn', function(event) {
    const selectedMealSecName = $(this).closest('div').attr('class');
    $(this).closest('.meal-section-menu').siblings(`.${selectedMealSecName}`).remove();
    $(this).closest('div').remove();
  });
};

const sumTotalMacros = (cals, pros, fats, carbs) => {
  totalCals  = 0;
  totalPros  = 0;
  totalFats  = 0;
  totalCarbs = 0;

  const getToTotalMacroSec = currMealSec.closest('.meal-section-menu').siblings(`.${targetMealSecName}`);
  let prevTotalCals  = Number(getToTotalMacroSec.find('.macroSection p .calcCals').text());
  let prevTotalPros  = Number(getToTotalMacroSec.find('.macroSection p .calcPros').text());
  let prevTotalFats  = Number(getToTotalMacroSec.find('.macroSection p .calcFats').text());
  let prevTotalCarbs = Number(getToTotalMacroSec.find('.macroSection p .calcCarbs').text());

  totalCals  = prevTotalCals  + cals;
  totalPros  = prevTotalPros  + pros;
  totalFats  = prevTotalFats  + fats;
  totalCarbs = prevTotalCarbs + carbs;
};

const getMacroInfo = (macroInfo) => {
  const cals =  Number(macroInfo.find('.calories .value').text());
  const pros =  Number(macroInfo.find('.proteins .value').text());
  const fats =  Number(macroInfo.find('.fats .value').text());
  const carbs = Number(macroInfo.find('.carbohydrates .value').text());

  sumTotalMacros(cals, pros, fats, carbs);
  getTotalMacrosToSec();
  return macroInfoTemplateForPlanner(cals, pros, fats, carbs);

};

const getFoodItemToSec = (foodItemToAdd, macroInfo) => {
  const selectedMealFoodItemSec = currMealSec.closest('.meal-section-menu')
  .siblings(`.${targetMealSecName}`)
  .find('.foodItemSection');

  selectedMealFoodItemSec.append(addedFoodItemTemplate(foodItemToAdd) + macroInfo);
};

const deductMacrosFromTotal = (selectedFoodItem) => {
  const getToTotalMacroSec = selectedFoodItem.closest('.foodItemSection').siblings('.macroSection');
  totalCals  = 0;
  totalPros  = 0;
  totalFats  = 0;
  totalCarbs = 0;

  let prevTotalCals  = Number(getToTotalMacroSec.find('p .calcCals').text());
  let prevTotalPros  = Number(getToTotalMacroSec.find('p .calcPros').text());
  let prevTotalFats  = Number(getToTotalMacroSec.find('p .calcFats').text());
  let prevTotalCarbs = Number(getToTotalMacroSec.find('p .calcCarbs').text());

  totalCals  = prevTotalCals  - selectedFoodItem.next('.singleFoodMacros').find('.calcCals').text();
  totalPros  = prevTotalPros  - selectedFoodItem.next('.singleFoodMacros').find('.calcPros').text();
  totalFats  = prevTotalFats  - selectedFoodItem.next('.singleFoodMacros').find('.calcFats').text();
  totalCarbs = prevTotalCarbs - selectedFoodItem.next('.singleFoodMacros').find('.calcCarbs').text();

  getToTotalMacroSec.html(macroInfoTemplateForPlanner(totalCals, totalPros, totalFats, totalCarbs));
}

const getTotalMacrosToSec = () => {

  // create bar graph with mac nutrients
  // let cals =  Number(macroInfo.find('.calories .value').text());
  // let pros =  Number(macroInfo.find('.proteins .value').text());
  // let fats =  Number(macroInfo.find('.fats .value').text());
  // let carbs = Number(macroInfo.find('.carbohydrates .value').text());
  // google.charts.setOnLoadCallback(nutrientChart(foodItemToAdd, cals, pros, fats, carbs));
  // normal text of macro nutrients

  // storeFoodItemInfo(foodItemToAdd, cals, pros, fats, carbs);

  currMealSec.closest('.meal-section-menu')
  .siblings(`.${targetMealSecName}`)
  .find('.macroSection')
  .html(macroInfoTemplateForPlanner(totalCals, totalPros, totalFats, totalCarbs));
};

const addedFoodItemFromList = () => {
  $('.search-results').on('click', '.addBtn', function(event) {
    let foodItemToAdd = $(this).parent().find('.foodName').html();
    let macroInfo = $(this).siblings('div');
    getFoodItemToSec(foodItemToAdd, getMacroInfo(macroInfo));
  
    $('.search-add-section').css('display', 'none');
    $('.search-results').empty();
    $('.meal-table-section').css('display', 'block');
  });    
};

const addFoodItemInfoToSection = () => {

  $('.meal-table-section').on('click', '.addFoodItemBtn', function() {
    currMealSec = $(this);
    targetMealSecName = currMealSec.parent().attr('class');

    $('.meal-table-section').css('display', 'none');
    $('.search-add-section').css('display', 'block');
 
  });

  addedFoodItemFromList();
};

const removeFoodItem = () => {
  $('.meal-table-section').on('click', '.removeFoodItem', function(event) {
    const selectedFoodItem = $(this).parent();
    deductMacrosFromTotal(selectedFoodItem);
    selectedFoodItem.next('.singleFoodMacros').remove();
    selectedFoodItem.remove();
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
      $('.delete-prompt').css('display', 'none');
      runApplication();
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
  const mealTableHtml = $('meal-table-section').html();
  $('.meal-section-features').on('click', '.pdfBtn', function(event) {
    let pdfFriendlyHtml = '';
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    $('.meal-section-info').css('display', 'block');
    const mealPlanReplacement = weekDaysArray =>  {
      $('.meal-table-section').css('display', 'none');
      ` 
      ${$(`.${weekDaysArray.toLowerCase()}-section`).find('.meal-section-info').html(`
        <h2>${weekDaysArray}</h2>
        ${$(`.${weekDaysArray.toLowerCase()}-section`).find('.meal-section-info').html()}
      `)}
      ${$(`.${weekDaysArray.toLowerCase()}-section`).find('.meal-section-info').wrapAll(`<div class="pdfFriendly" />`).html()}
      `
    };

      $('.meal-section-info').css('width', '100%');

    const showPdfFriendlyHtml = () => {
      $('main').html($('.pdfFriendly').html()).html();
    };

    weekDays.forEach( day => 
      mealPlanReplacement(day)
    );

    showPdfFriendlyHtml();
    window.print();
    $('.meal-table-section').css('display', 'block');
  });
};

const runApplication = () => {
  resetMealPlan();
  createDayInfoTemplate();
  specifyTabAndShowSection();
  addMealSection();
  selectMealSection();
  removeMealSection();
  addFoodItemInfoToSection();
  removeFoodItem();
  goBackToTable();
  handleSearch();
  loadMoreResults();
  saveAsPdf();
};

runApplication();

