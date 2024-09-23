
document.addEventListener('DOMContentLoaded', function () {
    const createNewReportButton = document.getElementById('create-new-report');

    createNewReportButton.addEventListener('click', function () {
        window.location.href = 'create-report.html'; // Navigate to Create Report screen
    });

    const viewButtons = document.querySelectorAll('.view-report');
    viewButtons.forEach(button => {
        button.addEventListener('click', function () {
            window.location.href = 'report-details.html'; // Navigate to Report Details screen
        });
    });

    const editButtons = document.querySelectorAll('.edit-report');
    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            window.location.href = 'edit-report.html'; // Navigate to Edit Report screen
        });
    });

    const deleteButtons = document.querySelectorAll('.delete-report');
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Implement delete functionality here
            alert('Report deleted.');
        });
    });

    const exportButtons = document.querySelectorAll('.export-report');
    exportButtons.forEach(button => {
        button.addEventListener('click', function () {
            // Implement export functionality here
            alert('Report exported.');
        });
    });
});
