document.addEventListener('DOMContentLoaded', function () {
    const editReportButton = document.getElementById('edit-report');
    const deleteReportButton = document.getElementById('delete-report');
    const exportReportButton = document.getElementById('export-report');

    editReportButton.addEventListener('click', function () {
        window.location.href = 'edit-report.html'; // Navigate to Edit Report screen
    });

    deleteReportButton.addEventListener('click', function () {
        // Implement delete functionality here
        alert('Report deleted.');
        window.location.href = 'dashboard.html'; // Navigate back to Dashboard
    });

    exportReportButton.addEventListener('click', function () {
        // Implement export functionality here
        alert('Report exported.');
    });
});
