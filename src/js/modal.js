modal = div_modal
modalin = modal.querySelector('.modal-in')

modal.on = function(){
    this.classList.add('modal-on')
    this.classList.remove('modal-off')
}

modal.off = function(){
    this.classList.add('modal-off')
    this.classList.remove('modal-on')
}

modal.onclick=function(){
    this.off()
}

modalin.onclick=function(e){
    e.stopPropagation()
}