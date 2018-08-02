function determineDropDirection(){
    $(".dropdown-menu").each( function(){
        console.log("EACH")
        // Invisibly expand the dropdown menu so its true height can be calculated
        $(this).css({
        visibility: "hidden",
        display: "block"
        });

        // Necessary to remove class each time so we don't unwantedly use dropup's offset top
        $(this).parent().removeClass("dropup");

        // Determine whether bottom of menu will be below window at current scroll position
        if ($(this).offset().top + $(this).outerHeight() > $(window).innerHeight() + $(window).scrollTop()){
            $(this).parent().addClass("dropup");
        }

        // Return dropdown menu to fully hidden state
        $(this).removeAttr("style");
    });
}

determineDropDirection();

$(window).scroll(determineDropDirection);