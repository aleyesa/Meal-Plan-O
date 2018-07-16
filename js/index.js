let combineResultsHtml = '';
let currentFoodSearch = '';
let pageOffset = 0;
let totalResults = 0;
let mealNameSecIdentifier = 0;
let currMealSec = '';
let targetMealSecName = ''; 
let mainHtml = $('main').html();

const totalMacros = {
  cals:  0,
  pros:  0,
  fats:  0,
  carbs: 0
};

const specifyTabAndShowSection = () => {
  $('.meal-table-section nav').on('click', '.weekDay', function() {
    $('.step1').hide();
    $('.step2').hide();
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
    $('.step2').hide();
    const targetMealSecName = $(this).attr('class');
    const selectedDaysMealSecMenu = $(this).closest('.meal-section-menu');
    $('.meal-section-menu').siblings(`.meal-section-info`).css('display', 'none');
    selectedDaysMealSecMenu.siblings(`.${targetMealSecName}`).css('display', 'flex');
  });
};

const addMealSection = () => {              
  $('.meal-name-form').on('submit', function(event) {
    event.preventDefault();
    $('.step2').hide();
    const mealSecName = $(this).find('.js-meal-name-input').val();
    const thisDaysMealNameSec = $(this).siblings('.meal-names-section');
    $('.meal-section-menu').siblings(`.meal-section-info`).css('display', 'none');
    thisDaysMealNameSec.append(mealSectionNameTemplate(mealSecName));
    // $(this).parent().after(mealSectionInfoTemplate(mealSecName));
    $(this).closest('.showMealSection').append(mealSectionInfoTemplate(mealSecName));
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
    const addBtn = $(this);
    let foodItemToAdd = addBtn.parent().find('.foodName').html();

    let macroInfo = addBtn.siblings('div');
    getFoodItemToSec(foodItemToAdd, macroInfoTemplateForPlanner(getMacroInfo(macroInfo)));
    calcTotalMacros('+', getMacroInfo(macroInfo));
    updateTotalMacrosToSec();

    addBtn.siblings('.notification').show().fadeOut(4800);

    // $('.search-add-section').css('display', 'none');
    // $('.search-results').empty();
    // $('.meal-table-section').css('display', 'block');
  });    
};

const addFoodItemInfoToSection = () => {
  $('.meal-table-section').on('click', '.addFoodItemBtn', function() {
    currMealSec = $(this);
    targetMealSecName = currMealSec.parent().attr('class');
    $('.meal-table-section, .totalResults').css('display', 'none');
    $('.search-add-section').css('display', 'block');
    $('.backToTable').show();
    $('.loadBtn').hide();
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
  $('body').on('click', '.backToTable', () => {    
    $('.pdfFriendly-section').hide();
    $('.search-add-section, .totalResults').css('display', 'none');
    $('.search-results').empty();
    $('.meal-table-section').css('display', 'block');
    $('.backToTable').hide();
    $('main').show();
    $('.meal-section-menu').show();
    combineResultsHtml = '';
  });
};

const resetMealPlan = () => {
  $('.meal-table-section').on('click', '.resetTableBtn', () => {
    $('.delete-prompt').css('display', 'block');
    $('.delete-prompt').on('click', '.exitBtn', () => $('.delete-prompt').css('display', 'none'));
    $('.delete-prompt').on('click', '.proceedBtn', () => {$('.delete-prompt').css('display', 'none');

    createDayInfoTemplate();
    specifyTabAndShowSection();
    addMealSection();
    selectMealSection();
    saveAsPdf();
  });
  });
};
  
const handleSearch = () => {
  $('.search-form').on('submit', function(event) {
    event.preventDefault();
    combineResultsHtml = '';
    $('.search-results').empty();
    $('.totalResults').css('display', 'block');
    $('.loadBtn').show();
    totalResults = 0;
    pageOffset = 0;
    
    const query = $(this).find('.js-query');
    currentFoodSearch = query.val();
    query.val('');

    handleFoodSearchRequest(currentFoodSearch, pageOffset);
  });;
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

let pdfFriendlyHtml = '';

const saveAsPdf = () => {
  const mealTableHtml = $('meal-table-section').html();

  $('.meal-section-features').on('click', '.pdfBtn', function(event) {
    $('.backToTable').show();
    pdfFriendlyHtml = '';
  //   $('.sunday-section, .monday-section, .tuesday-section, .wednesday-section, .thursday-section, .friday-section, .saturday-section').removeClass('hide');
  //   $('.sunday-section, .monday-section, .tuesday-section, .wednesday-section, .thursday-section, .friday-section, .saturday-section').addClass('showMealSection');
  //   $('.sunday-section, .monday-section, .tuesday-section, .wednesday-section, .thursday-section, .friday-section, .saturday-section').find('.meal-section-info').show();
    $('.sunday-section, .monday-section, .tuesday-section, .wednesday-section, .thursday-section, .friday-section, .saturday-section').find('.meal-section-menu').hide();
    $('main').hide();
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    $('.meal-section-info').css('display', 'block');

    $('.sunday-section .monday-section .tuesday-section .wednesday-section .thursday-section .friday-section .saturday-section').remove();


    const mealPlanReplacement = weekDaysArray => 
    `
      <h2>${weekDaysArray}</h2>
      ${$(`.${weekDaysArray.toLowerCase()}-section`).has('.meal-section-info').html()}
    `;
      $('.meal-section-info').css('width', '100%');

    weekDays.forEach( day => {
      let currentInfo = mealPlanReplacement(day);
      const string2 = ($(`.${day.toLowerCase()}-section`).find('.foodItemSection div').html());
      
      if (string2 !== undefined){
      pdfFriendlyHtml += currentInfo;
      console.log(pdfFriendlyHtml);
      //problem is when adding a meal section, it adds the meal section in the front.
      } 
    });
   
    $('.pdfFriendly-section').html($(pdfFriendlyHtml));
    $('.pdfFriendly-section').show();
    window.print();
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
