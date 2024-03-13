document.addEventListener("DOMContentLoaded", function() {
    fetchTop5AgeGroups();
    fetchTop5Neighborhoods();
    fetchGenderDistribution();
    fetchTotalIncidentsOverTime();
});

function fetchTop5AgeGroups() {
    fetch('https://data.winnipeg.ca/resource/qd6b-q49i.json?$select=age,count(*) as count&$group=age&$order=count%20DESC&$limit=5')
        .then(response => response.json())
        .then(data => {
            const ageLabels = data.map(item => item.age);
            const ageCounts = data.map(item => item.count);
            drawAgeChart(ageLabels, ageCounts);
        })
        .catch(error => console.log(error));
}

function fetchTop5Neighborhoods() {
    fetch('https://data.winnipeg.ca/resource/qd6b-q49i.json?$select=neighbourhood,count(*) as count&$group=neighbourhood&$order=count%20DESC&$limit=5')
        .then(response => response.json())
        .then(data => {
            const neighborhoodLabels = data.map(item => item.neighbourhood);
            const neighborhoodCounts = data.map(item => item.count);
            drawNeighborhoodChart(neighborhoodLabels, neighborhoodCounts);
        })
        .catch(error => console.log(error));
}

function fetchGenderDistribution() {
    fetch('https://data.winnipeg.ca/resource/qd6b-q49i.json?$select=gender,count(*) as count&$group=gender')
        .then(response => response.json())
        .then(data => {
            const genderLabels = data.map(item => item.gender);
            const genderCounts = data.map(item => item.count);
            drawGenderChart(genderLabels, genderCounts);
        })
        .catch(error => console.log(error));
}

function fetchTotalIncidentsOverTime() {
    const fetchData = async () => {
        let allData = [];
        let offset = 0;
        let limit = 1000; // Adjust the limit as needed
    
        try {
            while (true) {
                const response = await fetch(`https://data.winnipeg.ca/resource/qd6b-q49i.json?$limit=${limit}&$offset=${offset}`);
                const data = await response.json();
                
                if (data.length === 0) break; // No more data available
                
                allData = [...allData, ...data];
                offset += limit;
            }
    
            const incidentsByYear = {};
            
            allData.forEach(record => {
                const year = record.dispatch_date.substring(0, 4); // Extract year from dispatch_date
                incidentsByYear[year] = (incidentsByYear[year] || 0) + 1;
            });
    
            const years = Object.keys(incidentsByYear);
            const counts = Object.values(incidentsByYear);
    
            drawIncidentsOverTime(years, counts);
        } catch (error) {
            console.error(error);
        }
    };
    
    fetchData();
    
}






function drawAgeChart(labels, counts) {
    var ctx = document.getElementById('ageChart').getContext('2d');
    var ageChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '',
                data: counts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    ageChart.canvas.parentNode.style.height = '500px';
    ageChart.canvas.parentNode.style.width = '500px';
}

function drawNeighborhoodChart(labels, counts) {
    var ctx = document.getElementById('neighborhoodChart').getContext('2d');
    var neighborhoodChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '',
                data: counts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    neighborhoodChart.canvas.parentNode.style.height = '500px';
    neighborhoodChart.canvas.parentNode.style.width = '500px';
}

function drawGenderChart(labels, counts) {
    var ctx = document.getElementById('genderChart').getContext('2d');
    var genderChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: '',
                data: counts,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
        }
    });
    genderChart.canvas.parentNode.style.height = '500px';
    genderChart.canvas.parentNode.style.width = '500px';
}

function drawIncidentsOverTime(years, counts) {
    var totalRecords = counts.reduce((acc, count) => acc + count, 0);
    var ctx = document.getElementById('incidentsOverTimeChart').getContext('2d');
    var incidentsOverTimeChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: years,
            datasets: [{
                label: 'Total Incidents Over Time',
                data: counts,
                borderColor: 'rgba(255, 99, 132, 0.8)',
                borderWidth: 2,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    type: 'category',
                    labels: years
                },
                y: {
                    beginAtZero: false,
                    title: {
                        display: true,
                        text: 'Recorded incidents'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Total Records: ' + totalRecords,
                    position: 'top',
                    font: {
                        size: 14
                    }
                }
            }
        }
    });

    incidentsOverTimeChart.canvas.parentNode.style.height = '500px';
    incidentsOverTimeChart.canvas.parentNode.style.width = '500px';
}

