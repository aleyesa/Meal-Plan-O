//A search request sends keyword queries and returns lists of foods which contain one or 
//more of the keywords in the food description, scientific name, or commerical name fields.
const handleFoodSearchRequest = (nameOfFood) => {
    const ndbSearchEndpoint = 'https://api.nal.usda.gov/ndb/search';
    const requestParam = {
        api_key: 'Dque88jiOSae3F2qrzzsBSqCYrNxXMn5iydg3NLe',
        q: nameOfFood,
    };
    $.getJSON(ndbSearchEndpoint, requestParam, (data) => {
        const foodSearchResults = data.list.item.map((results) => 
        renderResult(results)
    );
    $('.search-results').html(foodSearchResults);
    });
};
//A Food Report is a list of nutrients and their values in various portions for a specific food.
const handleFoodReportRequest = (ndbno) => {
    const foodReportEndpoint = 'https://api.nal.usda.gov/ndb/V2/reports';
    const requestParam = {
        api_key: 'Dque88jiOSae3F2qrzzsBSqCYrNxXMn5iydg3NLe',
        ndbno: ndbno
    };
    $.getJSON(foodReportEndpoint, requestParam, (data) => {
        for(let i = 1; i < 5; i++)
        {
            console.log(data.foods[0].food.nutrients[i]);
        }
    });
};

function renderResult(result) {
    return `
    <h2>${result.name}</h2>
    <div class="dropdown">
        <span>Macros</span>
        <div class="dropdown-content">
            <p>Macro here</p>
        </div>
    </div>
    <p>${result.ndbno}</p>
    `;
  }

const handleSearch = () => {
    $('.search-form').submit(event => {
        event.preventDefault();
        const queryTarget = $(event.currentTarget).find('.js-query');
        const query = queryTarget.val();
        // clear out the input
        queryTarget.val("");
        handleFoodSearchRequest(query);
    });
};
handleSearch();
