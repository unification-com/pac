function searchReports() {
    let searchTerm = $("#site-search-term").val();
    window.location.href = "/search/" + searchTerm
}

$( document ).ready(function() {
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