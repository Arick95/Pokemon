let limit = 4;
let offset = 0;
let overlayArray = [];
let PokemonsArray = [];
let PokemonUrl;
let seacher;
let results;
let Pokemonbackup = [];

async function init() {
    let url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
    let pokeResponse = await fetch(url);
    let pokeJson = await pokeResponse.json();
    PokemonUrl = pokeJson;
    await loadingPokemonsUrls(PokemonUrl);
}

async function loadingPokemonsUrls(p) {
    let items = p.results;
    for (let i = 0; i < items.length; i++) {
        let pokeResponse = await fetch(items[i].url);
        let pokeJson = await pokeResponse.json();
        let pokemondata = pokeJson;
        await loadPokemonsData(pokemondata);
    }
}

async function loadPokemonsData(pokemondata) {
    document.getElementById('Pokecontainer').innerHTML = ``;
    PokemonsArray.push(pokemondata);
    Pokemonbackup = PokemonsArray;

    await loadPokemonArray()

}
async function loadPokemonArray() {
    PokemonsArray.forEach(async p => {
        await showPokemons(p)
    });
}

async function showPokemons(Pokemon) {
    let name = Pokemon.name.charAt(0).toUpperCase() + Pokemon.name.slice(1);
    let sprite = Pokemon.sprites.other.home.front_default;
    let id = Pokemon.id;
    document.getElementById('Pokecontainer').innerHTML += `  
    <div class="Pokebox" id="Pokebox${id}" onclick="loadInfoOverlay(${id})">
    <div class="Pokeframe">
        <div style="background-color: white; border-radius: 25px;">
            <div class="pokecheast" id="pokecheast${id}">
            <div>
                <div class="pokenumber" id="pokenumber${id}">#${id}</div>
                <div class="pokename" id="pokename${id}">${name}</div>
            </div>
                <div class="pokespritebox" id="pokespritebox${id}">
                    <img class="sprite" src="${sprite}">
                </div>
                
                <div class="poketypebox" id="poketypebox${id}">
                    <div class="poketype" id="poketype${id}"></div>
                </div>
            </div>
        </div>
    </div>
    </div>`;
    await unpackTypesData(Pokemon, id)
}



async function unpackTypesData(Pokemon, id) {
    Pokemon.types.forEach(async element => {
        let type = element.type.name;
        let typesName = type.charAt(0).toUpperCase() + type.slice(1);
        addtypes(typesName, id)
    });
    await addBackgroundColor(Pokemon, id, `1`)
}

async function addtypes(type, id) {
    document.getElementById(`poketype${id}`).innerHTML += `<div id="type${id}" class="type type-${type}">${type}</div>`;
}

async function addBackgroundColor(Pokemon, id, number) {
    let colorTypes = Pokemon.types[0].type.name
    if (number == '1') {
        document.getElementById(`pokecheast${id}`).classList.add(`color-${colorTypes}`)
    }
    if (number == '2') {
        document.getElementById(`overlay-background${id}`).classList.add(`color-${colorTypes}`)
    }
}

async function loadInfoOverlay(i) {
    overlayArray = []
    overlayArray = PokemonsArray;
    let pokemon = overlayArray.filter(element => {
        return element.id == i;
    });
    let Pokemon = pokemon[0]
    let name = Pokemon.name.charAt(0).toUpperCase() + Pokemon.name.slice(1);
    let sprite = Pokemon.sprites.other.home.front_default;
    let id = Pokemon.id;

    await Overlay(Pokemon, name, sprite, id)
}

async function Overlay(Pokemon, name, sprite, id) {

    document.getElementById(`biginfo`).innerHTML += `
        <div id="MainOverlay${id}" class="d-none">
        <div class="poke-overlay" id="poke-overlay${id}" onclick="closeOverlay(${id})">

            <div class="pokeCard" onclick="preventBubbling(event)">
                <div class="Pokeframe-Overlay">
                    <div id="overlay-background${id}" class="overlay-background">

                        <div class="pokename">${name}</div>
                        <div class="pokespritebox">
                            <img class="sprite" src="${sprite}">
                        </div>
                        <div class="Overlay-flex">
                            <div id="Ability${id}">Ability
                            </div>
                            <div id="Hidden-Ability${id}">Hidden Ability
                            </div>
                        </div>
                        <div class="Overlay-btn">
                            <button onclick="switchToAppearance(${id})">Appearance</button>
                            <button onclick="switchToStats(${id})">Stats</button>
                            <button onclick="switchToMove(${id})">Move</button>
                        </div>
                        <div class="information" id="information${id}">
                            <div class="d-none" id="appearance-container${id}"> </div>
                            <div class="d-none" id="stats-container${id}"> </div>
                            <div class="d-none" id="movepool-container${id}"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
    openOverlay(id);
    loadingAbility(Pokemon, id);
    loadInformation(Pokemon, id);
    await addBackgroundColor(Pokemon, id, `2`)
}

/*  */

async function loadingAbility(Pokemon, id) {
    document.getElementById(`Hidden-Ability${id}`).innerHTML = `Hidden Ability`;
    document.getElementById(`Ability${id}`).innerHTML = `Ability`;
    Pokemon.abilities.forEach(async element => {
        if (element.is_hidden) {
            let hide = element.ability.name.charAt(0).toUpperCase() + element.ability.name.slice(1);
            document.getElementById(`Hidden-Ability${id}`).innerHTML += `<div>${hide}</div>`;
        } else {
            let nohide = element.ability.name.charAt(0).toUpperCase() + element.ability.name.slice(1);
            document.getElementById(`Ability${id}`).innerHTML += `<div>${nohide}</div>`;
        }
    });
}

async function loadInformation(Pokemon, id) {

    await loadStats(Pokemon, id);
    await loadMovePool(Pokemon, id);
    await loadAppearance(Pokemon, id);
}

async function loadStats(Pokemon, id) {

    Pokemon.stats.forEach(stats => {
        let name = stats.stat.name.charAt(0).toUpperCase() + stats.stat.name.slice(1);

        document.getElementById(`stats-container${id}`).innerHTML += `
        <div>
            <div id="bar" class="bar  color-${name}" style="width:${stats.base_stat}px;"></div>
            <div id="stateName" class="">${name}: ${stats.base_stat}</div>
        </div>`;
    });
}
async function loadMovePool(Pokemon, id) {

    Pokemon.moves.forEach(m => {
        let name = m.move.name.charAt(0).toUpperCase() + m.move.name.slice(1);
        document.getElementById(`movepool-container${id}`).innerHTML += `<div id="movepool${id}"style="margin-bottom:5px">${name}</div>`;
    });
}
async function loadAppearance(Pokemon, id) {
    Weight = Pokemon.weight / 10;
    Height = Pokemon.height / 10;
    document.getElementById(`appearance-container${id}`).innerHTML += `<div id="ministats${id}" class="Overlay-flex">
    <div>Weight: ${Weight} kg</div>
    <div>Index Number : ${id}</div>
    <div></div>Height: ${Height} m</div>
    `
}

function switchToAppearance(i) {
    document.getElementById(`appearance-container${i}`).classList.remove(`d-none`);
    document.getElementById(`stats-container${i}`).classList.add(`d-none`);
    document.getElementById(`movepool-container${i}`).classList.add(`d-none`);
}

function switchToStats(i) {
    document.getElementById(`stats-container${i}`).classList.remove(`d-none`);
    document.getElementById(`appearance-container${i}`).classList.add(`d-none`);
    document.getElementById(`movepool-container${i}`).classList.add(`d-none`);
}

function switchToMove(i) {
    document.getElementById(`movepool-container${i}`).classList.remove(`d-none`);
    document.getElementById(`appearance-container${i}`).classList.add(`d-none`);
    document.getElementById(`stats-container${i}`).classList.add(`d-none`);
}

function openOverlay(i) {
    document.getElementById(`MainOverlay${i}`).classList.remove(`d-none`);
    document.getElementById(`Pokecontainer`).classList.add(`blur`);
}

function closeOverlay(i) {

    document.getElementById(`MainOverlay${i}`).classList.add(`d-none`);
    document.getElementById(`Pokecontainer`).classList.remove(`blur`);
    document.getElementById(`MainOverlay${i}`).remove();
}

function preventBubbling(event) {
    event.stopPropagation();
}

async function searchPokemon() {
    let names = document.getElementById('search-bar').value;
    seacher = names.toLowerCase()
    await pokemonFilter(seacher)
    if (seacher && results.length > 0) {
        PokemonsArray = results;
        document.getElementById('Pokecontainer').innerHTML = ``;
        loadPokemonArray();  
        PokemonsArray = Pokemonbackup;  
    }
    else {
        await ifPokemonNoFund();
    }
};

async function pokemonFilter(seacher) {
    results = PokemonsArray.filter(element => {
        let PoekmonName = element.name.slice(0, 99)
        return PoekmonName.includes(seacher);
    });
}

async function ifPokemonNoFund() {
    PokemonsArray = []
    init();
}
function howManyPokemonShouldLoading() {
    limit = document.getElementById('input-number').value;
    PokemonsArray = []
    init();
}
function LoadPokemonOffSet() {
    offset = document.getElementById('Generation').value;
    PokemonsArray = []
    init();
}