var eventTemplate =
    `
    <div class="event">
        <div class="row row-with-padding">
            <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2 no-padding-right">
                <div class="red-rect-bg">
                    <div class="event-date">
                        <span class="date">%DATE%</span>
                        <br>
                        <span class="month">%MONTH%</span>
                    </div>
                </div>
            </div>
            <div class="col-lg-10 col-md-10 col-sm-10 col-xs-10  no-padding-left">
                <div class="white-rect-bg">
                    <div class="event-title red-text">
                        <p>%EVENT_TITLE%</p>
                    </div>
                </div>
            </div>
        </div>
    </div>    
    `;

var announcementTemplate =
    `
    <div class="announcement">
        <div class="row">
            <div class="col-lg-2">
                <img class="img-responsive" src="img/ppapi.png" height=50 width=50>
            </div>
            <div class="col-lg-10">
                <p class="announcement-title">%TITLE%</p>
                <p class="announcement-des">%DESCRIPTION%</p>
                <p class="announcement-datetime">%DATETIME%</p>
            </div>
        </div>
    </div>
    `;

var updateTemplate =
    `
    <div class="update">
        <div class="row">
            <div class="col-lg-5">
                <img class="img-responsive" src="img/placeholder.jpg" height=70 width=100>
            </div>
            <div class="col-lg-7">
                <p class="update-title">%TITLE%</p>
                <p class="update-date">%DATE%</p>
            </div>
        </div>
    </div>    
    `;

String.prototype.trunc = String.prototype.trunc ||
    function (n) {
        return (this.length > n) ? this.substr(0, n - 1) + '&hellip;' : this;
    };

function addEvent(date, month, title) {
    var replacements = {
        "%DATE%": date,
        "%MONTH%": month,
        "%EVENT_TITLE%": title
    };

    var newEvent = replaceStr(eventTemplate, replacements);

    $(".event-list").append(newEvent);

}

function addAnnouncement(title, description, datetime) {
    description = description.trunc(40);

    var replacements = {
        "%TITLE%": title,
        "%DESCRIPTION%": description,
        "%DATETIME%": datetime
    };

    var newAnnouncement = replaceStr(announcementTemplate, replacements);

    $(".announcement-list").append(newAnnouncement);
}

function addUpdate(title, date) {
    title = title.trunc(40);

    var replacements = {
        "%TITLE%": title,
        "%DATE%": date
    };

    var newUpdate = replaceStr(updateTemplate, replacements);

    $(".update-list").append(newUpdate);
}

function replaceStr(str, replacements) {
    return str.replace(/%\w+%/g, function (all) {
        return replacements[all] || all;
    });
}

$(document).ready(function () {
    addEvent(13, "June", "Meeting with Pinoy Plus Advocacy Inc.");
    addEvent(14, "June", "Meeting with Pinoy Plus Advocacy Inc.");

    addAnnouncement("PLHIV Response Center", "To all service providers, kindly update your profiles", "July 2, 2018 4:15 PM");
    addAnnouncement("PLHIV Response Center", "To all service providers, kindly update your profiles", "July 2, 2018 4:15 PM");
    addAnnouncement("PLHIV Response Center", "To all service providers, kindly update your profiles", "July 2, 2018 4:15 PM");

    addUpdate("Project Ruby: An HIV Awareness Forum and a cool place to do stuff.", "July 2, 2018");
    addUpdate("Project Ruby: An HIV Awareness Forum and a cool place to do stuff.", "July 2, 2018");
    addUpdate("Project Ruby: An HIV Awareness Forum and a cool place to do stuff.", "July 2, 2018");
});