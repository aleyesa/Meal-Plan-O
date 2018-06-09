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
$('.meal-table-section nav').on('click', 'a', function(event) {
    const that = $(this);
    that.addClass('highlight');
    that.siblings('a').removeClass('highlight');
    const text = that.text().toLowerCase();
    const defaultDays = 'Show All(+)';
    const mapDaysToSelectors = { 
        sun: '.sunday-section', 
        mon: '.monday-section',                         
        tue: '.tuesday-section', 
        wed: '.wednesday-section', 
        thu: '.thursday-section', 
        fri: '.friday-section', 
        sat: '.saturday-section', 
        defaultDays: '.sunday-section, .monday-section, .tuesday-section, .wednesday-section, .thursday-section, .friday-section, .saturday-section' 
    };

    const showCurDay = selector => $(selector).removeClass('hide');
    const hideOtherDays = selector => $(selector).siblings('section').addClass('hide');

    for (let key in mapDaysToSelectors) {
        const selector = mapDaysToSelectors[key];

        if (key === text) {
            showCurDay(selector);
            hideOtherDays(selector);
            break;
        } else {
            showCurDay(mapDaysToSelectors.defaultDays);
        }
    };


//     if($(this).text() === 'Sun'){
//         $('.sunday-section').removeClass('hide');
//         $('.sunday-section').siblings('section').addClass('hide');
//     }else if($(this).text() === 'Mon'){
//         $('.monday-section').removeClass('hide');
//         $('.monday-section').siblings('section').addClass('hide');
//     }else if($(this).text() === 'Tue'){
//         $('.tuesday-section').removeClass('hide');
//         $('.tuesday-section').siblings('section').addClass('hide');
//     }else if($(this).text() === 'Wed'){
//         $('.wednesday-section').removeClass('hide');
//         $('.wednesday-section').siblings('section').addClass('hide');
//     }else if($(this).text() === 'Thu'){
//         $('.thursday-section').removeClass('hide');
//         $('.thursday-section').siblings('section').addClass('hide');
//     }else if($(this).text() === 'Fri'){
//         $('.friday-section').removeClass('hide');
//         $('.friday-section').siblings('section').addClass('hide');
//     }else if($(this).text() === 'Sat'){
//         $('.saturday-section').removeClass('hide');
//         $('.saturday-section').siblings('section').addClass('hide');
//     }else if($(this).text() === 'Show All(+)'){
//         $('.sunday-section, .monday-section, .tuesday-section, .wednesday-section, .thursday-section, .friday-section, .saturday-section').removeClass('hide');
//         $(this).text('Show All(-)');
//     }else {
//         $('.sunday-section, .monday-section, .tuesday-section, .wednesday-section, .thursday-section, .friday-section, .saturday-section').addClass('hide');
//         $(this).text('Show All(+)');
//     }
});
};
//The html used to add a meal section, followed by an add meal section button
const mealSectionTemplate = () =>
 `
        <div>
            <h2>Meal<button class="deleteMealSecBtn">x</button></h2>
            <section>
                <button class="addFoodBtn">+</button>
            </section>
        </div>
        <div>
                <button class="addMealSecBtn">+</button>
        </div>
`;
//adds a meal section on specified day                                   
const addMealSection = () => {              
$('.meal-table-section').on('click', '.addMealSecBtn', function (event) {
    // console.log($(this).parent().closest('div').html());
    $(this).parent().closest('div').replaceWith(mealSectionTemplate());
});
};
//remove a specified meal section on the specified day                              
const removeMealSection = () => {
$('.meal-table-section').on('click', '.deleteMealSecBtn', function (event) {
    $(this).closest('div').remove().html();
});
};
//adds food item on specified meal section
const addFoodItem = () => {
$('.meal-table-section').on('click', '.addFoodBtn', function(event) {
    //holds current clicked button
    let mealSection = this;
    //we go to the search- section
    $('.meal-table-section').css('display', 'none');
    $('.search-add-section').css('display', 'block');
    //search for the item
    $('.search-results').on('click', '.addBtn', function(event) {
        let foodItemToAdd = $(this).parent().siblings('.foodName').text();

            $(mealSection).parent().closest('section').replaceWith(`<p>${foodItemToAdd}<button class="removeFoodItem">x</button> </p>
            <section><button class="addFoodBtn">+</button></section>`);
            $('.search-add-section').css('display', 'none');
            $('.search-results').empty();
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
        for(let i = 1; i < 5; i++)
        {
            addP += ('<p>' + data.foods[0].food.nutrients[i].name + ': ' + 
                     data.foods[0].food.nutrients[i].value + ' ' +
                     data.foods[0].food.nutrients[i].unit + '</p>');
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
    addFoodItem();
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

