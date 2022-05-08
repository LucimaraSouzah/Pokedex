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

Pokemon = {
    Page: 0,
    Quantity: 30,
    Roll: true,
    Actives: [],
    Favorites: [],
    Categories: [],
    Lists: {},
    Pokemons: {
        Loaded: []
},

init(){
    this.All().then(e=>{
        this.Actives = this.Names
        Render.Preload(this.Actives, 0)
        this.ToggleFavorites()
        Render.LoadEndScreen()
    })
},

Search(str){
    r = new RegExp("\\b"+str,"")
    this.Filtered = this.Names.filter(e=>e.match(r))
    this.Actives = this.Filtered
    return this.Actives
},

ToggleFavorites(id){ 
    if(localStorage.getItem('favorites') == null)
        localStorage.setItem('favorites','[]')

    Pokemon.Favorites = JSON.parse(localStorage.getItem('favorites'))
    
    if(!Pokemon.Favorites.includes(id) && typeof(id) == 'number') 
        Pokemon.Favorites.push(id);
    else
        Pokemon.Favorites = Pokemon.Favorites.filter(e=> e != id);
    
    localStorage.setItem('favorites', JSON.stringify(Pokemon.Favorites))
},

async info(id){
    if(this.Pokemons.Loaded.filter(e=>e.id == id || e.name == id).length == 1){
        return this.Pokemons.Loaded.find(e=>e.id == id || e.name == id)
    }else{
        a = await fetch("https://pokeapi.co/api/v2/pokemon/"+id)
        j = await a.json()
        obj = {
            id        : j.id,
            name      : j.name,
            abilities : j.abilities.map(e=>e.ability.name),
            types     : j.types.map(e=>e.type.name),
            img       : j.sprites.other['official-artwork'].front_default,
            svg       : j.sprites.other.dream_world.front_default,
            pixel     : j.sprites.front_default,
            weight    : j.weight,
            height    : j.height,
            icon      : j.sprites.versions['generation-viii'].icons.front_default,
            status    : j.stats.map(e=>e.base_stat)
        }

        obj.types = obj.types.sort()
        this.Pokemons.Loaded.push(obj)
        return obj
    }
},

async InfoCategory(str){
    if(str.length == 0) 
    return Pokemon.Names

    if(Object.keys(Pokemon.Categories).includes(str))
    return Pokemon.Categories[str]

    a = await fetch(`https://pokeapi.co/api/v2/type/${str}`)
    j = await a.json()

    names = j.pokemon.map(e=>e.pokemon.name)
    return this.Categories[str] = names
    },

async All(){
    Pokemon.Lists.Pokemons = []
    Pokemon.Names = []
    a = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=899")
    j = await a.json()
    j.results.map((e,n)=>{
        Pokemon.Lists.Pokemons.push({id:n+1, name:e.name})
        Pokemon.Names.push(e.name)
    })
}}

Render = {
    Cards:cards,
    Card:{
        id(id){
            Pokemon.info(id).then(e=>{
            this.obj(e)
            })
        },
        ids(array){
            array.map(e=>{
            this.id(e)
    })
},

name(str){
    str = str.toLowerCase()
    Pokemon.info(str).then(e=>{
    this.obj(e)
    })
},

names(arr_str){
    arr_str = arr_str.map(e=>e.toLowerCase())
    arr_str = arr_str.map(e=>Pokemon.Lists.Pokemons.find(g=>g.name == e).id)
    this.ids(arr_str)
},

obj(obj){
    icon_active = Pokemon.Favorites.includes(obj.id) ? 'icon-active' : ''
    types = obj.types.map(e=>Traducao[e]).sort().join(" | ");
    let cardStructure = `
    <div class="card card-${obj.types[0]}">
        <div class="card-effects"></div>
        <img class="card-img" src="${obj.pixel}">
        <p class="card-name">${obj.name}</p>
        <p class="type-poke">${types}</p>
        <div class="btn btn-red-outlined" onclick="Render.Modal(${obj.id});modal.on()">Info</div>
        <div class="card-info">
            <p>#${obj.id}</p>
            <img onclick="Pokemon.ToggleFavorites(${obj.id}); this.classList.toggle('icon-active')" src="src/images/heart.svg"  class='icon ${icon_active}'>
        </div>
    </div>
    `
    div = document.createElement('div')
    div.innerHTML = cardStructure
    cards.appendChild(div)
    }
},

Category(category_name){
    Pokemon.InfoCategory(category_name).then(e=>{
    Pokemon.Actives = e
    Pokemon.Categories[category_name] = e
    this.Preload(Pokemon.Categories[category_name], 0)
    this.Clear()
    })
},

Search(str){
    this.Clear()
    this.Preload(Pokemon.Search(str),0)
},

Clear(){
    this.Cards.innerHTML = ''
},

Preload(array_str, pag){
    Pokemon.Page = pag
    p = array_str.slice(Pokemon.Page*Pokemon.Quantity, Pokemon.Page*Pokemon.Quantity+Pokemon.Quantity)
    this.Card.names(p)
},

Favorites(){
    this.Clear() 
    Pokemon.Actives = Pokemon.Favorites.map(d=>Pokemon.Lists.Pokemons.find(e=>e.id == d).name)
    Render.Preload(Pokemon.Actives, 0)
},

Modal(id){
Pokemon.info(id).then(e=>{
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
},

LoadEndScreen(){
    scroll_y = Math.ceil(window.scrollY)    // posicao y
    h_win = window.innerHeight              // tamanho horizontal 
    h_doc = document.body.scrollHeight      // tamanho do documento
    factor = 1000                           // fator 
    dif = h_doc - h_win - factor            // diferença
    
    if(scroll_y > dif && Pokemon.Roll)
        this.Preload(Pokemon.Actives, ++Pokemon.Page)

    document.body.onscroll = () => this.LoadEndScreen()
    }
}

Pokemon.init()







