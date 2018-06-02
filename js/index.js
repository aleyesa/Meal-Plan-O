//A search request sends keyword queries and returns lists of foods which contain one or 
//more of the keywords in the food description, scientific name, or commerical name fields.
const handleFoodSearchRequest = (nameOfFood) => {
    const ndbSearchEndpoint = 'https://api.nal.usda.gov/ndb/search';
    const requestParam = {
        api_key: 'API-Key',
        q: nameOfFood,
    };
    $.getJSON(ndbSearchEndpoint, requestParam, (data) => {
        let foodSearchResults = data.list.item.map((foodName) => 
        console.log('name: ' + foodName.name + '\n' + 'dbno: ' +  foodName.ndbno));
        handleFoodReportRequest(data.list.item[0].ndbno);
    });
};
//A Food Report is a list of nutrients and their values in various portions for a specific food.
const handleFoodReportRequest = (ndbno) => {
    const foodReportEndpoint = 'https://api.nal.usda.gov/ndb/V2/reports';
    const requestParam = {
        api_key: 'API-Key',
        ndbno: ndbno
    };
    $.getJSON(foodReportEndpoint, requestParam, (data) => {
        // let macros = data.foods.food.map((macro) => 
        // macro);
        for(let i = 1; i < 5; i++)
        {
        console.log(data.foods[0].food.nutrients[i]);
        }
    });
};

handleFoodSearchRequest('Burger King');






