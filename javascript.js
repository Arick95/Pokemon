url = 'https://pokeapi.co/api/v2/pokemon?limit=10&offset=0'


async function init() {
    let pokeRepsonse = await fetch(url);
    let pokeJson = await pokeRepsonse.json();
    await loadingPokemonsUrls(pokeJson);
}
async function loadingPokemonsUrls(p){
    pokemons = p.results
    
    pokemons.forEach(element => {
        loadingPokemons(element.url)
    });
}

async function loadingPokemons(Pokeurl){
    let pokeRepsonse = await fetch(Pokeurl);
    let pokeJson = await pokeRepsonse.json();
    
    showPokemon(pokeJson)
}

function showPokemon(pokeJson){
    console.log(pokeJson)
    document.getElementById('Pokebox').innerHTML += `<div>${pokeJson.name}</div>`;
}