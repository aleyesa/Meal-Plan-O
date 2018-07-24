let combineResultsHtml = '';
let currentFoodSearch = '';
let pageOffset = 0;
let totalResults = 0;
let mealNameSecIdentifier = 0;
let currMealSec = '';
let targetMealSecName = ''; 

//keep tabs on total macros for each day meal sections
const totalMacros = {
  cals:  0,
  pros:  0,
  fats:  0,
  carbs: 0
};

//When user clicks on a day tab, we show its section
const specifyTabAndShowSection = () => {
  $('.meal-table-section nav').on('click', '.weekDay', function() {
    //hide introduction section
    $('.step1').hide();
    const that = $(this);
    const text = that.text().toLowerCase();

    //change back-ground color to show specified day tab has been clicked, and hides other days
    that.parent().addClass('focus');
    that.parent().siblings('li').removeClass('focus');

    //object holding each days section
    const mapDayTabToItsSection = { 
      sun: '.sunday-section', 
      mon: '.monday-section',                         
      tue: '.tuesday-section',
      wed: '.wednesday-section', 
      thu: '.thursday-section', 
      fri: '.friday-section', 
      sat: '.saturday-section', 
    };

    //function to show the specified day and its section
    const showCurDay = selector => {
      $(selector).removeClass('hide');
      $(selector).addClass('showMealSection');
    };

    //function to hide other days and its section
    const hideOtherDays = selector => {
      $(selector).siblings('section').addClass('hide');
      $(selector).siblings('section').removeClass('showMealSection');
    };

    //when user clicks on a day we check the day that has been clicked and iterate over days object to get the specified days section.
    for (let key in mapDayTabToItsSection) {
      const selector = mapDayTabToItsSection[key];

      if (key === text) {
        showCurDay(selector);
        hideOtherDays(selector);
        //if there is no created meal sections on specified day, we display text that there is no meal sections created.
        if($(selector).find('.meal-names-section').find('div').attr('class') === undefined) {
          $(selector).children('.step2').show();
        } else {
          $(selector).children('.step2').hide();
        }
      }
    }
  });
};

//when user selects on a created meal name, we show its section.
const selectMealSection = () => {
  $('.meal-names-section').on('click', 'div', function() {
    //hide no meal section notification
    $(this).closest('.showMealSection').find('.step2').hide();
    const targetMealSecName = $(this).attr('class');
    const selectedDaysMealSecMenu = $(this).closest('.meal-section-menu');
    //hide the other meal sections
    selectedDaysMealSecMenu.siblings(`.meal-section-info`).css('display', 'none');
    //show specified meal name section.
    selectedDaysMealSecMenu.siblings(`.${targetMealSecName}`).css('display', 'flex');
  });
};

//function to create a meal names section
const addMealSection = () => {              
  $('.meal-name-form').on('submit', function(event) {
    event.preventDefault();
    //hide no meal section notification
    $('.step2').hide();
    //initialize created meal sections total macros to 0;
    totalMacros.cals = 0;
    totalMacros.pros = 0;
    totalMacros.fats = 0;
    totalMacros.carbs = 0;
    //gets the name of created meal names section
    const mealSecName = $(this).find('.js-meal-name-input').val();
    //get to the meal-names-section
    const thisDaysMealNameSec = $(this).siblings('.meal-names-section');
    //hide all meal section info 
    $(this).closest('.meal-section-menu').siblings(`.meal-section-info`).css('display', 'none');
    //add created meal name to meal names section
    thisDaysMealNameSec.append(mealSectionNameTemplate(mealSecName));
    // $(this).parent().after(mealSectionInfoTemplate(mealSecName));
    $(this).closest('.showMealSection').append(mealSectionInfoTemplate(mealSecName));
    //clear form text field input
    $('.js-meal-name-input').val("");
    //used to make each meal names section class unique by adding a different number.
    mealNameSecIdentifier++;
  });
};
             
//function remove a specified meal section
const removeMealSection = () => {
  $('.meal-table-section').on('click', '.deleteMealSecBtn', function() {
    //gets to the meal section name by its class
    const selectedMealSecName = $(this).parent().parent().attr('class');
    //gets to the first shown meal names section
    const firstMealNameSec = $(this).parent().parent().siblings('div').attr('class');
    //gets to the selected days meal section menu
    const selectedDaysMealSecMenu = $(this).closest('.meal-section-menu');
    //finds all classes called 'meal-section-info' in current day and hides them
    selectedDaysMealSecMenu.siblings(`.meal-section-info`).css('display', 'none');
    //show the first meal names section
    selectedDaysMealSecMenu.siblings(`.${firstMealNameSec}`).css('display', 'flex');
    //checks if there is no meal names in meal names section, if there is show notification, else hide.
    if(firstMealNameSec === undefined) {
      $(this).closest('.showMealSection').find('.step2').show();
    } else {
      $(this).closest('.showMealSection').find('.step2').hide();
    }
    //removes specified meal name
    $(this).closest('.meal-section-menu').siblings(`.${selectedMealSecName}`).remove();
    //removes the meal info sections related to specified meal name
    $(this).closest(`.${selectedMealSecName}`).remove();
  });
};

//returns macro info and converts the string value to number format
const getMacroInfo = (macroInfo) => {
  const macroValues = {
    cals:  Number(macroInfo.find('.calories').text()),
    pros:  Number(macroInfo.find('.proteins').text()),
    fats:  Number(macroInfo.find('.fats').text()),
    carbs: Number(macroInfo.find('.carbohydrates').text())
  };

  return macroValues;
};

//gets previous total of every macro nutrient and either subtracts or adds on to total.
const calcTotalMacros = (operation, macroValues) => {
  const getToTotalMacroSec = currMealSec.closest('.meal-section-menu').siblings(`.${targetMealSecName}`);
  const prevTotalCals  = Number(getToTotalMacroSec.find('.macroSection .calories').text());
  const prevTotalPros  = Number(getToTotalMacroSec.find('.macroSection .proteins').text());
  const prevTotalFats  = Number(getToTotalMacroSec.find('.macroSection .fats').text());
  const prevTotalCarbs = Number(getToTotalMacroSec.find('.macroSection .carbohydrates').text());

  totalMacros.cals  = eval(prevTotalCals  + operation + macroValues.cals);
  totalMacros.pros  = eval(prevTotalPros  + operation + macroValues.pros);
  totalMacros.fats  = eval(prevTotalFats  + operation + macroValues.fats);
  totalMacros.carbs = eval(prevTotalCarbs + operation + macroValues.carbs);
};

//gets added food item and its macro info into specified food item section.
const getFoodItemToSec = (foodItemToAdd, macroInfo) => {
  //gets to the specfied food item section on that day.
  const selectedMealFoodItemSec = currMealSec.closest('.meal-section-menu')
  .siblings(`.${targetMealSecName}`)
  .find('.foodItemSection');

  //hides the no food notification
  selectedMealFoodItemSec.find('.noFoodNotification').hide();
  //show added food item with its macro nutrients in the specified food item section.
  selectedMealFoodItemSec.append(addedFoodItemTemplate(foodItemToAdd) + macroInfo);
};

//replace macrosection html with updated macro total. 
const updateTotalMacrosToSec = () => {
  currMealSec.closest('.meal-section-menu')
  .siblings(`.${targetMealSecName}`)
  .find('.macroSection')
  .html(macroInfoTotalTemplate(totalMacros));
};

//get specified food item from search results.
const addedFoodItemFromList = () => {
  $('.search-results').on('click', '.addBtn', function() {
    const addBtn = $(this);
    //gets food name
    const foodItemToAdd = addBtn.parent().find('.foodName').html();
    //gets macro info from selected food item
    const macroInfo = addBtn.siblings('div');
    //gets selected food item and put in specified food item section
    getFoodItemToSec(foodItemToAdd, macroInfoTemplateForPlanner(getMacroInfo(macroInfo)));
    //sums the selected food item to each current macro totals
    calcTotalMacros('+', getMacroInfo(macroInfo));
    //then update macro section
    updateTotalMacrosToSec();
    //toaster letting user know that a specified food item has been added.
    addBtn.siblings('.notification')
      .show()
      .delay(4000)
      .fadeOut();
  });    
};

//shows food search once user has clicked add food item
const addFoodItemInfoToSection = () => {
  $('.meal-table-section').on('click', '.addFoodItemBtn', function() {
    currMealSec = $(this);
    //gets the specified meal name section by class
    targetMealSecName = currMealSec.parent().parent().attr('class');
    //hides meal planner and search results total
    $('.meal-table-section, .totalResults').css('display', 'none');
    //show search section
    $('.search-add-section').css('display', 'block');
    //show back to planner link
    $('.backToTable').show();
    //hide food search load button
    $('.loadBtn').hide();
    //clears search-results html
    $('.search-results').empty();

    //empty current food search
    currentFoodSearch = '';
  });
  //gets specified food item info
  addedFoodItemFromList();
};

//removes specified food item from food section and subtracts food item macro info from total.
const removeFoodItem = () => {
  $('.meal-table-section').on('click', '.removeFoodItem', function() {
    //gets meal section name class only, ignores other classes in the tag
    targetMealSecName = $(this).closest('.meal-section-info').attr('class').replace(/meal-section-info/, '');
    //used to specify current meal section
    currMealSec = $('main').find(`.meal-names-section .${targetMealSecName} .addFoodItemBtn`);

    const selectedFoodItem = $(this).parent();
    const macroInfo = selectedFoodItem.next('div');
    //subtracts specified food item from macro info totals
    calcTotalMacros('-', getMacroInfo(macroInfo));
    //then update
    updateTotalMacrosToSec();

    const noFood = (selectedFoodItem.siblings('.addedFoodItem').html());

    //if foodInfoSection has no class foodName, then we show the notification
    if(noFood === undefined) {
        $(this).closest('.foodItemSection').find('.noFoodNotification').show();
      }

    //remove food item macro info from food section
    macroInfo.remove();
    //removes food item name from food section
    selectedFoodItem.remove();
  });
};

//shows only the planner contents, hides other content
const goBackToTable = () => {
  $('body').on('click', '.backToTable', () => {    
    $('.pdfFriendly-section, .backToTop').hide();
    $('.search-add-section, .totalResults').css('display', 'none');
    $('.search-results').empty();
    $('.meal-table-section').css('display', 'flex');
    $('.backToTable').hide();
    $('main').show();
    $('.meal-section-menu').show();
    combineResultsHtml = '';
  });
};

//resets everything to initial load.
const resetMealPlan = () => {
  $('.meal-table-section').on('click', '.resetTableBtn', () => {
    $('main').hide();
    $('.delete-prompt').css('display', 'block');
    $('.delete-prompt').on('click', '.exitBtn', () => {
    $('.delete-prompt').css('display', 'none');
    $('main').show();
  });
    $('.delete-prompt').on('click', '.proceedBtn', () => {
      $('.delete-prompt').css('display', 'none');

      $('section').find('.showMealSection').addClass('hide');
      $('section').removeClass('showMealSection');
      $('nav li').removeClass('focus');
      $('.step1, main').show();

      createDayInfoTemplate();
      specifyTabAndShowSection();
      addMealSection();
      selectMealSection();
      saveAsPdf();
  });
  });
};
  
//function to handle food search, using food search and macro nutrient api.
const handleSearch = () => {
  $('.search-form').on('submit', function(event) {
    event.preventDefault();
    combineResultsHtml = '';
    $('.backToTop').show();
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

//request more data from food search api and show in results section.
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

//copies content from each day section into a pdfFriendly version to download or print.
const saveAsPdf = () => {
  $('.meal-section-features').on('click', '.pdfBtn', function(event) {
    //show back to planner button in order to get back
    $('.backToTable').show();

    //hides all day sections
    $('.sunday-section, .monday-section, .tuesday-section, .wednesday-section, .thursday-section, .friday-section, .saturday-section').find('.meal-section-menu').hide();
    //hide the main content
    $('main').hide();

    //object used to separate the day with its specific meal info.
    const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    //helps combine all the day sections with its meal info together to be put into a different section.
    let  pdfFriendlyHtml = '';

    //html template used to get each day with its own meal section info
    const mealPlanReplacement = weekDaysArray => 
    `
      <h2>${weekDaysArray}</h2>
      ${$(`.${weekDaysArray.toLowerCase()}-section`).has('.meal-section-info').html()}
    `;

    //iterate over days object and combine the days with its meal section info
    weekDays.forEach( day => {
      const currentInfo = mealPlanReplacement(day);
      const string2 = ($(`.${day.toLowerCase()}-section`).find('.foodItemSection .addedFoodItem').html());
      
      if (string2 !== undefined){
      pdfFriendlyHtml += currentInfo;
      } 
    });
  
    //add the formatted content to pdfFriendly section
    $('.pdfFriendly-section').html($(pdfFriendlyHtml));
    //set pdFFriendly section meal section info to show as flex row
    $('.pdfFriendly-section').find('.meal-section-info').css('display', 'flex');
    $('.pdfFriendly-section .meal-section-info').css('width', '100%');
    //display the pdf section
    $('.pdfFriendly-section').show();
    //call window to print
    window.print();
});
};

//function to hold main functions
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
