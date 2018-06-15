//mealTableHtml holds the initial html of meal table section used to reset meal plan
const mealTableHtml = $('.meal-table-section').html();
//add variable is used to combine html food item results 
let add = '';
//currentFoodSearch variable holds the current food item search
let currentFoodSearch = '';
//offset is used to load more food search results
let offset = 0;
//totalResults holds the total search results
let totalResults = 0;
/*                                 Meal Table Manipulation                                     */
//Highlights the day tab that user selected and shows the specified meal section
const specifyTabAndShowSection = () => {
$('.meal-table-section nav').on('click', '.weekDay', function(event) {
    const that = $(this);
    that.addClass('redCircle');
    that.parent().addClass('focus');
    that.parent().removeClass('unfocus');
    that.parent().siblings('div').children('.weekDay').removeClass('redCircle');
    that.parent().siblings('div').removeClass('focus');
    that.parent().siblings('div').addClass('unfocus');
    const text = that.text().toLowerCase();

    const mapDaysToSelectors = { 
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

    for (let key in mapDaysToSelectors) {
        const selector = mapDaysToSelectors[key];

        if (key === text) {
            showCurDay(selector);
            hideOtherDays(selector);
            // break;
        } else {
            // showCurDay(mapDaysToSelectors.defaultDays);
        }
    };
});
};
//The html used to add a meal section, followed by an add meal section button
const mealSectionTemplate = (mealSecName) =>
 `
        <div class="${mealSecName}">
            <a href="#">${mealSecName}</a>
            <button class="deleteMealSecBtn far fa-trash-alt"></button>
            <button class="editMealSecBtn far fa-edit"></button>
        </div>
`;
const mealSectionInfoTemplate = (mealSecName) =>
`        <section class="${mealSecName} meal-section-info">
            <section class="foodItemSection">
                <h2>${mealSecName}</h2>
            </section>
            <section class="macroSection"></section>
        </section>
`;
//adds a meal section on specified day                                   
const addMealSection = () => {              
$('.meal-name-form').on('submit', function (event) {
    event.preventDefault();
    const mealSecName = $(this).find('.js-meal-name').val();
    $('.meal-names-section div').removeClass('mealSectionFocus');
    //hide other meal section info
    console.log($('.meal-section-menu').siblings('.section').css('display', 'hidden'));
    $(this).siblings('.meal-names-section').append(mealSectionTemplate(mealSecName));
    $(this).siblings('.meal-names-section').children(`.${mealSecName}`).addClass('mealSectionFocus');
    $(this).parent().after(mealSectionInfoTemplate(mealSecName));
    

    $('.js-meal-name').val("");
});
};
//remove a specified meal section on the specified day                              
const removeMealSection = () => {
$('.meal-table-section').on('click', '.deleteMealSecBtn', function (event) {
    console.log($(this).closest('div').find('a').text());
    console.log($(this).parent().parent().parent().parent().children(`.${$(this).closest('div').find('a').text()}`).remove());
    console.log($(this).closest('div').remove().html());
});
};
//adds food item on specified meal section
const editMealSection = () => {
let mealSection = '';
let mealSecName = '';
let foodItemToAdd = '';
$('.meal-table-section').on('click', '.editMealSecBtn', function(event) {
    //holds current clicked button
    event.stopPropagation();
    mealSection = this;
    mealSecName = $(this).siblings('a').text();
    //we go to the search- section
    $('.meal-table-section').css('display', 'none');
    $('.search-add-section').css('display', 'block');
    //search for the item            
    $('.search-results').on('click', '.addBtn', function(event) {
        foodItemToAdd = $(this).parent().siblings('.foodName').text();
        $(mealSection).parent().parent().parent().siblings(`.${mealSecName}`).find('.foodItemSection').append(`<p>${foodItemToAdd}<button class="removeFoodItem">x</button></p>`);
            $('.search-add-section').css('display', 'none');
            $('.search-results').empty();
            mealSecName = '';
            add = '';
            $('.meal-table-section').css('display', 'block');
    });    
});
};
//remove food item
const removeFoodItem = () => {
$('.meal-table-section').on('click', '.removeFoodItem', function(event) {
    console.log($(this).parent().remove());
});
};
//Navigate back to table
const goBackToTable = () => {
$('.search-add-section').on('click', '.tableBtn', () => {    
    $('.search-add-section').css('display', 'none');
    $('.search-results').empty();
    add = '';
    $('.meal-table-section').css('display', 'block');
});
};
//resets meal plan
const resetMealPlan = () => {
$('.meal-table-section').on('click', '.resetTableBtn', () => {
    $('.delete-prompt').css('display', 'block');
    $('.delete-prompt').on('click', '.exitBtn', () => $('.delete-prompt').css('display', 'none'));
    $('.delete-prompt').on('click', '.proceedBtn', () => $('.meal-table-section').html(mealTableHtml));
});
};
//Food Search API sends keyword queries and returns lists of foods which contain one or 
//more of the keywords in the food description, scientific name, or commerical name fields.
const handleFoodSearchRequest = (nameOfFood, offset) => {
    const ndbSearchEndpoint = 'https://api.nal.usda.gov/ndb/search';
    const requestParam = {
        api_key: 'Dque88jiOSae3F2qrzzsBSqCYrNxXMn5iydg3NLe',
        q: nameOfFood,
        offset: offset,
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
//Food Report API is a list of nutrients and their values in various portions for a specific food.
const handleFoodReportRequest = (foodName, ndbno) => {
    const foodReportEndpoint = 'https://api.nal.usda.gov/ndb/V2/reports';
    let addP = '';
    const requestParam = {
        api_key: 'Dque88jiOSae3F2qrzzsBSqCYrNxXMn5iydg3NLe',
        ndbno: ndbno,
    };
    $.getJSON(foodReportEndpoint, requestParam, (data) => {
        for(let i = 0; i < data.foods[0].food.nutrients.length; i++)
        {
            if( data.foods[0].food.nutrients[i].nutrient_id === '208' || 
                data.foods[0].food.nutrients[i].nutrient_id === '205' || 
                data.foods[0].food.nutrients[i].nutrient_id === '204' ||
                data.foods[0].food.nutrients[i].nutrient_id === '203' ){
            
                    addP += ('<p>' + data.foods[0].food.nutrients[i].name + ': ' + 
                    data.foods[0].food.nutrients[i].value + ' ' +
                    data.foods[0].food.nutrients[i].unit + '</p>');
            }
        }
        add += renderResult(foodName, addP);
        $('.search-results').html(add);
    });
};
//holds the html to display food item results
const renderResult = (foodName, macros) => {
    return `
    <div class="dropdown">
    <a href="#" class="foodName">${foodName}</a>
        <div class="dropdown-content">
        <strong><u>Macros</u></strong>
        ${macros}
        <button class="addBtn">Add</button>
        </div>
    </div>
    `;
  };
//Gets user input from search text field and sends it to food search request
const handleSearch = () => {
    $('.search-form').on('submit', function(event) {
        event.preventDefault();
        //empties food search results when user submits a new search
        add = '';
        totalResults = 0;
        //start search results list at the beginning
        offset = 0;
        const query = $(this).find('.js-query');
        const foodItem = $(this).find('.js-query').val();
        //holds current food search item to use within the file
        currentFoodSearch = foodItem;
        // clear out the input
        query.val('');
        handleFoodSearchRequest(foodItem, offset);
    });
};
//loads more search results when user clicks load button
const loadMoreResults = () => {
$('.search-add-section').on('click', '.loadBtn', function(event) {
    if(currentFoodSearch === ''){
        console.log('no food item searched');
    }else if(offset > totalResults){
        console.log('offset is higher than totalResults');
    }else{
        offset += 10;
        handleFoodSearchRequest(currentFoodSearch, offset);
    }
});
};
//main run function
const runApplication = () => {
    specifyTabAndShowSection();
    addMealSection();
    removeMealSection();
    editMealSection();
    removeFoodItem();
    goBackToTable();
    resetMealPlan();
    handleSearch();
    loadMoreResults();
};
//invoke run application
runApplication();

// Search Section Tester
// $('.search-results').html(renderResult('Burger', 
//     `<p>Energy: 282 kcal</p>
//      <p>Protein: 16.83 g</p>
//      <p>Total lipid (fat): 16.13 g</p>
//      <p>Carbohydrate, by difference: 17.43 g</p>`));

//************************************************create a way to set the name of the meal section

localStorage.setItem('test', 1);
localStorage.removeItem('test');
/**/
const days = {
    sunday: {
        breakfast: {
            banana: {
                qty: 1,
                calories: 70,
                proteins: 20,
                fats: 10,
                carbs: 12
            }
        }
    },
    monday: {

    }  
};

//gets and sets to manipulate the object days
