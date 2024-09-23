document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('create-report-form');

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Collect form data and generate report
        const reportName = document.getElementById('report-name').value;
        const dateRange = document.getElementById('date-range').value;
        const status = document.getElementById('status').value;
        const position = document.getElementById('position').value;
        const source = document.getElementById('source').value;
        const fields = Array.from(document.querySelectorAll('#fields-to-include input:checked'))
                             .map(input => input.value);

        // Generate the report based on selected criteria
        // This could involve sending the data to a server and receiving a report file or ID
        alert(`Report '${reportName}' generated with filters: Date Range - ${dateRange}, Status - ${status}, Position - ${position}, Source - ${source}, Fields - ${fields.join(', ')}`);
        
        // Optionally, redirect to the report details screen
        window.location.href = 'report-details.html';
    });
});
