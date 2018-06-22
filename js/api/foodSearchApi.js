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
