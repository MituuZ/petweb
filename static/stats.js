document.addEventListener('DOMContentLoaded', async function() {
    // Default options
    const defaultDatasetOptions = {
        fill: false,
        lineTension: 0.3,
        pointRadius: 13
    }

    const defaultChartOptions = {
        events: ["click"],
        plugins: {
            tooltip: {
                callbacks: {
                    title: function(tooltipItems, data) {
                        const date = tooltipItems[0]?.label;
                        const parsedDate = moment(date, 'MMM D YYYY, h:mm:ss A');
                        if (parsedDate) {
                            return moment(parsedDate).format('DD.MM.YYYY');
                        }
                        return '';
                    }
                },
            }
        },
        responsive: true,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'month',
                },
                parser: 'YYYY-MM-DD',
                min: '2023-08-01',
                max: '2024-03-31'
            },
        }
    }

    Chart.defaults.font.family = 'Arial';
    Chart.defaults.font.size = 16;
    // Unsupported? Chart.defaults.font.style = 'bold';

    // Get the data from the server
    const response = await fetch('/get-weights');

    if (!response.ok) {
        console.log(`HTTP error! status: ${response.status}`);
        return;
    }

    const serverData = await response.json();

    // Group the server data by name and sort by date
    const groupedData = {};
    const catData = {};

    serverData.forEach(item => {
        if (item.name.toLowerCase() !== 'base') {
            if (item.name.toLowerCase() !== 'dog1' && item.name.toLowerCase() !== 'dog2') {
                if (!catData[item.name]) {
                    catData[item.name] = [];
                }
                catData[item.name].push(item);
            } else {
                if (!groupedData[item.name]) {
                    groupedData[item.name] = [];
                }
                groupedData[item.name].push(item);
            }
        }
    });

    Object.keys(groupedData).forEach(name => {
        groupedData[name].sort((a, b) => a.date > b.date);
    });

    Object.keys(catData).forEach(name => {
        catData[name].sort((a, b) => a.date > b.date);
    });

    // Generate datasets for the cats
    const catDataset = Object.keys(catData).map((name, index) => {
        const data = catData[name];
        const color = `hsl(${index * 360 / Object.keys(catData).length}, 100%, 50%)`;
        return {
            label: capitalizeFirstLetter(name),
            data: data.map(item => item.weight),
            borderColor: color,
            backgroundColor: color,
            ...defaultDatasetOptions
        };
    });

    // 1. Combine all dates
    let allDates = [];
    Object.values(groupedData).forEach(data => {
        const dates = data.map(item => item.date);
        allDates = allDates.concat(dates);
    });

    // 2. Remove duplicates and sort
    allDates = [...new Set(allDates)].sort();

    // 3. Fill in missing data
    Object.keys(groupedData).forEach(name => {
        const filledData = [];
        allDates.forEach(date => {
            const entry = groupedData[name].find(item => item.date === date);
            filledData.push(entry ? entry : { date: date, weight: null });
        });
        groupedData[name] = filledData;
    });

    // Generate datasets for dogs name
    const dogDatasets = Object.keys(groupedData).map((name, index) => {
        const data = groupedData[name];
        var color = null;
        if (name == 'dog1') {
            color = `hsl(30, 100%, 40%)`;
        } else {
            color = `hsl(210, 100%, 20%)`;
        }
        return {
            label: capitalizeFirstLetter(name),
            data: data.map(item => item.weight),
            borderColor: color,
            backgroundColor: color,
            ...defaultDatasetOptions
        };
    });

    // Set tick language
    moment.locale("fi");

    // Create a dog chart
    var ctx = document.getElementById('graph').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: allDates,
            datasets: dogDatasets
        },
        options: {
            ...defaultChartOptions,
            scales: {
                ...defaultChartOptions.scales,
                y: {
                    min: 0,
                    max: 34
                }
            }
        },
    });

    // Create a cat chart
    var ctx2 = document.getElementById('graph_2').getContext('2d');
    new Chart(ctx2, {
        type: 'line',
        data: {
            labels: catData[Object.keys(catData)[0]].map(item => item.date),
            datasets: catDataset
        },
        options: {
            ...defaultChartOptions,
            scales: {
                ...defaultChartOptions.scales,
                y: {
                    min: 0,
                    max: 4.8
                }
            },
        }
    });
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
