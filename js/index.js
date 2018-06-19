const mealTableHtml = $('.meal-table-section').html();
let combineResultsHtml = '';
let currentFoodSearch = '';
let pageOffset = 0;
let totalResults = 0;

const specifyTabAndShowSection = () => {
  $('.meal-table-section nav').on('click', '.weekDay', function(event) {
    const that = $(this);
    const text = that.text().toLowerCase();

    that.parent().addClass('focus');
    that.parent().removeClass('unfocus');
    that.parent().siblings('div').removeClass('focus');
    that.parent().siblings('div').addClass('unfocus');

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
    <section class="foodItemSection">
      <h2>${mealSecName}</h2>
    </section>
    <section class="macroSection"></section>
  </section>
`;

const addMealSection = () => {              
  $('.meal-name-form').on('submit', function(event) {
    event.preventDefault();
    const mealSecName = $(this).find('.js-meal-name').val();

    $('.meal-names-section div').removeClass('mealSectionFocus');
    $('.meal-section-menu').siblings(`.meal-section-info`).addClass('hide');
    $(this).siblings('.meal-names-section').append(mealSectionTemplate(mealSecName));
    $(this).siblings('.meal-names-section').children(`.${mealSecName}`).addClass('mealSectionFocus');
    $(this).parent().after(mealSectionInfoTemplate(mealSecName));
    $('.js-meal-name').val("");
  });
};
                          
const removeMealSection = () => {
  $('.meal-table-section').on('click', '.deleteMealSecBtn', function(event) {
    const mealSecName = $(this).closest('div').find('a').text();
    $(this).closest('.meal-section-menu').siblings($(`.${mealSecName}`)).remove();
    $(this).closest('div').remove();
  });
};

const addFoodItemsToSection = () => {
  $('.meal-table-section').on('click', '.addFoodItemBtn', function(event) {
    event.stopPropagation();
    let currMealSec = $(this);
    let targetMealSecName = $(currMealSec).siblings('a').text();
    $('.meal-table-section').css('display', 'none');
    $('.search-add-section').css('display', 'block');
    $('.search-results').on('click', '.addBtn', function(event) {
    let  foodItemToAdd = $(this).parent().siblings('.foodName').text();
    $(currMealSec).closest('.meal-section-menu')
      .siblings(`.${targetMealSecName}`)
      .find('.foodItemSection')
      .append(`<p>${foodItemToAdd}<button class="removeFoodItem">x</button></p>`);

      $('.search-add-section').css('display', 'none');
      $('.search-results').empty();
      $('.meal-table-section').css('display', 'block');

      foodItemToAdd = '';
      currMealSec = '';

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

const handleFoodSearchRequest = (nameOfFood, offset) => {
  const ndbSearchEndpoint = 'https://api.nal.usda.gov/ndb/search';

  const requestParam = {
    api_key: 'Dque88jiOSae3F2qrzzsBSqCYrNxXMn5iydg3NLe',
    q: nameOfFood,
    offset,
    max: 10
  };

  $.getJSON(ndbSearchEndpoint, requestParam, (data) => {
    totalResults = data.list.total;

    $('.search-add-section').find('.totalResults').html(`Found ${totalResults} results for ${currentFoodSearch}`);
      const foodSearchResults = data.list.item.map((results) => {
        handleFoodReportRequest(results.name, results.ndbno);
    });
  });
};

const handleFoodReportRequest = (foodName, ndbno) => {
  const foodReportEndpoint = 'https://api.nal.usda.gov/ndb/V2/reports';
  let addPElem = '';

  const requestParam = {
    api_key: 'Dque88jiOSae3F2qrzzsBSqCYrNxXMn5iydg3NLe',
    ndbno: ndbno,
  };

  $.getJSON(foodReportEndpoint, requestParam, (data) => {
    for (let i = 0; i < data.foods[0].food.nutrients.length; i++) {
    
      if (data.foods[0].food.nutrients[i].nutrient_id === '208' || 
          data.foods[0].food.nutrients[i].nutrient_id === '205' || 
          data.foods[0].food.nutrients[i].nutrient_id === '204' ||
          data.foods[0].food.nutrients[i].nutrient_id === '203' ) {

        addPElem += ('<p>' + 
          data.foods[0].food.nutrients[i].name + ': ' + 
          data.foods[0].food.nutrients[i].value + ' ' +
          data.foods[0].food.nutrients[i].unit + '</p>');
      }
    }

    combineResultsHtml += displayResultHtml(foodName, addPElem);
    $('.search-results').html(combineResultsHtml);
  });
};

const displayResultHtml = (foodName, macros) => 
`
  <div class="dropdown">
  <a href="#" class="foodName">${foodName}</a>
    <div class="dropdown-content">
    <strong><u>Macros</u></strong>
    ${macros}
    <button class="addBtn">Add</button>
    </div>
  </div>
`;

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

const runApplication = () => {
    specifyTabAndShowSection();
    addMealSection();
    removeMealSection();
    addFoodItemsToSection();
    removeFoodItem();
    goBackToTable();
    resetMealPlan();
    handleSearch();
    loadMoreResults();
};

runApplication();

