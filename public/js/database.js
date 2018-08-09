var dataRowTemplate = '<tr class = "database-row">'+
                        '<td class = "partners" width = "25%">'+
                            '<div class = "row">'+
                                '<div class = "col-lg-2">'+
                                    '<img class="img-responsive" src="%IMG_SRC%" height=50 width=50>'+
                                '</div>'+
                                '<div class = "col-lg-10">'+
                                    '<p class = "place">%PARTNER_NAME%</p>'+
                                '</div>'+
                            '</div>'+
                        '</td>'+
                        '<td width = "25%" class = "person-details">'+
                            '<p class = "name">%FOCAL_PERSON%</p>'+
                            '<p class = "email">%EMAIL%</p>'+
                            '<p class = "number">%NUMBER%</p>'+
                        '</td>'+
                        '<td width = "25%" class = "address">'+
                            '<p>%ADDRESS%</p>'+
                        '</td>'+
                        '<td width = "25%" class = "services">'+
                            '<p>Vaccines - Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid</p>'+
                            '<p class = "view-more">View more</p>'+
                        '</td>'+
                    '</tr>';

function replaceStr(str, replacements) {
    return str.replace(/%\w+%/g, function (all) {
        return replacements[all] || all;
    });
}

function addDatarow(imgsrc, partname, focalname, email, number, address) {
    var replacements = {
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
    addDatarow("img/database/cfsi.png", "Community and Family Services International", "Dr. Zenaida Calupaz", "zenaida.calupaz@gmail.com", "268-1195 / 9058892105", "2F Torres Building 2442 Park Avenue, Pasay, Metro Manila");
    addDatarow("img/database/woodwater.png", "Woodwater Center for Healing", "Ms. Gerlita Condino-Enrera", "gerlita@gmail.com", "(02) 551 1977", "18 Nicanor Reyes St., Loyola Heights, Quezon City");
    addDatarow("img/database/metrov.png", "Valenzuela Social Hygiene Clinic", "Ms. Lovelina Maderazo", "lovelina@gmail.com", "(02) 292-0211", "Poblacion II, Malinta, Valenzuela City");
    addDatarow("img/database/calalang.png", "Sta. Cruz Social Hygiene Clinic", "Dr. Diane Mendoza – Physician", "diane@gmail.com", "711-6942", "2/F Manila Health Dept., Quiricada St, Sta. Cruz, Manila");
    addDatarow("img/database/stcam.png", "St. Camillus Pastoral Health Care", "Ms. Gerlita Enrera", "stcamillus_phc@yahoo.com", "(02) 645-3741", "116 Amang Rodriguez Ave, Santolan, Pasig City")
})