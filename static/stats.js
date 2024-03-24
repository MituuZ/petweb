document.addEventListener('DOMContentLoaded', async function() {
    // Default options
    const defaultDatasetOptions = {
        fill: false,
        lineTension: 0.3,
        pointRadius: 13
    }

    let graphRange = await fetch('/get-graph-range')

    if (!graphRange.ok) {
        console.log(`HTTP error! status: ${graphRange.status}`);
        return;
    }

    graphRange = await graphRange.json();
    graphRange = graphRange.range;

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    let endYear = currentYear;
    rollsOver = currentMonth === 11;
    endYear += rollsOver ? 1 : 0;
    let endMonth = rollsOver ? 0 : currentMonth + 2; // Account for zero indexed months
    endMonth = String(endMonth).padStart(2, '0');
    const endDate = endYear + '-' + endMonth + '-01'; // The first day of the next month

    let startYear = currentYear;
    let startMonth = currentMonth - graphRange + 1;

    if (startMonth < 0) {
        const fullYears = Math.ceil(Math.abs(startMonth) / 12);
        startYear -= fullYears;
        startMonth = 12 + (startMonth % 12);
    }
    if (startMonth === 0) {
        startMonth = 12;
        startYear -= 1;
    }
    startMonth = String(startMonth).padStart(2, '0');
    const startDate = startYear + '-' + startMonth + '-01'; // The first day of the month graphRange months ago

    console.log('Start date: ' + startDate + ' End date: ' + endDate);

    const defaultChartOptions = {
        spanGaps: true,
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
                min: startDate,
                max: endDate
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
    const speciesArray = serverData.map(item => item.species);
    // Remove duplicates by converting the array to a Set
    const distinctSpecies = [...new Set(speciesArray)];
    distinctSpecies.forEach(species => {
        createChart(species, serverData, defaultDatasetOptions, defaultChartOptions);
    });
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function createChart(species, serverData, defaultDatasetOptions, defaultChartOptions) {
    console.log('Creating a chart for: ' + species);
    const speciesData = {};

    serverData.forEach(item => {
        // Fast exit
        if (item.species !== species) {
            return;
        }

        if (!speciesData[item.name]) {
            speciesData[item.name] = [];
        }
        speciesData[item.name].push(item);
    });

    // 1. Combine all dates
    let allDates = [];
    Object.values(speciesData).forEach(data => {
        const dates = data.map(item => item.date);
        allDates = allDates.concat(dates);
    });

    // 2. Remove duplicates and sort
    allDates = [...new Set(allDates)].sort();

    // 3. Fill in missing data
    Object.keys(speciesData).forEach(name => {
        const filledData = [];
        allDates.forEach(date => {
            const entry = speciesData[name].find(item => item.date === date);
            filledData.push(entry ? entry : { date: date, weight: undefined });
        });
        speciesData[name] = filledData;
    });

    var color = await fetch('/get-colors');
    if (!color.ok) {
        console.log(`HTTP error! status: ${color.status}`);
        return;
    }

    colors = await color.json();

    const speciesDatasets = Object.keys(speciesData).map((name, index) => {
        const data = speciesData[name];
        color = colors.find(item => item.name === name).color;
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

    chartConfig = await fetch('get-chart-configs')

    if (!chartConfig.ok) {
        console.log(`HTTP error! status: ${chartConfig.status}`);
        return;
    }

    chartConfig = await chartConfig.json();
    let min = chartConfig.find(item => item.species === species).min;
    let max = chartConfig.find(item => item.species === species).max;

    var ctx = document.getElementById(species + '_graph').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: allDates,
            datasets: speciesDatasets
        },
        options: {
            ...defaultChartOptions,
            scales: {
                ...defaultChartOptions.scales,
                y: {
                    min: min,
                    max: max
                }
            }
        },
    });
}