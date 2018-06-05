
    // https://api.pdflayer.com/api/convert?access_key=6f976b9baaede103c03c9763adf6e9fd&document_html=<p>Hello</p>>&test=1

    // show only meal table, also hiding buttons
    // event listener to check if user clicks on 'Save as PDF' button
    const rawHtml = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge"><title>Meal Plan-O</title><link rel="stylesheet" type="text/css" href="./css/main.css" /><script src="https://code.jquery.com/jquery-3.3.1.min.js"integrity="sha256-FgpCb/KJQlLNfOu91ta32o/NMZxltwRo8QtmkMRdAu8="crossorigin="anonymous"></script></head><body><p>Hello</p></body><script src="./js/index.js"></script></html>';



const createMealPlanOnlyPdf = () => {
    // $.getJSON(
    //     `https://api.pdflayer.com/api/convert`,
    //     {
    //         access_key: access_key='6f976b9baaede103c03c9763adf6e9fd',
    //         test: 1,
    //         document_url: 'https://github.com/aleyesa/Meal-Plan-O/blob/master/index.html',
    //     }, (data) => console.log(data)
    //     );

    // $('.meal-table-section').on('click', '.pdfBtn', () => {
    // );  

    // }   
    // $('.meal-table-section').on('click', '.pdfBtn', () => {
        $.ajax(
            {
            method: 'POST',
            url: 'https://api.pdflayer.com/api/convert?access_key=6f976b9baaede103c03c9763adf6e9fd&test=1',
            data: {
                document_html: '<p>Hello</p>',
            },
            success: (data, status, a) => {
                let blob = new Blob([data], {type: 'application/pdf'});
                let URL = window.URL || window.webkitURL;
                let downloadUrl = URL.createObjectURL(blob);
             $('.meal-table-section a').attr('href', downloadUrl);
            }
            }
        );
};


createMealPlanOnlyPdf();



