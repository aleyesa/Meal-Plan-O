
    // https://api.pdflayer.com/api/convert?access_key=6f976b9baaede103c03c9763adf6e9fd&document_html=<p>Hello</p>>&test=1

const createMealPlanOnlyPdf = () => {
    // $.getJSON(
    //     `https://api.pdflayer.com/api/convert?access_key=6f976b9baaede103c03c9763adf6e9fd&document_url=downloadUrl,
    //     {
    //         access_key: access_key='6f976b9baaede103c03c9763adf6e9fd',
    //         test: 1,
    //         document_url: 'https://github.com/aleyesa/Meal-Plan-O/blob/master/index.html',
    //     }, (data) => console.log(data)
    //     );

    //     $('.meal-table-section').on('click', '.pdfBtn', () => {
        

    // }   
    // $('.meal-table-section').on('click', '.pdfBtn', () => {
        $.ajax(
            {
            method: 'POST',
            url: 'https://api.pdflayer.com/api/convert?access_key=6f976b9baaede103c03c9763adf6e9fd&test=1',
            data: {
                document_html: '<!DOCTYPE html><html><head><title>Meal Plan</title></head><body><p>Hello</p></body></html>',
            },
            success: (data, a ,xhr) => {
                let downloadLink      = document.createElement('a');
                downloadLink.target   = '_blank';
                downloadLink.download = 'name_to_give_saved_file.pdf';
              
                // convert downloaded data to a Blob
                let blob = new Blob([data], { type: 'application/pdf' });
              
                // create an object URL from the Blob
                let URL = window.URL || window.webkitURL;
                let downloadUrl = URL.createObjectURL(blob);
                console.log(blob);
                $('meal-table-section a').attr('href', `https://api.pdflayer.com/api/convert?access_key=6f976b9baaede103c03c9763adf6e9fd&document_url=http://localhost:8080/69d0476a-8b71-4e77-af84-28066a79c5ca`);
                // set object URL as the anchor's href
                // downloadLink.href = downloadUrl;
              
                // // append the anchor to document body
                // document.body.append(downloadLink);
              
                // // fire a click event on the anchor
                // downloadLink.click();
              
                // // cleanup: remove element and revoke object URL
                // document.body.removeChild(downloadLink);
                // URL.revokeObjectURL(downloadUrl);

            }
        });
    };



createMealPlanOnlyPdf();





  
  