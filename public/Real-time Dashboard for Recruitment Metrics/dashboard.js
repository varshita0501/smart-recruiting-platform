// Make sure to include Chart.js in your HTML
// <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

// Example data for demonstration
const exampleData = {
    applicationsOverTime: {
        labels: ['2024-08-01', '2024-08-05', '2024-08-10', '2024-08-15', '2024-08-20', '2024-08-25'],
        data: [10, 20, 15, 25, 30, 35]
    },
    applicationsBySource: {
        labels: ['Job Board', 'Referral', 'Social Media', 'Other'],
        data: [40, 25, 20, 15]
    },
    applicationsByStatus: {
        labels: ['New', 'In Progress', 'Hired', 'Rejected'],
        data: [50, 30, 15, 25]
    }
};

// Applications Over Time Chart
const applicationsOverTimeCtx = document.getElementById('applications-over-time-chart').getContext('2d');
const applicationsOverTimeChart = new Chart(applicationsOverTimeCtx, {
    type: 'line',
    data: {
        labels: exampleData.applicationsOverTime.labels,
        datasets: [{
            label: 'Number of Applications',
            data: exampleData.applicationsOverTime.data,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Date'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Applications'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top'
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y;
                        }
                        return label;
                    }
                }
            }
        }
    }
});

// Applications by Source Chart
const applicationsBySourceCtx = document.getElementById('applications-by-source-chart').getContext('2d');
const applicationsBySourceChart = new Chart(applicationsBySourceCtx, {
    type: 'pie',
    data: {
        labels: exampleData.applicationsBySource.labels,
        datasets: [{
            data: exampleData.applicationsBySource.data,
            backgroundColor: ['#ff6384', '#36a2eb', '#cc65fe', '#ffce56'],
            borderColor: '#fff',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.label || '';
                        if (context.parsed !== null) {
                            label += ': ' + context.parsed + ' applications';
                        }
                        return label;
                    }
                }
            }
        }
    }
});

// Applications by Status Chart
const applicationsByStatusCtx = document.getElementById('applications-by-status-chart').getContext('2d');
const applicationsByStatusChart = new Chart(applicationsByStatusCtx, {
    type: 'bar',
    data: {
        labels: exampleData.applicationsByStatus.labels,
        datasets: [{
            label: 'Number of Applications',
            data: exampleData.applicationsByStatus.data,
            backgroundColor: '#007bff',
            borderColor: '#0056b3',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Status'
                }
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Applications'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top'
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += context.parsed.y;
                        }
                        return label;
                    }
                }
            }
        }
    }
});
