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
    let maxItems = 5;
    let cart = JSON.parse(localStorage.getItem('cart'));
    let existsItem = false;
    for (let i=0 ; i<cart.products.length; i++){
        let newValue = parseInt(cart.products[i].amount) + parseInt($(`#count_${id}`).val());
        if(newValue > maxItems){
            newValue = maxItems;
        }

        if(id === cart.products[i].id){
            existsItem = true;
            cart.products[i].amount = newValue;
            break;
        }
    }

    if(!existsItem){
        cart.products.push({
            id: id
            , amount: parseInt($(`#count_${id}`).val())
            , price: parseInt($(`#price_${id}`).val())
            , name: $(`#name_${id}`).val()
            , description: $(`#description_${id}`).val()
            , image: $(`#image_${id}`).val()
        })
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    $('#overlay').addClass("overlay-success");
    $('#overlay').fadeIn().delay(2000).fadeOut();

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
                    <div class="col-xs-4">
                        ${cart.products[i].name }
                    </div>
                    <div class="col-xs-4 text-right">
                        <span class="badge">${cart.products[i].amount}</span>
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
            <div class="row">
                <div class="text-right">
                    <div class="totalPrice">
                        Subtotal: Lps. ${cart.subtotal}
                    </div>
                    <a href="/cart/" class="btn btn-success">Continuar</a>
                </div>
            </div>
        `);
    }
}