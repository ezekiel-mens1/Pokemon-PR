const baseUrl = 'https://pokeapi.co/api/v2';
const pokemonListElement = document.getElementById('pokemon-List');
const searchInput = document.getElementById('searchInput');
const nextButton = document.getElementById('nextButton');
const prevButton = document.getElementById('prevButton');
const pokemonDetails = document.getElementById('Details');
const modalContent = document.querySelector('.modal-content');
const closeButton = document.querySelector('.close-button');
const pokemonName = document.getElementById('pokemonName');
const species = document.getElementById('species');
const baseStats = document.getElementById('Stats-pokemons');
const types = document.getElementById('type');
const weight = document.getElementById('weight');
const moves = document.getElementById('moves');

let offset = 0;
const limit = 16;

function fetchPokemons(offset) {
  fetch(`${baseUrl}/pokemon?offset=${offset}&limit=${limit}`)
    .then(response => response.json())
    .then(data => {
      pokemonListElement.innerHTML = '';
      data.results.forEach(pokemon => {
        fetch(pokemon.url)
          .then(response => response.json())
          .then(pokemonData => {
            createPokemonCard(pokemonData);
          });
      });
    });
}

// Pokemons cards display 
function createPokemonCard(pokemonData) {
  const pokemonCard = document.createElement('div');
  pokemonCard.classList.add('pokemon-card');
  pokemonCard.innerHTML = `
    <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
    <h3>${capitalizeFirstLetter(pokemonData.name)}</h3>
  `;
  pokemonCard.addEventListener('click', () => {
    fetchPokemonDetails(pokemonData);
  });
  pokemonListElement.appendChild(pokemonCard);
}

// Function that fetch and display the details of a selected Pokémon
function fetchPokemonDetails(pokemon) {
  pokemonName.textContent = capitalizeFirstLetter(pokemon.name);
  species.textContent = capitalizeFirstLetter(pokemon.species.name);
  baseStats.innerHTML = '';
  pokemon.stats.forEach(stat => {
    const li = document.createElement('li');
    li.textContent = `${capitalizeFirstLetter(stat.stat.name)}: ${stat.base_stat}`;
    baseStats.appendChild(li);
  });
  types.textContent = pokemon.types.map(type => capitalizeFirstLetter(type.type.name)).join(', ');
  weight.textContent = `${pokemon.weight} lbs`;
  moves.innerHTML = '';
  pokemon.moves.slice(0, 10).forEach(move => {
    const li = document.createElement('li');
    li.textContent = capitalizeFirstLetter(move.move.name);
    moves.appendChild(li);
  });
  pokemonDetails.style.display = 'block';
}


function closeDetailsModal() {
  pokemonDetails.style.display = 'none';
}

closeButton.addEventListener('click', closeDetailsModal);

nextButton.addEventListener('click', () => {
  offset += limit;
  fetchPokemons(offset);
});

prevButton.addEventListener('click', () => {
  if (offset >= limit) {
    offset -= limit;
    fetchPokemons(offset);
  }
});

//  search button 
searchInput.addEventListener('input', event => {
  const searchTerm = event.target.value.trim().toLowerCase();
  if (searchTerm.length >= 3) {
    fetch(`${baseUrl}/pokemon?offset=0&limit=1118`)
      .then(response => response.json())
      .then(data => {
        const filteredPokemons = data.results.filter(pokemon => pokemon.name.includes(searchTerm));
        pokemonListElement.innerHTML = '';
        filteredPokemons.forEach(pokemon => {
          fetch(pokemon.url)
            .then(response => response.json())
            .then(pokemonData => {
              createPokemonCard(pokemonData);
            });
        });
      })
      .catch(error => {
        pokemonListElement.innerHTML = '<p>search not found.</p>';
      });
  } else if (searchTerm.length === 0) {
    fetchPokemons(offset);
  }
});


fetchPokemons(offset);

//capitalizing the first letter
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
