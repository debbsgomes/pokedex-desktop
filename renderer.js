const axios = require('axios');

// Function to fetch Pokémon data

let allPokemon = [];

document.getElementById('search-button').addEventListener('click', () => {
    const pokemonSearch = document.getElementById('pokemon-search').value.toLowerCase();
    fetchPokemon(pokemonSearch);
  });
  
  // Function to fetch multiple Pokémon data
const fetchPokemonList = async (limit = 20, offset = 0) => {
    try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
        const pokemonList = response.data.results;

        for (const pokemon of pokemonList) {
            const pokemonData = await axios.get(pokemon.url);
            allPokemon.push(pokemonData.data); // Store Pokémon data in allPokemon array
            displayPokemon(pokemonData.data);
        }
    } catch (error) {
        console.error('Error fetching Pokémon list:', error);
    }
};

// Function to display Pokémon data in the UI
const displayPokemon = (pokemon) => {
    const pokemonContainer = document.getElementById('pokemon-list');
    const pokemonElement = document.createElement('div');
    pokemonElement.classList.add('pokemon-card');
    pokemonElement.innerHTML = `
        <h2>${pokemon.name}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p>Type: ${pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
        <p>Height: ${pokemon.height}</p>
        <p>Weight: ${pokemon.weight}</p>
    `;
    
    pokemonElement.addEventListener('click', () => {
        showPokemonDetails(pokemon);
    });

    pokemonContainer.appendChild(pokemonElement);
};

// Function to show detailed Pokémon information in the modal
const showPokemonDetails = (pokemon) => {
    document.getElementById('modal-name').innerText = pokemon.name;
    document.getElementById('modal-image').src = pokemon.sprites.front_default;
    document.getElementById('modal-type').innerText = `Type: ${pokemon.types.map(typeInfo => typeInfo.type.name).join(', ')}`;
    document.getElementById('modal-height').innerText = `Height: ${pokemon.height}`;
    document.getElementById('modal-weight').innerText = `Weight: ${pokemon.weight}`;
    document.getElementById('modal-abilities').innerText = `Abilities: ${pokemon.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ')}`;
    document.getElementById('modal-moves').innerText = `Moves: ${pokemon.moves.slice(0, 10).map(moveInfo => moveInfo.move.name).join(', ')}`;
    
    document.getElementById('pokemon-modal').style.display = 'block';
};

// Function to close the modal
const closeModal = () => {
    document.getElementById('pokemon-modal').style.display = 'none';
};

// Event listener for closing the modal
document.getElementById('close-modal').addEventListener('click', closeModal);

// Function to filter Pokémon by various criteria
const filterPokemon = () => {
    const type = document.getElementById('filter-type').value;
    const generation = document.getElementById('filter-generation').value;
    const ability = document.getElementById('filter-ability').value.toLowerCase();
    const minStat = parseInt(document.getElementById('filter-stat').value) || 0;

    let filteredPokemon = allPokemon;

    // Filter by type
    if (type !== 'all') {
        filteredPokemon = filteredPokemon.filter(pokemon =>
            pokemon.types.some(typeInfo => typeInfo.type.name === type)
        );
    }

    // Filter by generation
    if (generation !== 'all') {
        filteredPokemon = filteredPokemon.filter(pokemon =>
            pokemon.game_indices.some(indexInfo => indexInfo.version.name.startsWith(generation))
        );
    }

    // Filter by ability
    if (ability) {
        filteredPokemon = filteredPokemon.filter(pokemon =>
            pokemon.abilities.some(abilityInfo => abilityInfo.ability.name.includes(ability))
        );
    }

    // Filter by base stat (HP in this case)
    filteredPokemon = filteredPokemon.filter(pokemon =>
        pokemon.stats.find(stat => stat.stat.name === 'hp').base_stat >= minStat
    );

    renderPokemonList(filteredPokemon);
};

// Function to sort Pokémon by selected criteria
const sortPokemon = () => {
    const sortBy = document.getElementById('sort-by').value;
    const sortedPokemon = [...allPokemon].sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        return a[sortBy] - b[sortBy];
    });
    renderPokemonList(sortedPokemon);
};

// Function to render the Pokémon list
const renderPokemonList = (pokemonList) => {
    const pokemonContainer = document.getElementById('pokemon-list');
    pokemonContainer.innerHTML = ''; // Clear existing Pokémon
    pokemonList.forEach(displayPokemon);
};

// Event listeners for filtering and sorting
document.getElementById('filter-type').addEventListener('change', filterPokemon);
document.getElementById('filter-generation').addEventListener('change', filterPokemon);
document.getElementById('filter-ability').addEventListener('input', filterPokemon);
document.getElementById('filter-stat').addEventListener('input', filterPokemon);
document.getElementById('sort-by').addEventListener('change', sortPokemon);

// Fetch and display the first Pokémon (Bulbasaur)
fetchPokemonList(20, 0);

let currentOffset = 0;
const limit = 20;

document.getElementById('load-more').addEventListener('click', () => {
    currentOffset += limit;
    fetchPokemonList(limit, currentOffset);
});