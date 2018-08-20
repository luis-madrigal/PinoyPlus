var threadTemplate = '<div class = "thread white-rect-bg">'+
                       ' <div class = "row">'+
                            '<div class = "col-lg-1">'+
                                '<img class="img-responsive post-image" src="img/database/calalang.png" height=60 width=60>'+
                            '</div>'+
                            '<div class = "col-lg-7">'+
                                '<div class = "description">'+
                                    '<p class = "title bold">%TITLE%</p>'+
                                    '<p class = "info">%DESCRIPTION%</p>'+
                                    '<p class = "reply-count">%REPLY_COUNT% Replies</p>'+
                                '</div>'+
                            '</div>'+
                            '<div class = "col-lg-4">'+
                                '<p class = "datetime">%DATETIME%</p>'+
                            '</div>'+
                        '</div>'+
                    '</div>';

String.prototype.trunc = String.prototype.trunc ||
function (n) {
    return (this.length > n) ? this.substr(0, n - 1) + '&hellip;' : this;
};

function replaceStr(str, replacements) {
    return str.replace(/%\w+%/g, function (all) {
        return replacements[all] || all;
    });
}

function addThread(title, description, replycount, datetime) {
    var replacements = {
        "%TITLE%": title,
        "%DESCRIPTION%": description,
        "%REPLY_COUNT%": replycount,
        "%DATETIME%": datetime
    };

    var newThread = replaceStr(threadTemplate, replacements);

    $(".thread-list").append(newThread);

}

$(document).ready(function() {
    $('.thread-list').on('click', '.thread', function() {
        window.location.href = "/posts";
    });

    $('.forum-btn').click(function() {
        addThread("HIV Service Updates", "To all health service providers, here are the updates regarding HIV services from the Department of Health.", 17, "July 2, 2018 4:15 PM");
        window.scrollTo(0,document.body.scrollHeight);
    })

    addThread("HIV Service Updates", "To all health service providers, here are the updates regarding HIV services from the Department of Health.", 17, "July 2, 2018 4:15 PM");
    addThread("HIV Service Updates", "To all health service providers, here are the updates regarding HIV services from the Department of Health.", 17, "July 2, 2018 4:15 PM");
    addThread("HIV Service Updates", "To all health service providers, here are the updates regarding HIV services from the Department of Health.", 17, "July 2, 2018 4:15 PM");
    addThread("HIV Service Updates", "To all health service providers, here are the updates regarding HIV services from the Department of Health.", 17, "July 2, 2018 4:15 PM");
})