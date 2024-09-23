// JavaScript for handling the modal
document.querySelector('.btn-add-field').addEventListener('click', function() {
    document.getElementById('add-field-modal').style.display = 'block';
});

document.querySelector('.close-btn').addEventListener('click', function() {
    document.getElementById('add-field-modal').style.display = 'none';
});

// Show/Hide Field Options
document.getElementById('field-type').addEventListener('change', function() {
    const fieldOptionsContainer = document.getElementById('field-options-container');
    if (this.value === 'Dropdown' || this.value === 'Checkbox' || this.value === 'Radio Button') {
        fieldOptionsContainer.style.display = 'block';
    } else {
        fieldOptionsContainer.style.display = 'none';
    }
});
