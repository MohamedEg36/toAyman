document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
        const welcomeMessage = document.getElementById('welcome-message');
        const profilePicture = document.getElementById('profile-picture');

        welcomeMessage.textContent += user.firstName;
        profilePicture.src = user.img;
    }

    fetchRescueRequests();
});


function fetchRescueRequests() {
    const token = localStorage.getItem('token');
    fetch('http://localhost:3000/api/rescue-requests', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Fetched data:', data);  

        const notificationsList = document.getElementById('notifications-list');

        // Clear the existing content (removed this line)
        // notificationsList.innerHTML = '';

        data.forEach(rescue_request => {
            const notificationItem = document.createElement('div');
            notificationItem.classList.add('notification-item');

            const notificationText = document.createElement('span');
            notificationText.textContent = `${rescue_request.reason} at ${rescue_request.location} on ${new Date(rescue_request.time).toLocaleString()}`;
            notificationItem.appendChild(notificationText);

            notificationsList.appendChild(notificationItem);
        });
    })
    .catch(error => console.error('Error fetching rescue requests:', error));
}
