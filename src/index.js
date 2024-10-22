document.addEventListener('DOMContentLoaded', () => {
  const dogBar = document.getElementById('dog-bar');
  const dogInfo = document.getElementById('dog-info');
  const filterButton = document.getElementById('good-dog-filter');
  
  let allDogs = []; 
  let filterGoodDogs = false;  
  
  fetch('http://localhost:3000/pups')
      .then(response => response.json())
      .then(dogs => {
          allDogs = dogs;  
          renderDogs(allDogs); 
      });
  
 
  function renderDogs(dogs) {
      dogBar.innerHTML = ''; 
      dogs.forEach(dog => addDogToDogBar(dog));
  }

  function addDogToDogBar(dog) {
      const span = document.createElement('span');
      span.textContent = dog.name;
      span.addEventListener('click', () => displayDogInfo(dog));
      dogBar.appendChild(span);
  }

  function displayDogInfo(dog) {
      dogInfo.innerHTML = '';  

      const img = document.createElement('img');
      img.src = dog.image;

      const h2 = document.createElement('h2');
      h2.textContent = dog.name;

      const button = document.createElement('button');
      button.textContent = dog.isGoodDog ? "Good Dog!" : "Bad Dog!";
      button.addEventListener('click', () => toggleGoodDog(dog, button));

      dogInfo.append(img, h2, button);
  }

  function toggleGoodDog(dog, button) {
      const newStatus = !dog.isGoodDog;

      button.textContent = newStatus ? "Good Dog!" : "Bad Dog!";

      fetch(`http://localhost:3000/pups/${dog.id}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ isGoodDog: newStatus })
      })
      .then(response => response.json())
      .then(updatedDog => {
    
          dog.isGoodDog = updatedDog.isGoodDog;
      
          if (filterGoodDogs) {
              const filteredDogs = allDogs.filter(d => d.isGoodDog);
              renderDogs(filteredDogs);
          }
      })
      .catch(error => {
          console.error('Error updating dog status:', error);
      });
  }

 // Filter dogs 
  filterButton.addEventListener('click', () => {
      filterGoodDogs = !filterGoodDogs;  

      filterButton.textContent = filterGoodDogs ? "Filter good dogs: ON" : "Filter good dogs: OFF";

      const filteredDogs = filterGoodDogs ? allDogs.filter(dog => dog.isGoodDog) : allDogs;
      renderDogs(filteredDogs);
  });
});
