var dataPie = {
    datasets: [{
        data: [10, 20, 30],
        backgroundColor: [
            "rgba(255, 0, 0, 1)",
            "rgba(255, 255, 0, 1)",
            "rgba(0, 0, 255, 1)"
        ]
    }],

    labels: [
        'Red',
        'Yellow',
        'Treatment'
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
        backgroundColor: "rgba(255, 0, 0, 1)",
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
        backgroundColor: "rgba(255, 255, 0, 1)",
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
        backgroundColor: "rgba(255, 0, 255, 1)",
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
        backgroundColor: "rgba(0, 255, 0, 1)",
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
        backgroundColor: "rgba(0, 255, 255, 1)",
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
        backgroundColor: "rgba(0, 0, 255, 1)",
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