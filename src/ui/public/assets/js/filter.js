function filterReports() {
    let queryParams = "?page=1";
    $( "#report-filters :input" ).each(function(k, v) {
        let param = $(v).attr('data-param');
        if(param !== undefined) {
            let value = $(v).val();
            if(value !== '') {
                queryParams = queryParams + '&' + param + '=' + value;
            }
        }
    });
    window.location.href = "/" + queryParams;
}

$( document ).ready(function() {
    $( "#report-filters :input" ).each(function(k, v) {
        $(v).change(function() {
            filterReports();
        })
    })
});