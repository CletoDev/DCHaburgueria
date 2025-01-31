const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

let cart = [];

//Abrir o Modal do carrinho
cartBtn.addEventListener("click", function(){
    updateCartModal()
    cartModal.style.display = "flex"
    
})

// Fechar o modal quadno clicar fora
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})


menu.addEventListener("click", function(event){


    let parentButton = event.target.closest(".add-to-cart-btn")

    if(parentButton){
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name,price)

        //Adiconar o Carrinho
    }
})

//Funcao para adicionar o carrinho
function addToCart(name, price){
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        existingItem.quantity += 1;
        
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })

    }

    
    updateCartModal()

}

//Atualizar carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
            <p class="font-medium">${item.name}</p>
            <p>Qtd: ${item.quantity}</p>
            <p class="font-medium mt-2">${item.price.toFixed(2)}</p>
            </div>

            
                <button class="remove-from-cart-btn" data-name="${item.name}">
                    Remover
                </button>

        
        </div>
         ` 
         total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)

    })

    cartTotal.textContent = total.toLocaleString("pt-Br", {
        style:"currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

//Funcao para remover item do carrinho
cartItemsContainer.addEventListener("click", function (event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}


addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue!== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

//Finalizar Pedido
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();
    if(!isOpen){
        Toastify({
            text: "Ops o restaurante está fechado!",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast();

        return;
    }
    
    if(cart.length === 0) return;
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }


    //Enviar pedido para api whatsap
    // Monta os itens do carrinho dinamicamente
const cartItems = cart.map((item) => {
    return `🍔 *${item.name}*\n📦 Quantidade: _${item.quantity}_\n💰 Preço: *R$${item.price.toFixed(2)}*`;
}).join("\n\n-----------------\n\n");

// Calcula o total
const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

// Captura o endereço
const address = addressInput.value.trim();

// Monta a mensagem completa
const message = `📦 *Pedido Realizado!*\n\n${cartItems}\n\n-----------------\n\n💵 *Total: R$${total.toFixed(2)}*\n📍 *Endereço de entrega:* ${address}\n\n🛵 Obrigado por comprar conosco!`;

// Codifica a mensagem
const encodedMessage = encodeURIComponent(message);

// Número de telefone para enviar a mensagem
const phone = "86998398162";  // Substitua pelo número correto

// Abre o WhatsApp com a mensagem codificada
window.open(`https://api.whatsapp.com/send/?phone=${phone}&text=${encodedMessage}`, "_blank");

    cart =[];
    updateCartModal();

    
})

//VErificar a hora e manipular o cardapio
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 6 && hora < 23;
    //true restaurante esta aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
}else{
    spanItem.classList.remove("bg-green-600");
    spanItem.classList.add("bg-red-500");
}