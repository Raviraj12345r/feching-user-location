let userLatitude;
let userLongitude;
let userPincode;

function getData() {
  // Assume userPincode is obtained from a previous step
  userPincode = "411001"; // Example pin code

  // Step 1: Get user's location using the provided pin code
  fetch(`https://api.postalpincode.in/pincode/${userPincode}`)
    .then(response => response.json())
    .then(data => {
      const postOfficeData = data[0].PostOffice;
      displayPostOffices(postOfficeData);
    })
    .catch(error => console.error('Error fetching post offices:', error));

  // Step 2: Get user's IP address and location
  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(data => {
      const ipAddress = data.ip;
      return fetch(`https://ipapi.co/${ipAddress}/json/`);
    })
    .then(response => response.json())
    .then(locationData => {
      userLatitude = locationData.latitude;
      userLongitude = locationData.longitude;
      document.getElementById('latitude').innerText = userLatitude;
      document.getElementById('longitude').innerText = userLongitude;
      document.getElementById('city').innerText = locationData.city;
      document.getElementById('region').innerText = locationData.region;
      document.getElementById('timezone').innerText = locationData.timezone;

      displayMap(userLatitude, userLongitude);
    })
    .catch(error => console.error('Error fetching location:', error));
}

function displayMap(latitude, longitude) {
  const mapDiv = document.getElementById('map');
  const map = new google.maps.Map(mapDiv, {
    center: { lat: parseFloat(latitude), lng: parseFloat(longitude) },
    zoom: 12
  });
}

function displayPostOffices(postOffices) {
  const postOfficeList = document.getElementById('post-office-list');
  postOfficeList.innerHTML = '';

  const searchBox = document.getElementById('search-box');
  searchBox.addEventListener('input', () => {
    const searchText = searchBox.value.toLowerCase();
    const filteredPostOffices = postOffices.filter(postOffice => {
      const name = postOffice.Name.toLowerCase();
      const branch = postOffice.BranchType.toLowerCase();
      return name.includes(searchText) || branch.includes(searchText);
    });

    renderPostOffices(filteredPostOffices);
  });

  renderPostOffices(postOffices);
}

function renderPostOffices(postOffices) {
  const postOfficeList = document.getElementById('post-office-list');
  postOfficeList.innerHTML = '';

  postOffices.forEach(postOffice => {
    const listItem = document.createElement('li');
    listItem.textContent = `${postOffice.Name} - ${postOffice.BranchType}`;
    postOfficeList.appendChild(listItem);
  });
}