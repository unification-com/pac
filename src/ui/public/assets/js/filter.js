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

function searchReports() {
    let searchTerm = $("#site-search-term").val();
    window.location.href = "/search/" + searchTerm
}

$( document ).ready(function() {
    $( "#report-filters :input" ).each(function(k, v) {
        $(v).change(function() {
            filterReports();
        })
    });

    $("#site-search-form").submit(function(event) {
        event.preventDefault();
        searchReports();
    });

    $('#site-search-term').keypress(function (e) {
        if (e.which == 13) {
            $('form#site-search-form').submit();
            return false;
        }
    });
});