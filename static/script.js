let petNames = [];

async function initialize() {
    let response = await fetch('/get-pet-names');
    petNames = await response.json();
    let baseInput = document.getElementById('base');

    petNames.forEach(pet => {
        let name = pet.name;
        let petInput = document.getElementById(name);
        petInput.addEventListener('input', () => calculateDiff(baseInput, petInput));
    });
}

function calculateDiff(baseInput, petInput) {
    let diffElement = document.getElementById(petInput.id + 'Diff');
    let diff = Math.floor((petInput.value - baseInput.value) * 10) / 10;
    diffElement.innerText = diff.toFixed(1);
}

async function submitForm(event) {
    event.preventDefault();
    let date = new Date().toISOString();
    let base = document.getElementById('base');
    let baseWeight = base.value;
    let name = base.name;
    let data = [];
    let baseData = {
        "name": name,
        "weight": parseFloat(baseWeight.trim())
    }
    data.push(baseData);
    petNames.forEach(pet => {
        let name = pet.name;
        console.log('Adding data for pet: ' + name);
        let diffElement = document.getElementById(name + 'Diff');
        let diff = parseFloat(diffElement.innerText.trim());
        let petData = {
            "name": name,
            "weight": diff
        };
        data.push(petData);
    });

    try {
        const response = await fetch('insert-weights', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            let errorMsg = `There was a problem processing your request. Please try again. (HTTP status: ${response.status})`;
            alert(errorMsg);
            throw new Error(`HTTP error! status: ${response.status}`);
        } else {
            petNames.forEach(pet => {
                let name = pet.name;

                document.getElementById(name).value = '';
                document.getElementById(name + 'Diff').innerText = '';
            });

            document.getElementById('base').value = '';
        }
    } catch (error) {
        console.log('There was a problem with the fetch operation: ' + error.message);
    }
}