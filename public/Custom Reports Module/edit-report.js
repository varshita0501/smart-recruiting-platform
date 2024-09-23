document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('edit-report-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Collect form data and save changes
        const reportName = document.getElementById('report-name').value;
        const dateRange = document.getElementById('date-range').value;
        const status = document.getElementById('status').value;
        const position = document.getElementById('position').value;
        const source = document.getElementById('source').value;
        const fields = Array.from(document.querySelectorAll('#fields-to-include input:checked'))
                             .map(input => input.value);

        // Save the changes to the report
        alert(`Report '${reportName}' updated with filters: Date Range - ${dateRange}, Status - ${status}, Position - ${position}, Source - ${source}, Fields - ${fields.join(', ')}`);
        
        // Optionally, redirect to the report details screen
        window.location.href = 'report-details.html';
    });
});
