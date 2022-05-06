Pokemon = {
    List: [],
    ListFull: [],
    Quantity: 30,
    Types: ['grass', 'fire', 'water', 'bug', 'normal', 'poison', 'electric', 'ground', 'fairy', 'fighting', 'psychic', 'rock', 'ghost', 'ice', 'dragon', 'dark', 'steel'],
    Roll: true,
    AllNames: [],
    Favorites: [],
    Active: {},
    Categories: {},
    Page: 0,
    Names: {
        Category: []
    },
    NextPage: true,
    Load: 1
}

// Load 1: Normal , 2:Categoria, 3: Pesquisa

Traducao = {
    grass    : "Selva",
    fire     : "Fogo",
    water    : "Água",
    bug      : "Inseto",
    normal   : "Normal",
    poison   : "Venenoso",
    electric : "Elétrico",
    ground   : "Terra",
    fairy    : "Mágico",
    fighting : "Lutador",
    psychic  : "Psiquico",
    rock     : "Pedra",
    ghost    : "Fantasma",
    ice      : "Gelo",
    dragon   : "Dragão",
    dark     : "Obscuro",
    steel    : "Ferro",
    flying   : "Voador"
}

function init(){
    PokemonRefreshFavorites()
    RenderNamesPage(Pokemon.AllNames, Pokemon.Page)
    PokemonAllNames()
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

    if (Pokemon.Favorites.includes(id)) 
        PokemonRemoveFavorites(id)
    

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
function RenderModal(id){
    PokemonsInfo(id).then(e=>{

        modal_name.innerHTML  = e.name
        modal_img.src   = e.img
        modal_hp.innerHTML    = e.status[0]
        modal_atk.innerHTML   = e.status[0]
        modal_def.innerHTML   = e.status[1]
        modal_satk.innerHTML  = e.status[2]
        modal_sdef.innerHTML  = e.status[3]
        modal_speed.innerHTML = e.status[4]
        modal_weight.innerHTML  = e.weight+" KG"
        modal_height.innerHTML = e.height+" M"
        modal_type.innerHTML  = e.types.map(e=>Traducao[e]).join(" | ")
        progress_hp.style.width = 100/200*e.status[0]+"%"
        progress_atk.style.width = 100/200*e.status[0]+"%"
        progress_def.style.width = 100/200*e.status[1]+"%"
        progress_satk.style.width = 100/200*e.status[2]+"%"
        progress_sdef.style.width = 100/200*e.status[3]+"%"
        progress_speed.style.width = 100/200*e.status[4]+"%"
        ball.classList.value = 'ball bg-'+e.types[0]
        modal_type.classList.value = "border-"+e.types[0]
    })
}

function RenderCard(obj){
    icon_active = Pokemon.Favorites.includes(obj.id) ? 'icon-active' : ''
    
    let cardStructure = `
    <div class="card card-${obj.types[0]}">
        <div class="card-effects"></div>
        <img class="card-img" src="${obj.pixel}">
        <p class="card-name">${obj.name}</p>
        <p class="type-poke">${obj.types.map(e=>Traducao[e]).join(" | ")}</p>
        <div class="btn btn-red-outlined" onclick="RenderModal(${obj.id});modal.on()">Info</div>
        <div class="card-info">
            <p>#${obj.id}</p>
            <img onclick="PokemonAddFavorites(${obj.id}); this.classList.toggle('icon-active')" src="src/images/heart.svg"  class='icon ${icon_active}'>
        </div>
    </div>
    `
    div = document.createElement('div')
    div.innerHTML = cardStructure
    cards.appendChild(div)
}

function ObjectAtt(obj, name){
    return Object.keys(obj)[Object.values(obj).indexOf(name)]
}

function RenderCardId(id){
    PokemonsInfo(id).then(e=>RenderCard(e))
}

function RenderCardList(array_obj){
    array_obj.map(e=>RenderCard(e))
}

function RenderByObjects(array_obj){
    Pokemon.Roll = false
    cardClear()
    array_obj.map(e=>RenderCard(e))
}

function RenderByName(array){
    PokemonsInfoNames(array).then(e=>RenderByObjects(e))
}

function RenderNames(array_names){
    let aa = array_names
    let bb = 0

    function RenderName(n){
        fetch('https://pokeapi.co/api/v2/pokemon/'+n).then(e=>{
            if(bb < aa.length){
                PokemonsInfoName(aa[bb]).then(e=>{
                    RenderCard(e)
                    RenderName(aa[++bb])
                    Pokemon.NextPage = true
                })
            }
        })
    }
    RenderName(aa[bb])
}

function RenderNamesPage(array_names, pag){
    k = array_names.slice(pag*Pokemon.Quantity, pag*Pokemon.Quantity+Pokemon.Quantity)
    RenderNames(k)
}

function cardClear(){
    cards.innerHTML = ""
}

function RenderByCategory(string){
    Pokemon.Page = 0
    Pokemon.Load = 2
    Pokemon.Roll = false
    cardClear()
    PokemonListNameByCategory(string).then(e=>{
        Pokemon.Names.Category = e
        Pokemon.Roll = true
        Pokemon.CategoryActive = string
    })
}

function RenderCardBalls(type_pokemon){
    c = [...document.querySelectorAll('.card')]
    c.map(e=>e.classList.value = 'card card-'+type_pokemon)
}

function RenderByFavorites(string){
    cardClear()
    PokemonListNameByCategory(string).then(e=>RenderByName(e))
}
function RenderPage(pg){
    let n1 = pg*Pokemon.Quantity+1
    let n2 = pg*Pokemon.Quantity+Pokemon.Quantity
    
    function chama(n){
        PokemonsInfo(n).then(e=>{
            if(n1 < n2){
                if(n > 0)
                    RenderCard(e)
                chama(++n1)
            }
        })
    }

    chama(n1)
}

// FUNCTIONS
function PokemonSearch(string){
    Pokemon.Page = 0
    Pokemon.Load = 3
    r = new RegExp("\\b"+string.toLowerCase(), "g")
    Pokemon.Filtered = Pokemon.AllNames.filter(e=>e.match(r))

    cardClear()
    
    RenderNamesPage(Pokemon.Filtered, Pokemon.Page++)
    
    if(string.length == 0)
        Pokemon.Load = 1
}

async function PokemonAllNames(){
    a = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=893`)
    j = await a.json()
    Pokemon.AllNames = j.results.map(e=>e.name)
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
        svg: j.sprites.other.dream_world.front_default,
        pixel: j.sprites.front_default,
        weight: j.weight,
        height: j.height,
        status: j.stats.map(e=>e.base_stat)
    }
    obj.types = obj.types.sort()
    console.log(j)
    return obj
}

async function PokemonsInfoName(name){
    a = await fetch("https://pokeapi.co/api/v2/pokemon/"+name.toLowerCase())
    j = await a.json()
    obj = {
        id: j.id,
        name: j.name,
        abilities: j.abilities.map(e=>e.ability.name),
        types: j.types.map(e=>e.type.name),
        img: j.sprites.other['official-artwork'].front_default,
        pixel: j.sprites.front_default,
        weight: j.weight,
        height: j.height,
        status: j.stats.map(e=>e.base_stat)
    }
    obj.types = obj.types.sort()
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
function AddPokemonsEndScreen(){
    pos_scroll_y = Math.round(window.scrollY)
    size_h_win = window.innerHeight
    size_h_doc = document.body.scrollHeight
    factor = 1000
    dif = size_h_doc - size_h_win - factor

    if(pos_scroll_y > dif && Pokemon.Roll && Pokemon.NextPage && Pokemon.Load == 1){
        RenderNamesPage(Pokemon.AllNames, Pokemon.Page++)
        Pokemon.NextPage = false
    }

    if(pos_scroll_y > dif && Pokemon.Roll && Pokemon.NextPage && Pokemon.Load == 2){
        RenderNamesPage(Pokemon.Names.Category, Pokemon.Page++)
        Pokemon.NextPage = false
        RenderCardBalls(Pokemon.CategoryActive)
    }

    if(pos_scroll_y > dif && Pokemon.Roll && Pokemon.NextPage && Pokemon.Load == 3){
        RenderNamesPage(Pokemon.Filtered, Pokemon.Page++)
        Pokemon.NextPage = false
    }
}

setInterval(()=>AddPokemonsEndScreen(),300)



