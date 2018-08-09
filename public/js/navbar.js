var nextAdmin = 1;

$(document).ready(function() {
    $(".navbar-brand").click(function() {
        window.location.href = "/";
    })
    $("#whatIsPrc").click(function() {
        window.location.href = "/about";
    })
    $("#announcements").click(function() {
        window.location.href = "/announcements";
    })
    $("#database").click(function() {
        window.location.href = "/database"
    })
    $("#feedback").click(function() {
        window.location.href = "/feedback";
    })

    $("#profileModal #edit").click(function() {
        $('#profileModal').find('.data-edit').removeClass('hide');
        $('#profileModal').find('.data').addClass('hide');

        getCurrentData();
    })

    $("#profileModal #done").click(function() {
        $('#profileModal').find('.data-edit').addClass('hide');
        $('#profileModal').find('.data').removeClass('hide');
    })

    $(document).on('click', '.remove-me', function(e) {
        e.preventDefault();
        var fieldNum = this.id.charAt(this.id.length-1);
        var fieldID = "#admin-field" + fieldNum;
        $(this).remove();
        $(fieldID).remove();
    });
    
    $(document).on('click', '.add-more', function(e) {
        if($("#admin-field"+nextAdmin).val() == "")
            return;
        e.preventDefault();
        addAdmin()
        
    });
})

function getCurrentData() {
    $(".title #titleEdit").val($(".title .data span").text())
    $(".contact-num #numberEdit").val($(".contact-num .data span").text())
    $(".contact-email #emailEdit").val($(".contact-email .data span").text())
    $(".contact-address #addressEdit").val($(".contact-address .data span").text())

    $(".admins .input-append").empty();
    $(".admins .input-append").append('<div id="admin-field">'+
                                            '<input autocomplete="off" class="input form-control" id="admin-field1" name="prof1" type="text" placeholder="Enter admin name" data-items="8"/>'+
                                            '<button id="b1" class="btn add-more" type="button">+</button>'+
                                        '</div>')
    nextAdmin = 1;
    $(".admins .names span").each(function() {
        addAdmin($(this).text());
    })
}

function addAdmin(inputVal) {
    console.log('add admin')
    var addto = "#admin-field" + nextAdmin;
    var addRemove = "#admin-field" + (nextAdmin);
    if(inputVal != null)
        $(addto).val(inputVal);
    nextAdmin = nextAdmin + 1;
    var newIn = '<input autocomplete="off" class="input form-control" id="admin-field' + nextAdmin + '" name="field' + nextAdmin + '" type="text" placeholder = "Enter admin name">';
    var newInput = $(newIn);
    var removeBtn = '<button type="button" id="remove' + (nextAdmin - 1) + '" class="btn btn-danger remove-me" >-</button></div><div id="admin-field">';
    var removeButton = $(removeBtn);
    $(addto).after(newInput);
    $(addRemove).after(removeButton);
    $("#admin-field" + nextAdmin).attr('data-source',$(addto).attr('data-source'));
    $("#count").val(nextAdmin); 
}