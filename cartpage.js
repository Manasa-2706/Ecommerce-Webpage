

document.addEventListener("DOMContentLoaded", () => {
    const productContainer = document.getElementById("productContainer");

    function loadCart() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        productContainer.innerHTML = '';

        if (cart.length === 0) {
            productContainer.innerHTML = `
                <div class="empty-cart">
                    <h2>Your Cart is Empty.</h2>
                    <br>
                    <a href="./productpage.html" class="shop-now-btn">←  Continue Shopping</a>
                </div>
            `;
            return;
        }

        productContainer.insertAdjacentHTML(
            "beforeend",
            `<div class="product-cart-heading">Item List</div>`
        );

        productContainer.innerHTML += cart
            .map(
                (item) => `
                <div class="cart-item">
                    <img src="${item.image}" alt="${item.name}" />
                    <div class="item-description">
                        <h5>${(item.name).slice(0, 100)}</h5>
                    </div>    
                    <div class="quantity-control">
                        <div class="quantity-control-price-bar">
                            <button class="decrement" data-id="${item.id}">-</button>
                            <span>${item.quantity}</span>
                            <button class="increment" data-id="${item.id}">+</button>
                        </div>
                        <p class="quantity-price">${item.quantity} <strong> * $${(item.price * item.quantity).toFixed(2)}</strong></p>
                    </div> 
                </div>
            `
            )
            .join("");

        updateOrderSummary(cart);

        document.querySelectorAll(".increment").forEach((button) => {
            button.addEventListener("click", (e) => updateQuantity(e, 1));
        });
        document.querySelectorAll(".decrement").forEach((button) => {
            button.addEventListener("click", (e) => updateQuantity(e, -1));
        });
    }

    function updateOrderSummary(cart) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const summary = `
            <div class="order-summary">
                <h2>Order Summary</h2>
                <hr>
                    <div class="order-values">
                        <p>Procduts(${totalItems}) <span class="product-price">$${totalAmount.toFixed(2)}</span></p>
                        <p class="shipping-value">Shipping <span class="shipping-price">$30.00</span></p>
                        <p><strong>Total Amount <span class="total-price">$${(totalAmount + 30).toFixed(2)}</span></strong></p>
                    </div>    
                <button class="checkout">Go to Checkout</button>
            </div>
        `;
        productContainer.insertAdjacentHTML("beforeend", summary);
    }

    function updateQuantity(event, change) {
        const button = event.target;
        const productId = button.getAttribute("data-id");

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const product = cart.find((item) => item.id === productId);

        if (product) {
            product.quantity += change;
            if (product.quantity <= 0) {
                cart = cart.filter((item) => item.id !== productId);
            }
            localStorage.setItem("cart", JSON.stringify(cart));
            loadCart();
        }
    }

    
    loadCart(); // Call the function after all DOM is loaded
});
