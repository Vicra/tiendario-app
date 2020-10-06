$( document ).ready(function() {
    let cart = JSON.parse(localStorage.getItem('cart'));
    if(cart == null){
        resetCart();
    }
});

function resetCart(){
    let cartJson = {
        products :  [],
        subtotal: 0,
        delivery: 80,
        total: 0
    }

    localStorage.setItem('cart', JSON.stringify(cartJson));
}

function add(id) {
    const maxItems = 10;
    let cart = JSON.parse(localStorage.getItem('cart'));
    let existsItem = false;

    let wasAdded = false;
    for (let i=0 ; i<cart.products.length; i++){
        if(id === cart.products[i].id){
            let newValue = parseInt(cart.products[i].amount) + parseInt($(`#count_${id}`).val());
            if(newValue > maxItems){
                newValue = maxItems;
            }
            else{
                wasAdded = true;
            }
            existsItem = true;
            cart.products[i].amount = newValue;
            break;
        }
    }

    if(!existsItem){
        let imageUrl = $(`#image_${id}`).val();
        if(!imageUrl.includes('http') 
            && !imageUrl.includes('https')){
            
            imageUrl = "https://riopiedras.store/" + imageUrl;
        }
        cart.products.push({
            id: id
            , amount: parseInt($(`#count_${id}`).val())
            , price: parseInt($(`#price_${id}`).val())
            , name: $(`#name_${id}`).val()
            , description: $(`#description_${id}`).val()
            , image: imageUrl
        });
        wasAdded = true;
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    if(wasAdded) {
        $('#overlay').addClass("overlay-success");
        let amount = parseInt($(`#count_${id}`).val());
        let name = $(`#name_${id}`).val();
        let message = `Agregaste <strong>${amount}</strong> unidad(es) de <em>${name}</em> al carrito.`
        $('#overlay').html(message);
        $('#overlay').fadeIn().delay(2500).fadeOut();
    }
    else{
        $('#overlay-fail').addClass("overlay-alert");
        let name = $(`#name_${id}`).val();
        let message = `Solamente puedes agregar ${maxItems} unidades de <em>${name}</em> al carrito.`
        $('#overlay-fail').html(message);
        $('#overlay-fail').fadeIn().delay(2500).fadeOut();
    }

    updateTopCart();
}

function updateTopCart(){
    let cart = JSON.parse(localStorage.getItem('cart'));
    if(cart.products.length > 0)
    {
        $('#cart').text('');
        cart.subtotal = 0;
        cart.totalItems = 0;
        
        for(let i=0; i<cart.products.length; i++){
            $('#cart').append(`
                <div class="row">
                    <div class="col-xs-6">
                        ${cart.products[i].name }
                    </div>
                    <div class="col-xs-2 text-right">
                        <span class="badge" style="background-color:lightgrey;">${cart.products[i].amount}</span>
                    </div>
                    <div class="col-xs-4 text-right">
                        Lps. ${cart.products[i].price}
                    </div>
                </div>
            `);
            cart.subtotal += cart.products[i].price * cart.products[i].amount;
            cart.totalItems += cart.products[i].amount;
        }
        cart.delivery = 80;
        cart.total = cart.subtotal + cart.delivery;

        localStorage.setItem('cart', JSON.stringify(cart));
        
        $('#totalItems').text('('+ cart.totalItems + ')');
        $('#cart').append(`
            <div class="row subtotal">
                <div class="text-right">
                    <div class="totalPrice">
                        Subtotal: Lps. ${cart.subtotal}
                    </div>
                    <a href="/cart/" class="btn btn-success">Continuar</a>
                </div>
            </div>
        `);
    }
    else{
        $('#cart').text('');
        $('#totalItems').text('(0)');
        $('#cart').append(`<em>No hay productos aun</em>`);
    }
}