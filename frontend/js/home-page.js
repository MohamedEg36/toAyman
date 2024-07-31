document.addEventListener('DOMContentLoaded', function() {
    // Check if token is stored in localStorage
    console.log('Stored token:', localStorage.getItem('token'));

    // Fetch user details
    fetch('http://localhost:3000/api/auth/me', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(response => response.json())
    .then(user => {
        console.log('User:', user);
        document.getElementById('welcome-message').innerText = `Welcome ${user.firstName}`;
        document.getElementById('profile-picture').src = user.img;
        document.getElementById('profile-picture-menu').src = user.img;
        document.getElementById('profile-name').innerText = `${user.firstName} ${user.lastName}`;
        document.getElementById('profile-email').innerText = user.email;
        document.getElementById('car-count').innerText = `${user.cars.length} cars`;
        
    })
    .catch(error => {
        console.error('Error fetching user details:', error);
    });

    // Fetch and display volunteer updates
    fetch('http://localhost:3000/api/volunteers/updates')
        .then(response => response.json())
        .then(data => {
            const updatesContainer = document.getElementById('volunteer-updates');
            data.forEach(update => {
                const updateDiv = document.createElement('div');
                updateDiv.classList.add('volunteer-update');

                updateDiv.innerHTML = `
                    <span>${update.issue}, ${update.location} ${update.date}</span>
                    <button class="info-button">i</button>
                `;

                updatesContainer.appendChild(updateDiv);
            });
        })
        .catch(error => console.error('Error fetching the updates:', error));

    // Initialize Leaflet map
    var map = L.map('map').setView([51.505, -0.09], 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    L.marker([32.09001462584199, 34.80355837513058]).addTo(map)
        .bindPopup('A pretty CSS popup.<br> Easily customizable.')
        .openPopup();

    // Add event listener to the report button
    const makeReportButton = document.getElementById('make-report-button');
    makeReportButton.addEventListener('click', () => {
        window.location.href = 'car-finder.html';
    });

    // Toggle side menu
    const menuToggle = document.getElementById('menu-toggle');
    const sideMenu = document.getElementById('side-menu');
    const overlay = document.getElementById('overlay');

    menuToggle.addEventListener('click', () => {
        sideMenu.classList.toggle('open');
        overlay.classList.toggle('show');
        document.body.classList.toggle('menu-open');
    });

    overlay.addEventListener('click', () => {
        sideMenu.classList.remove('open');
        overlay.classList.remove('show');
        document.body.classList.remove('menu-open');
    });

    // Switch toggle logic
    const roadUpdatesSwitch = document.getElementById('road-updates');
    const volunteerUpdatesSwitch = document.getElementById('volunteer-updates-switch');
    roadUpdatesSwitch.addEventListener('change', () => {
        if (roadUpdatesSwitch.checked) {
            volunteerUpdatesSwitch.checked = false;
            // Fetch and display road updates
            // Example: fetchRoadUpdates();
        }
    });
    volunteerUpdatesSwitch.addEventListener('change', () => {
        if (volunteerUpdatesSwitch.checked) {
            roadUpdatesSwitch.checked = false;
            // Fetch and display volunteer updates
            fetchVolunteerUpdates();
        }
    });

    function fetchVolunteerUpdates() {
        fetch('/volunteer/updates')
            .then(response => response.json())
            .then(data => {
                const updatesContainer = document.getElementById('volunteer-updates');
                updatesContainer.innerHTML = '';
                data.forEach(update => {
                    const updateDiv = document.createElement('div');
                    updateDiv.classList.add('volunteer-update');
                    updateDiv.innerHTML = `<span>${update.issue}, ${update.location} ${update.date}</span>
                                           <button class="info-button">i</button>`;
                    updatesContainer.appendChild(updateDiv);
                });
            })
            .catch(error => console.error('Error fetching the updates:', error));
    }

    // Log out functionality
    const logoutButton = document.getElementById('logout');
    logoutButton.addEventListener('click', () => {
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    });
});