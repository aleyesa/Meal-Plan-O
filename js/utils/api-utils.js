//Api to get food search results
const handleFoodSearchRequest = (nameOfFood, offset) => {
  const ndbSearchEndpoint = 'https://api.nal.usda.gov/ndb/search';

  const requestParam = {
    api_key: 'Dque88jiOSae3F2qrzzsBSqCYrNxXMn5iydg3NLe',
    q: nameOfFood,
    offset,
    max: 12
  };

  $.getJSON(ndbSearchEndpoint, requestParam, (data) => {
    try {
      //gets total results from api.
      totalResults = data.list.total;
      //show total results on food item search
      $('.search-add-section').find('.totalResults').html(`Found ${totalResults} results for ${currentFoodSearch}`);
      
      //calls handleFoodReport to request macro info on food search items.
      const foodSearchResults = data.list.item.map((results) => {
        handleFoodReportRequest(results.ndbno);
        $('.loadBtn').show();
      });
    } catch(error) {
      $('.loadBtn').hide();
      $('.search-add-section').find('.totalResults').html(`No entries found for ${currentFoodSearch}`);
    }
  });
};

//api to get macro info on the food items
const handleFoodReportRequest = (ndbno) => {
  const foodReportEndpoint = 'https://api.nal.usda.gov/ndb/V2/reports';
  let addMacroInfo = '';

  const requestParam = {
    api_key: 'Dque88jiOSae3F2qrzzsBSqCYrNxXMn5iydg3NLe',
    ndbno: ndbno,
  };

  $.getJSON(foodReportEndpoint, requestParam, (data) => {
      //macro nutrient ids from api(calories, proteins, fats, carbs)
      const includeIds = ['203', '204', '205', '208'];
      //gets foodName from request
      const foodName = data.foods[0].food.desc.name;
      //gets nutrient info from request
      const nutrients = data.foods[0].food.nutrients;
      //only get chosen nutrients based on nutrient id.
      const filteredNutrients = nutrients.filter(nutrient => includeIds.includes(nutrient.nutrient_id));

      //gets the macro nutrient name, value and its unit.
      filteredNutrients.forEach(key => {
        const { name, value, unit } = key; 
        //combine and format macro nutrients name, value, and unit.
        addMacroInfo += (macroInfoTemplateForResults(name.replace(/(total|\s|\W|lipid|by|difference)/gi, '').replace(/energy/i, 'calories')
        .replace(/protein/i, 'proteins').replace(/fat/, 'fats').replace(/carbohydrate/i, 'carbohydrates').toLowerCase(), Math.round(value), unit));
      });
      //combine the name of food item and its macro info together in one html.
      combineResultsHtml += displayResultHtml(foodName, addMacroInfo);

      //show food item results in search results section
      $('.search-results').html(combineResultsHtml);
      //hides food item added toaster notification
      $('.notification').hide();
  });
};
