var dataPie = {
    datasets: [{
        data: [40, 30, 20, 5, 10, 2, 4, 4, 1],
        backgroundColor: [
            "rgba(70, 115, 165, 1)", //blue
            "rgba(169, 72, 70, 1)", //red
            "rgba(138, 163, 82, 1)", //green
            "rgba(113, 91, 143, 1)",//purple
            "rgba(69, 152, 174, 1)", //seablue
            "rgba(218, 132, 68, 1)", //orange
            "rgba(148, 170, 206, 1)", //pastel blue
            "rgba(207, 147, 147, 1)", //pastel pink
            "rgba(169, 156, 187, 1)" //pastel purple
        ]
    }],

    labels: [
        'Treatment Serv',
        'Psychosocial',
        'Others',
        'Policy & Govt',
        'Economic',
        'Family',
        'Employment',
        'Legal Serv',
        'Spiritual'
    ]
};
var ctxPie = $("#refServicesChart");

var myPieChart = new Chart(ctxPie,{
    type: 'pie',
    data: dataPie,
    options: {
        legend: {
            display: false
        }
    }
});

function randomScalingFactor() {
    return Math.floor((Math.random() * 120) + 20);
}

var dataLine = {
    labels: ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
    datasets: [{
        label: 'Employment',
        backgroundColor: "rgba(70, 115, 165, 1)",
        fill: true,
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ],
    },{
        label: 'Others',
        backgroundColor: "rgba(169, 72, 70, 1)",
        fill: true,
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ],
    },{
        label: 'Policy and Govt',
        backgroundColor: "rgba(138, 163, 82, 1)",
        fill: true,
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ],
    },{
        label: 'Family',
        backgroundColor: "rgba(113, 91, 143, 1)",
        fill: true,
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ],
    },{
        label: 'Legal Serv',
        backgroundColor: "rgba(148, 170, 206, 1)",
        fill: true,
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ],
    },{
        label: 'Economic',
        backgroundColor: "rgba(207, 147, 147, 1)",
        fill: true,
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ],
    },{
        label: 'Spiritual',
        backgroundColor: "rgba(185, 205, 150, 1)",
        fill: true,
        data: [
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor(),
            randomScalingFactor()
        ],
    }]
    // , {
    //     label: 'My Second dataset',
    //     borderColor: window.chartColors.blue,
    //     backgroundColor: window.chartColors.blue,
    //     fill: false,
    //     data: [
    //         randomScalingFactor(),
    //         randomScalingFactor(),
    //         randomScalingFactor(),
    //         randomScalingFactor(),
    //         randomScalingFactor(),
    //         randomScalingFactor(),
    //         randomScalingFactor()
    //     ],
    //     yAxisID: 'y-axis-2'
    // }]
};

var ctxLine = $("#numCasesChart");

var myLineChart = new Chart(ctxLine, {
    type: 'line',
    data: dataLine,
    options: {
        legend: {
            display: false
        }
    }
});