$(".nav-link").on("click", function(){
    $(".nav-link").removeClass("active");
    $( this ).addClass( 'active');
}); 

// Click event to mark a book as read
$(document).on("click", "#scrape", function(event) {
    event.preventDefault();
    $("#articles").empty();

    $.get("/scrape").then(function(data) {
        console.log(data);
       data.forEach(function(val){
           createDiv(val.title, val.link);
        });

       
      });

      function createDiv(title, link){
        var html="<div class='col-sm-6'><div class='card'><div class='card-body'>";
        html+="<h5 class='card-title text-center'>"+ title+"</h5>";
        html+="<p class='card-text'>"+link+".</p>";
        html+="<a href='#' class='btn btn-danger'>Save Article</a></div></div><hr>";  
        $("#articles").append(html);   
    }
})