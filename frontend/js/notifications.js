document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        const welcomeMessage = document.getElementById('welcome-message');
        const profilePicture = document.getElementById('profile-picture');

        welcomeMessage.textContent += user.firstName;
        profilePicture.src = user.img;
    }

    fetchNotifications();
});

function fetchNotifications() {
    fetch('/notifications')
        .then(response => response.json())
        .then(data => {
            const notificationsList = document.getElementById('notifications-list');

            // Clear the existing content
            notificationsList.innerHTML = '';

            const sections = ['Now', 'Recently', 'Older'];
            sections.forEach(section => {
                const sectionDiv = document.createElement('div');
                sectionDiv.classList.add('notification-section');

                const sectionTitle = document.createElement('h2');
                sectionTitle.textContent = section;
                sectionDiv.appendChild(sectionTitle);

                data[section.toLowerCase()].forEach(notification => {
                    const notificationItem = document.createElement('div');
                    notificationItem.classList.add('notification-item');

                    const carImage = document.createElement('img');
                    carImage.src = notification.carImage || 'images/default_car.png'; // Use a default image if not provided
                    carImage.alt = 'Car Image';
                    notificationItem.appendChild(carImage);

                    const notificationText = document.createElement('span');
                    notificationText.textContent = `${notification.carId} ${notification.message}`;
                    notificationItem.appendChild(notificationText);

                    if (notification.isImportant) {
                        const notificationIcon = document.createElement('span');
                        notificationIcon.classList.add('notification-icon');
                        notificationIcon.textContent = '!';
                        notificationItem.appendChild(notificationIcon);
                    }

                    notificationItem.addEventListener('click', () => openMessage(notification.carId));
                    sectionDiv.appendChild(notificationItem);
                });

                notificationsList.appendChild(sectionDiv);
                if (section !== 'Older') {
                    const hr = document.createElement('hr');
                    notificationsList.appendChild(hr);
                }
            });
        })
        .catch(error => console.error('Error fetching notifications:', error));
}

function openMessage(carId) {
    // Store the car ID in local storage to be used in messages.html
    localStorage.setItem('carId', carId);
    window.location.href = 'messages.html';
}