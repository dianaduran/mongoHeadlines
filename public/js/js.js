$(".nav-link").on("click", function(){
    $(".nav-link").removeClass("active");
    $( this ).addClass( 'active');
}); 

// Click event to get the scraped
$(document).on("click", "#scrape", function(event) {
    event.preventDefault();
    $("#savedArticles").hide();
    $("#articles").show();
    $("#articles").empty();
  
    $.get("/scrape").then(function(data) {
       
        data.forEach(function(val){
           createDiv(val.title, val.link);
        });
      });
    
});    

      function createDiv(title, link){
        var html="<div class='col-sm-12' data-title='" + title + "'><div class='card'><div class='card-header'>";
        html+="<h5 class='card-title text-center'>"+ title+"</h5></div>";
        html+="<div class='card-body'>";
        html+="<p class='card-text'>"+link+".</p>";
        html+="<a href='/submit' class='btn btn-danger save' data-title='" + title + "' data-link='" + link + "'>Save Article</a></div></div></div><hr>";  
        $("#articles").append(html);   
    };

    $(document).on("click", ".save", function(event) {
        event.preventDefault();

        $(this).addClass('disabled');
        var thisTitle = $(this).attr("data-title");
        var thisLink=$(this).attr("data-link");

        $.get("/articles/"+thisTitle).then(function(data) {
           
            if(data!=null)  alert("This article is already saved in the DataBase!!");
  
               if(data==null){

                var art={
                    title:thisTitle,
                    link: thisLink
                };
     
              $.post("/submit", art).then(function(data){
                alert("Save, thank you!!");
              }); 
            }
        });

    });

    function createDivSaved(value){
      
        var html="<div class='col-sm-12'><div class='card'><div class='card-header'>";
        html+="<h5 class='card-title text-center'>"+ value.title+"</h5></div>";
        html+="<div class='card-body'>";
        html+="<p class='card-text'>"+value.link+".</p>";
        html+="<div class='text-right'>";
        html+="<a href='#' class='btn btn-primary note' data-toggle='modal' data-target='#" + value._id + "'>Article Note</a><span class='spnButton'></span>";  
        html+="<a href='#' class='btn btn-danger delete' data-id='" + value._id + "'>Delete Article</a></div></div></div></div><hr>";

       
        // <!-- Modal -->
        var modal='<div class="modal fade" id="' + value._id + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">';
        modal+='<div class="modal-dialog modal-dialog-centered" role="document">';
        modal+='<div class="modal-content">';
        modal+='<div class="modal-header">';
        modal+='<h5 class="modal-title" id="exampleModalLongTitle">'+value.title+'</h5>';
        modal+='<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
        modal+='<span aria-hidden="true">&times;</span></button></div>';
        modal+='<div class="modal-body">';
        modal+='<div class="textareaDiv"></div>';
        // modal+='<textarea></textarea>';
        modal+='<div class="notas"></div>';
        modal+='</div>';
        modal+='<div class="modal-footer">';
        modal+='<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>'
        modal+='<button type="button" data-article="' + value._id + '" class="btn btn-primary save-note">Save changes</button></div></div></div></div>';
            
        $("#savedArticles").append(html);  
        $("#savedArticles").append(modal); 
    };


    //get all articles
    $(document).on("click", "#saved", function(event) {
    event.preventDefault(); 
    $("#articles").hide();
    $("#savedArticles").show();
    $("#savedArticles").empty();
    $.get("/articles").then(function(data) {
        data.forEach(function(val){
          createDivSaved(val);
        })
    });
    });

          //save note associate to article
    $(document).on("click", ".save-note", function(event) {
        event.preventDefault(); 
       
        var thisid = $(this).attr("data-article");
       
        var note={
            body:$("textarea").val()
        };
       
        console.log(note);
        $.post("/submitNote/"+ thisid, note).then(function(data) {
            $("textarea").val("");
          // console.log(data);
          });
         
          getNotas(thisid);
      });


    //get notes associate to article
        $(document).on("click", ".note", function(event) {
            event.preventDefault(); 
            var thisId=$(this).attr("data-target");
            var cadena=thisId.split("#");
            var id=cadena[1];
            $(".textareaDiv").empty();
            var modal='<textarea></textarea>';
            $(".textareaDiv").append(modal);
            // $("#notas").empty();
            getNotas(id);
        });

        function getNotas(id){
            // $("textarea").val("");
           $(".notas").empty();
            $.get("/articlesNote/"+id).then(function(data) {
                var notas=data[0].notes;
                notas.forEach(function(val){
                RenderNote(val, id); 
                })
            });
        }

        function RenderNote(val, id){
      
            var  rowShow = "<tr>" +
            "<td>" + val.body + "</td>" +
            "<td>" +
            "<button class='btn btn-danger borrar' data-id='" + val._id + "' onclick=deleteNote('" + val._id+"','"+ id + "')>" +
            "<i class='fa fa-trash'></i>" +
            "</button>" +
            "</td>" +
            "</tr>";
            $(".notas").append(rowShow);
        }

        function deleteNote(id, idArticle){
            $.ajax({
                method:'DELETE',
                url:'/noteDelete/'+id,
            }).then(function(data) {
               console.log("delete");
               $(".notas").empty();
               getNotas(idArticle);
            });
        }

        //delete article
        $(document).on("click", ".delete", function(event) {
            event.preventDefault(); 
            var thisid = $(this).attr("data-id");

            //1. get notes of articles
            $.get("/articlesNote/"+thisid).then(function(data) {
                var notas=data[0].notes;
                if(notas!=""){
                    //delete each note
                    notas.forEach(function(val){  
                    $.ajax({
                        method:'DELETE',
                        url:'/noteDelete/'+val._id,
                    }).then(function() {
                        console.log("delete nota");
                    });
                });
              }
              //always delete article
              $.ajax({
                method:'DELETE',
                url:'/articles/'+thisid,
            }).then(function(data) {
               console.log("delete Article");
               $.get("/articles").then(function(data) {
                $("#savedArticles").empty();
                data.forEach(function(val){
                createDivSaved(val);
                })
            });
            
            });
        });          
    });    


 

