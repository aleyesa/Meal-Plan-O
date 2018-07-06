let combineResultsHtml = '';
let currentFoodSearch = '';
let pageOffset = 0;
let totalResults = 0;
let mealNameSecIdentifier = 0;
let currMealSec = '';
let targetMealSecName = ''; 

const totalMacros = {
  cals:  0,
  pros:  0,
  fats:  0,
  carbs: 0
};

const specifyTabAndShowSection = () => {
  $('.meal-table-section nav').on('click', '.weekDay', function() {
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

const selectMealSection = () => {
  $('.meal-names-section').on('click', 'div', function() {
    const targetMealSecName = $(this).attr('class');
    const selectedDaysMealSecMenu = $(this).closest('.meal-section-menu');
    $('.meal-section-menu').siblings(`.meal-section-info`).css('display', 'none');
    selectedDaysMealSecMenu.siblings(`.${targetMealSecName}`).css('display', 'flex');
  });
};

const addMealSection = () => {              
  $('.meal-name-form').on('submit', function(event) {
    event.preventDefault();
    const mealSecName = $(this).find('.js-meal-name-input').val();
    const thisDaysMealNameSec = $(this).siblings('.meal-names-section');
    $('.meal-section-menu').siblings(`.meal-section-info`).css('display', 'none');
    thisDaysMealNameSec.append(mealSectionNameTemplate(mealSecName));
    $(this).parent().after(mealSectionInfoTemplate(mealSecName));

    $('.js-meal-name-input').val("");
    mealNameSecIdentifier++;
    foodItemToAdd = '';
  });
};
                          
const removeMealSection = () => {
  $('.meal-table-section').on('click', '.deleteMealSecBtn', function() {
    const selectedMealSecName = $(this).closest('div').attr('class');

    $(this).closest('.meal-section-menu').siblings(`.${selectedMealSecName}`).remove();
    $(this).closest('div').remove();
  });
};

const getMacroInfo = (macroInfo) => {
  const macroValues = {
    cals:  Number(macroInfo.find('.calories').text()),
    pros:  Number(macroInfo.find('.proteins').text()),
    fats:  Number(macroInfo.find('.fats').text()),
    carbs: Number(macroInfo.find('.carbohydrates').text())
  };

  return macroValues;
};

const calcTotalMacros = (operation, macroValues) => {
  const getToTotalMacroSec = currMealSec.closest('.meal-section-menu').siblings(`.${targetMealSecName}`);
  let prevTotalCals  = Number(getToTotalMacroSec.find('.macroSection .calories').text());
  let prevTotalPros  = Number(getToTotalMacroSec.find('.macroSection .proteins').text());
  let prevTotalFats  = Number(getToTotalMacroSec.find('.macroSection .fats').text());
  let prevTotalCarbs = Number(getToTotalMacroSec.find('.macroSection .carbohydrates').text());

  totalMacros.cals  = eval(prevTotalCals  + operation + macroValues.cals);
  totalMacros.pros  = eval(prevTotalPros  + operation + macroValues.pros);
  totalMacros.fats  = eval(prevTotalFats  + operation + macroValues.fats);
  totalMacros.carbs = eval(prevTotalCarbs + operation + macroValues.carbs);
};

const getFoodItemToSec = (foodItemToAdd, macroInfo) => {
  const selectedMealFoodItemSec = currMealSec.closest('.meal-section-menu')
  .siblings(`.${targetMealSecName}`)
  .find('.foodItemSection');

  selectedMealFoodItemSec.append(addedFoodItemTemplate(foodItemToAdd) + macroInfo);
};

const updateTotalMacrosToSec = () => {
  // create bar graph with mac nutrients
  // let cals =  Number(macroInfo.find('.calories .value').text());
  // let pros =  Number(macroInfo.find('.proteins .value').text());
  // let fats =  Number(macroInfo.find('.fats .value').text());
  // let carbs = Number(macroInfo.find('.carbohydrates .value').text());
  // google.charts.setOnLoadCallback(nutrientChart('a', totalMacros));
  // normal text of macro nutrients

  // storeFoodItemInfo(foodItemToAdd, cals, pros, fats, carbs);

  currMealSec.closest('.meal-section-menu')
  .siblings(`.${targetMealSecName}`)
  .find('.macroSection')
  .html(macroInfoTotalTemplate(totalMacros));
};

const addedFoodItemFromList = () => {
  $('.search-results').on('click', '.addBtn', function() {
    let foodItemToAdd = $(this).parent().find('.foodName').html();
    let macroInfo = $(this).siblings('div');
    getFoodItemToSec(foodItemToAdd, macroInfoTemplateForPlanner(getMacroInfo(macroInfo)));
    calcTotalMacros('+', getMacroInfo(macroInfo));
    updateTotalMacrosToSec();

    $('.search-add-section').css('display', 'none');
    $('.search-results').empty();
    $('.meal-table-section').css('display', 'block');
  });    
};

const addFoodItemInfoToSection = () => {
  $('.meal-table-section').on('click', '.addFoodItemBtn', function() {
    currMealSec = $(this);
    targetMealSecName = currMealSec.parent().attr('class');
    $('.meal-table-section, .totalResults').css('display', 'none');
    $('.search-add-section').css('display', 'block');
    $('.search-results').empty();
    currentFoodSearch = '';
    combineResultsHtml = '';
  });
  addedFoodItemFromList();
};

const removeFoodItem = () => {
  $('.meal-table-section').on('click', '.removeFoodItem', function() {
    targetMealSecName = $(this).closest('.meal-section-info').attr('class').replace(/meal-section-info/, '');
    currMealSec = $('.meal-names-section').find(`.${targetMealSecName} .addFoodItemBtn`);
    const selectedFoodItem = $(this).parent();
    const macroInfo = selectedFoodItem.next('div');
    calcTotalMacros('-', getMacroInfo(macroInfo));
    updateTotalMacrosToSec();

    macroInfo.remove();
    selectedFoodItem.remove();
  });
};

const goBackToTable = () => {
  $('.search-add-section').on('click', '.backToTable', () => {    
    $('.search-add-section, .totalResults').css('display', 'none');
    $('.search-results').empty();
    $('.meal-table-section').css('display', 'block');
    combineResultsHtml = '';
  });
};

const resetMealPlan = () => {
  $('.meal-table-section').on('click', '.resetTableBtn', () => {
    $('.delete-prompt').css('display', 'block');
    $('.delete-prompt').on('click', '.exitBtn', () => $('.delete-prompt').css('display', 'none'));
    $('.delete-prompt').on('click', '.proceedBtn', () => {$('.delete-prompt').css('display', 'none');
    runApplication();
  });
  });
};
  
const handleSearch = () => {
  $('.search-form').on('submit', function(event) {
    event.preventDefault();
    combineResultsHtml = '';
    $('.search-results').empty();
    $('.totalResults').css('display', 'block');
    totalResults = 0;
    pageOffset = 0;
    
    const query = $(this).find('.js-query');
    currentFoodSearch = query.val();
    query.val('');

    handleFoodSearchRequest(currentFoodSearch, pageOffset);
  });
};

const loadMoreResults = () => {
  $('.search-add-section').on('click', '.loadBtn', function() {
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

