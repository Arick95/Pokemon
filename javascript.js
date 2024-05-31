url = 'https://pokeapi.co/api/v2/pokemon?limit=1&offset=0';
let PokemonUrl;
let type;
let name;
let sprite;
let id;
let colorType;

async function init() {
    await urlunpacker(url)
    await loadingPokemonsUrls(PokemonUrl);
}

async function loadingPokemonsUrls(p) {
    let pokemons = p.results
    pokemons.forEach(async element => {
        await loadingPokemons(element.url)
    });
}

async function loadingPokemons(Pokeurl) {
    await urlunpacker(Pokeurl);
    await loadPokemonsData();
}

async function urlunpacker(Pokeurl) {
    let pokeRepsonse = await fetch(Pokeurl);
    let pokeJson = await pokeRepsonse.json();
    PokemonUrl = await pokeJson;
}

async function loadPokemonsData() {
    name = PokemonUrl.name.charAt(0).toUpperCase() + PokemonUrl.name.slice(1);
    sprite = PokemonUrl.sprites.front_default;
    id = PokemonUrl.id;
    await loadPokemons();
    PokemonUrl.types.forEach(element => {
        type = element.type.name;
        type = type.charAt(0).toUpperCase() + type.slice(1);
        addtypes();
    });
    addBackgroundColor();
}
function addtypes() {
    document.getElementById(`poketype${id}`).innerHTML += `<div>${type}</div>`;
}

function addBackgroundColor() {
    PokemonUrl.types.reverse().forEach(element => {
        colorType = element.type.name;
    });
    document.getElementById(`pokecheast${id}`).classList.add(`color-${colorType}`)
}

async function loadPokemons() {
    document.getElementById('Pokecontainer').innerHTML += `  
    <div class="Pokebox" id="Pokebox">
        <div class="pokecheast" id="pokecheast${id}" onclick="openOverlay(${id})">
        <div class="pokespritebox" id="pokespritebox">
            <img class="sprite" src="${sprite}">
        </div>
        <div class="pokenumber" id="pokenumber">${id}.</div>
        <div class="pokename" id="pokename">${name}</div>
        <div class="poketypebox" id="poketypebox">
            <div class="poketype" id="poketype${id}"></div>
            </div>
        </div>
    </div>`;
    await loadInfo(id);
}

async function loadInfo(i) {
    console.log(PokemonUrl)
    document.getElementById(`biginfo`).innerHTML += `
    <div class="poke-overlay d-none" id="poke-overlay${i}" onclick="closeOverlay(${i})">
            <div class="pokeCard">
                <img class="sprite" src="${sprite}">
                <div id="Ability${i}">Ability
                <div id="effect${i}"></div></div>
                <div id="Hidden-Ability${i}">Hidden Ability
                </div>
                <button>Description</button>
                <button>Stats</button>
                <button>Move</button>
            </div>
        </div>`
    await loadingAbility();
}

async function loadingAbility() {
    PokemonUrl.abilities.forEach(async element => {
        if (element.is_hidden) {
            let hide = element.ability.name.charAt(0).toUpperCase() + element.ability.name.slice(1);
            document.getElementById(`Hidden-Ability${id}`).innerHTML += `<div>${hide}</div>`;
        } else {
            let nohide = element.ability.name.charAt(0).toUpperCase() + element.ability.name.slice(1);
            document.getElementById(`Ability${id}`).innerHTML += `<div>${nohide}</div>`;
        }
    });
}

async function shorteffect(effect) {
    let pokeRepsonse = await fetch(effect);
    let pokeJson = await pokeRepsonse.json();
}


function openOverlay(i) {
    document.getElementById(`poke-overlay${i}`).classList.remove(`d-none`)
}

function closeOverlay(i) {
    document.getElementById(`poke-overlay${i}`).classList.add(`d-none`)
}
