var dataRowTemplate = '<tr class = "database-row" id = "%ID%">'+
                        '<td class = "partners" width = "25%">'+
                            '<div class = "row">'+
                                '<div class = "col-lg-2">'+
                                    '<img class="img-responsive" src="%IMG_SRC%" height=50 width=50> ' +
                               ' </div>  '+
                                '<div class = "col-lg-10">'+
                                    '<div class="db-data">'+
                                        '<p class = "place">%PARTNER_NAME%</p>  '+
                                    '</div>'+
                                    '<div class = "db-edit db-hide">'+
                                        '<input type="text" class="form-control placeEdit" placeholder="Enter partner name">'+
                                    '</div>'+
                                '</div> ' +
                            '</div>'  +
                        '</td>'  +
                        '<td width = "25%" class = "person-details">'+
                            '<div class = "db-data">'+
                                '<p class = "name">%FOCAL_PERSON%</p>  '+
                                '<p class = "email">%EMAIL%</p> ' +
                                '<p class = "number">%NUMBER%</p>  '+
                            '</div>'+
                            '<div class = "db-edit db-hide">'+
                                '<input type="text" class="form-control nameEdit" placeholder="Enter focal person name">'+
                                '<input type="text" class="form-control dbEmailEdit" placeholder="Enter email">'+
                                '<input type="tel" class="form-control dbNumberEdit" placeholder="Enter number">'+
                            '</div>'+
                        '</td>'  +
                        '<td width = "25%" class = "address"> ' +
                            '<div class = "db-data">'+
                                '<p class = "address-data">%ADDRESS%</p>'  +
                            '</div>'+
                            '<div class = "db-edit db-hide">'+
                                '<input type="text" class="form-control dbAddressEdit" placeholder="Enter address">'+
                            '</div>'+
                       ' </td>'  +
                        '<td width = "25%" class = "services">  '+
                            '<div class = "db-data">'+
                                '<p class = "services-data">Vaccines - Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid</p>'  +
                                '<p class = "view-more">View more</p>  '+
                            '</div>'+
                            '<div class = "db-edit db-hide">'+
                                '<textarea type="text" class="form-control dbServiceEdit" placeholder="Enter service"></textarea>'+
                            '</div>'+
                        '</td> ' +
                    '</tr>';

function replaceStr(str, replacements) {
    return str.replace(/%\w+%/g, function (all) {
        return replacements[all] || all;
    });
}

function addDatarow(uniqueId, imgsrc, partname, focalname, email, number, address) {
    var replacements = {
        "%ID%": uniqueId,
        "%IMG_SRC%": imgsrc,
        "%PARTNER_NAME%": partname,
        "%FOCAL_PERSON%": focalname,
        "%EMAIL%": email,
        "%NUMBER%": number,
        "%ADDRESS%": address
    }
    var newDatarow = replaceStr(dataRowTemplate, replacements);

    $(".database-table tbody").append(newDatarow);
} 

$(document).ready(function() {
    addDatarow("cfsi", "img/database/cfsi.png", "Community and Family Services International", "Dr. Zenaida Calupaz", "zenaida.calupaz@gmail.com", "268-1195 / 9058892105", "2F Torres Building 2442 Park Avenue, Pasay, Metro Manila");
    addDatarow("woodwater", "img/database/woodwater.png", "Woodwater Center for Healing", "Ms. Gerlita Condino-Enrera", "gerlita@gmail.com", "(02) 551 1977", "18 Nicanor Reyes St., Loyola Heights, Quezon City");
    addDatarow("metrov", "img/database/metrov.png", "Valenzuela Social Hygiene Clinic", "Ms. Lovelina Maderazo", "lovelina@gmail.com", "(02) 292-0211", "Poblacion II, Malinta, Valenzuela City");
    addDatarow("calalang", "img/database/calalang.png", "Sta. Cruz Social Hygiene Clinic", "Dr. Diane Mendoza – Physician", "diane@gmail.com", "711-6942", "2/F Manila Health Dept., Quiricada St, Sta. Cruz, Manila");
    addDatarow("stcam", "img/database/stcam.png", "St. Camillus Pastoral Health Care", "Ms. Gerlita Enrera", "stcamillus_phc@yahoo.com", "(02) 645-3741", "116 Amang Rodriguez Ave, Santolan, Pasig City");

    $("#dbEdit").click(function () {
        $(document).find('.db-edit').removeClass('db-hide');
        $(document).find('.db-data').addClass('db-hide');

        getCurrentData();
    })

    $("#dbDone").click(function () {
        $(document).find('.db-edit').addClass('db-hide');
        $(document).find('.db-data').removeClass('db-hide');
    })

    function getCurrentData() {
        $(".database-table tbody tr").each(function() {
            var idName = $(this).attr('id');
            var entry = document.getElementById(idName);
            console.log($(entry).find(".placeEdit"))
            $(entry).find(".placeEdit").val( $(entry).find(".place").text())

            $(entry).find(".nameEdit").val( $(entry).find(".name").text())
            $(entry).find(".dbEmailEdit").val( $(entry).find(".email").text())
            $(entry).find(".dbNumberEdit").val( $(entry).find(".number").text())

            $(entry).find(".dbAddressEdit").val( $(entry).find(".address-data").text())
            $(entry).find(".dbServiceEdit").val( $(entry).find(".services-data").text())
        })
    }
})