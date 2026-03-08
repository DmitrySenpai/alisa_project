
 $(document).ready(function(){
    $("#setContent").on("input", function(){
        // Print entered value in a div box
        //$("#embed_content").text($(this).val());
        $("#embed_content").html($(this).context.value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/[\r\n]+/gm, '<br>'));
    });

    $("#setTitle").on("input", function(){
        // Print entered value in a div box
        $("#embed_title").text($(this).val());
    });

    //Доделать
    //$("#color-picker-alias").on("input", function(){
    //    // Print entered value in a div box
    //    $("#embed-color-pill").style($(this).val());
    //});

    $("#setDescription").on("input", function(){
        // Print entered value in a div box
        //$("#embed_description").text($(this).val());
        $("#embed_description").html($(this).context.value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/[\r\n]+/gm, '<br>'));
    });

    
    $("#setThumbnail").on("input", function(){
        // Print entered value in a div box
        $("#embed-rich-thumb").attr("src", $(this).val());
    });

    $("#setImage").on("input", function(){
        // Print entered value in a div box
        ///$("#embed-image").attr("src", $(this).val());
        if($(this).val().length == 0) {
            $("#embed-image").text('');
        } else {
            $("#embed-image").html('<img src="'+ $(this).val().replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;') +'" class="image" role="presentation"  name="embed-image">');
        }
    });

    $("#setAuthorText").on("input", function(){
        // Print entered value in a div box
        $("#embed-author-name").text($(this).val());
    });


    $("#setFooterText").on("input", function(){
        // Print entered value in a div box
        $("#text-embed-footer").text($(this).val());
    });

    $("#setTimestamp").on("input", function(){
        // Print entered value in a div box
        $("#time-embed-footer").text($(this).val());
    });

    //<img class="image" role="presentation"  name="embed-image" src="">

    $("#setAuthorIcon").on("input", function(){
        // Print entered value in a div box
        if($(this).val().length == 0) {
            $("#embed-author-icon").text('');
        } else {
            $("#embed-author-icon").html('<img src="'+ $(this).val().replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;') +'" role="presentation" class="embed-author-icon">');
        }
        
    });

    $("#setFooterIcon").on("input", function(){
        // Print entered value in a div box
        //$("#embed-footer-icon").attr("src", $(this).val());
        if($(this).val().length == 0) {
            $("#embed-footer-icon").text('');
        } else {
            $("#embed-footer-icon").html('<img src="'+ $(this).val().replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;') +'" class="embed-footer-icon" role="presentation" width="20" height="20">');
        }
    });

    $(document).on("input", function(r){
        if (!r.target.id.match(/(\d+)/)) return
        if(r.target.id == `i_name_row${r.target.id.match(/(\d+)/)[0]}`) {
            $("#name_row" + r.target.id.match(/(\d+)/)[0]).html(r.target.value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
        }
        if(r.target.id == `i_value_row${r.target.id.match(/(\d+)/)[0]}`) {
            $("#value_row" + r.target.id.match(/(\d+)/)[0]).html(r.target.value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
        }
    });

    $(document).on("input", function(r){
        console.log(r.target)
    });

});