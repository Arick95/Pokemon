url = 'https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0';
let poke_type_color = ['fire', 'water', 'grass', 'ground', 'rock', 'steel', 'ice', 'fairy', 'dark', 'normal', 'dragon', 'bug', 'fighting', 'psychic', 'poison', 'electric', 'ghost', 'flying'];
let PokemonUrl;
let type;
let name;
let sprite;
let id;

async function init() {
    await urlunpacker(url)
    await loadingPokemonsUrls(PokemonUrl);
}

async function loadingPokemonsUrls(p) {
    pokemons = p.results
    pokemons.forEach(element => {
        loadingPokemons(element.url)
    });
}

async function loadingPokemons(Pokeurl) {
    await urlunpacker(Pokeurl);
    loadPokemonsData();
}

async function urlunpacker(Pokeurl) {
    let pokeRepsonse = await fetch(Pokeurl);
    let pokeJson = await pokeRepsonse.json();
    PokemonUrl = pokeJson;
}

function loadPokemonsData() {
    name = PokemonUrl.name.charAt(0).toUpperCase()+ PokemonUrl.name.slice(1);
    sprite = PokemonUrl.sprites.front_default;
    id = PokemonUrl.id;
    loadPokemons();
    PokemonUrl.types.forEach(element => {
        type = element.type.name;
        type = type.charAt(0).toUpperCase()+ type.slice(1);
        addtypes();
    });
}
function addtypes() {
    document.getElementById(`poketype${id}`).innerHTML += `<div>${type}</div>`;
}

function loadPokemons() {
    document.getElementById('Pokecontainer').innerHTML += `  
    <div class="Pokebox" id="Pokebox">
        <div class="pokecheast" id="pokecheast">
        <div class="pokespritebox" id="pokespritebox">
            <img class="sprite" src="${sprite}">
        </div>
        <div class="pokenumber" id="pokenumber">${id}</div>
        <div class="pokename" id="pokename">${name}</div>
        <div class="poketypebox" id="poketypebox">
            <div class="poketype" id="poketype${id}"></div>
            </div>
        </div>
    </div>`;
}

