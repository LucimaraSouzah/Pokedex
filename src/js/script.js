/*
    HTML
        addCard(obj)                                Adiciona 1 card no html
        addCardList(array)                          Adiciona uma lista de cards
        cardsClear()                                Limpa tela dos cards
        AddPokemonsEndScreen()                      Adiciona pokemons se verificar fim da tela
        RenderByObjects(array_obj)                  Renderiza os cards pelos array de objetos
        RenderByName(array_obj)                     Renderiza os cards pelos nomes 
        RenderByCategory(string)                    Renderiza os cards pelo nome da categoria
        
    LOCALSTORAGE
        PokemonAddFavorites(id)                     Adiciona um pokemon aos favoritos
        PokemonRemoveFavorites(id)                  Deleta um pokemon dos favoritos
        PokemonRefreshFavorites()                   Atualiza a lista dos favoritos

    FUNÇÕES
        PokemonsInfo(id)                            Retorna os dados do pokemon por id
        PokemonListNames(pag)                       Retorna uma lista com os nomes de 30 pokemons
        PokemonsInfoRange(a,b)                      Retorna um array de objetos com informações dos pokemons (id)
        PokemonsInfoName(name)                      Retorna um array de objetos com informações dos pokemons (nome)
        PokemonsInfoNames(array)                    Retorna um array de objetos com informações dos pokemons (array de nomes) 
        PokemonListNameByCategory(category_name)    Retorna lista de nomes pelo nome da categoria
        PokemonAllNames()                           Retorna o nome de todos os pokemons
        PokemonSearch(string)                       Busca o nome do pokemon
*/


Pokemon = {
    List: [],
    ListFull: [],
    Quantity: 10,
    Types: ['grass', 'fire', 'water', 'bug', 'normal', 'poison', 'electric', 'ground', 'fairy', 'fighting', 'psychic', 'rock', 'ghost', 'ice', 'dragon', 'dark', 'steel'],
    Roll: true,
    AllNames: [],
    Favorites: []
}

function init(){
    PokemonRefreshFavorites()
    PokemonsInfoPage(0).then(e=>addCardList(e))
    PokemonAllNames()
    // PokemonsInfoRange(0,1200).then(e=>Pokemon.list.push(e))
}

init()

// FAVORITE
function PokemonAddFavorites(id){  
    if(localStorage.getItem('favorites') == null)
        localStorage.setItem('favorites','[]')
    favorites = JSON.parse(localStorage.getItem('favorites'))
    if(!favorites.includes(id)){
        favorites.push(id)
        localStorage.setItem('favorites', JSON.stringify(favorites))
    }
    if (Pokemon.Favorites.includes(id)) {
        PokemonRemoveFavorites(id)
    }
    PokemonRefreshFavorites()
}

function PokemonRemoveFavorites(id){
    j = JSON.parse(localStorage.getItem('favorites'))
    j = j.filter(e=>e!=id)
    localStorage.setItem('favorites', JSON.stringify(j))
    PokemonRefreshFavorites()
}

function PokemonRefreshFavorites(){
    if(localStorage.getItem('favorites') == null)
        localStorage.setItem('favorites','[]')
    
    Pokemon.Favorites = JSON.parse(localStorage.getItem('favorites'))
    Pokemon.FavoritesObj = []
    for(i of Pokemon.Favorites){
        PokemonsInfo(i).then(e=>{
            Pokemon.FavoritesObj.push(e)
        })
    }
}

// CARDS

function addCard(obj){

    // icon_active = [1,5,8].includes(obj.id) ? 'icon-active' : ''
    icon_active = Pokemon.Favorites.includes(obj.id) ? 'icon-active' : ''
    // icon_active = ''

    let cardStructure = `
    <div class="card">
        <img class="card-img" src="${obj.img}">
        <p class="card-name">${obj.name}</p>
        <p class="type-poke">${obj.types.join(' | ')}</p>
    <div class="card-info">
        <p>ID: ${obj.id}</p>
        <img onclick="PokemonAddFavorites(${obj.id}); this.classList.toggle('icon-active')" src="src/images/heart.svg"  class='icon ${icon_active}'>
    </div>
    </div>
    `
    div = document.createElement('div')
    div.innerHTML = cardStructure
    cards.appendChild(div)
}

function addCardList(array){
    array.map(e=>addCard(e))
}

function RenderByObjects(array_obj){
    Pokemon.Roll = false
    cardClear()
    array_obj.map(e=>addCard(e))
}

function RenderByName(array){
    PokemonsInfoNames(array).then(e=>RenderByObjects(e))
}

function cardClear(){
    cards.innerHTML = ""
}

function RenderByCategory(string){
    cardClear()
    PokemonListNameByCategory(string).then(e=>RenderByName(e))
}

function RenderByFavorites(string){
    cardClear()
    PokemonListNameByCategory(string).then(e=>RenderByName(e))
}

function RenderPage(num){
    cardClear();
    PokemonsInfoPage(num).then(e=>addCardList(e))
}

// FUNCTIONS

function PokemonSearch(string){
    Pokemon.Roll = false
    r = new RegExp("\\b"+string.toLowerCase(), "g")
    Filtered = Pokemon.AllNames.filter(e=>e.match(r))
    PokemonsInfoNames(Filtered).then(e=>RenderByObjects(e))
}

async function PokemonAllNames(){
    a = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=893`)
    j = await a.json()
    Pokemon.AllNames = j.results.map(e=>e.name).sort()
    return Pokemon.AllNames
}

async function PokemonListNameByCategory(category_name){
    a = await fetch(`https://pokeapi.co/api/v2/type/${category_name}`)
    j = await a.json()
    names = j.pokemon
    names = names.map(e=>e.pokemon.name)
    return names
}

async function PokemonListNames(pag){
    a = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${Pokemon.Quantity}&offset=${pag*Pokemon.Quantity}`)
    j = await a.json()
    return j.results.map(e=>e.name)
}

async function PokemonsInfo(id){
    a = await fetch("https://pokeapi.co/api/v2/pokemon/"+id)
    j = await a.json()
    obj = {
        id: j.id,
        name: j.name,
        abilities: j.abilities.map(e=>e.ability.name),
        moves: j.moves.map(e=>e.move.name),
        types: j.types.map(e=>e.type.name),
        img: j.sprites.other['official-artwork'].front_default,
        svg: j.sprites.other.dream_world.front_default
    }
    // img: j.sprites.other['official-artwork'].front_default
    // img: j.sprites.other.dream_world.front_default
    return obj
}

async function PokemonsInfoName(name){
    a = await fetch("https://pokeapi.co/api/v2/pokemon/"+name.toLowerCase())
    j = await a.json()
    obj = {
        id: j.id,
        name: j.name,
        abilities: j.abilities.map(e=>e.ability.name),
        moves: j.moves.map(e=>e.move.name),
        types: j.types.map(e=>e.type.name),
        img: j.sprites.other['official-artwork'].front_default,
        svg: j.sprites.other.dream_world.front_default
    }
    // img: j.sprites.other['official-artwork'].front_default
    // img: j.sprites.other.dream_world.front_default
    return obj
}

async function PokemonsInfoNames(array){
    Pokemon.List = []
    for(i of array){
        a = await PokemonsInfoName(i)
        Pokemon.List.push(a)
    }
    return Pokemon.List
}

// PokemonsInfoNames(['nidorina','nidoqueen'])

async function PokemonsInfoRange(a,b){
    const pokeList = []
    if(a==0)
        a=1
    for(i=a;i<b;i++){
        pokeList.push(await PokemonsInfo(i))
    }
    return pokeList
}

async function PokemonsInfoPage(pag){
    a = await PokemonsInfoRange(pag*Pokemon.Quantity,pag*Pokemon.Quantity+Pokemon.Quantity)
    return a
}




// CHECK SCREEN

let page = 1
function AddPokemonsEndScreen(){
    pos_scroll_y = Math.round(window.scrollY)
    size_h_win = window.innerHeight
    size_h_doc = document.body.scrollHeight
    factor = 1000
    dif = size_h_doc - size_h_win - factor
    if(pos_scroll_y > dif && Pokemon.Roll){
        PokemonsInfoPage(++page).then(e=> addCardList(e) )

    }
    
}

setInterval(()=>AddPokemonsEndScreen(),200)
