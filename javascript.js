let limit = 1;
let offset = 0;
url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
let PokemonsArray = [];
let PokemonUrl;
let seacher;


async function init() {
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
    PokemonsArray.forEach(async p => {
        await showPokemons(p)

    });
    /*   console.log(Pokemons)
      name = PokemonUrl.name.charAt(0).toUpperCase() + PokemonUrl.name.slice(1);
      sprite = PokemonUrl.sprites.front_default;
      id = PokemonUrl.id;
      await loadPokemons();
    
       */
}

async function showPokemons(Pokemon) {


    let name = Pokemon.name.charAt(0).toUpperCase() + Pokemon.name.slice(1);
    let sprite = Pokemon.sprites.front_default;
    let id = Pokemon.id;

    document.getElementById('Pokecontainer').innerHTML += `  
      <div class="Pokebox" id="Pokebox${id}" onclick="openOverlay(${id})">
          <div class="pokecheast" id="pokecheast${id}">
          <div class="pokespritebox" id="pokespritebox${id}">
              <img class="sprite" src="${sprite}">
          </div>
          <div class="pokenumber" id="pokenumber${id}">${id}.</div>
          <div class="pokename" id="pokename${id}">${name}</div>
          <div class="poketypebox" id="poketypebox${id}">
              <div class="poketype" id="poketype${id}"></div>
              </div>
          </div>
      </div>`;
    await unpackTypesData(Pokemon, id)
    await loadInfo(Pokemon,name,sprite,id);
    /*    */
}



async function unpackTypesData(Pokemon, i) {
    Pokemon.types.forEach(async element => {
        let type = element.type.name;
        let typesName = type.charAt(0).toUpperCase() + type.slice(1);
        addtypes(typesName, i)
    });
    await addBackgroundColor(Pokemon, i);
}

function addtypes(type, id) {
    document.getElementById(`poketype${id}`).innerHTML += `<div>${type}</div>`;

}

async function addBackgroundColor(Pokemon, i) {

    let Poketype = Pokemon.types
 
    Poketype.forEach(element => {
        let colorTypes = element.type.name;
        document.getElementById(`pokecheast${i}`).classList.add(`color-${colorTypes}`)
    });


}

async function loadInfo(Pokemon,name,sprite,id) {
    document.getElementById(`biginfo`).innerHTML += `
    <div class="poke-overlay d-none" id="poke-overlay${id}" onclick="closeOverlay(${id})">
            <div class="pokeCard">
                <img class="sprite" src="${sprite}">
                <div id="Ability${id}">Ability
                <div id="effect${id}"></div></div>
                <div id="Hidden-Ability${id}">Hidden Ability
                </div>
                <button>Description</button>
                <button>Stats</button>
                <button>Move</button>
            </div>
        </div>`
    await loadingAbility(Pokemon,id);
}

async function loadingAbility(Pokemon,id) {
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

function searchPokemon() {
    seacher = document.getElementById('search-bar').value;
    PokemonUrl.forEach(element => {
        if (element.slice(0, 99) === seacher) {
            console.log('work');
        } else {
            console.log('not')
        }
    });
};
