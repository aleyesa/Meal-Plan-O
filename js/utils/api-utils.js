const handleFoodReportRequest = (foodName, ndbno) => {
  const foodReportEndpoint = 'https://api.nal.usda.gov/ndb/V2/reports';
  let addMacroInfo = '';

  const requestParam = {
    api_key: 'Dque88jiOSae3F2qrzzsBSqCYrNxXMn5iydg3NLe',
    ndbno: ndbno,
  };

  $.getJSON(foodReportEndpoint, requestParam, (data) => {
      const includeIds = ['203', '204', '205', '208'];
      
      const includeMacros = {calories: '203', proteins: '204', fats: '205', carbs: '208'};

      const foodName = data.foods[0].food.desc.name;
      const nutrients = data.foods[0].food.nutrients;
      const filteredNutrients = nutrients.filter(nutrient => includeIds.includes(nutrient.nutrient_id));
      const { name, value, unit } = filteredNutrients[0]; 

      console.log('================\n');
      console.log('foodName: ', foodName);
      console.log('name: ', name);
      console.log('value: ', value);
      console.log('unit: ', unit);


      combineResultsHtml += displayResultHtml(foodName, addMacroInfo);

      $('.search-results').html(combineResultsHtml);
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



