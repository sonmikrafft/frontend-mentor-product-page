const btnHamburger = document.querySelector("#btnHamburger");
const body = document.querySelector("body");
const header = document.querySelector(".header");
const fadeElemsMobile = document.querySelectorAll(".mobile-fade");
const fadeElemsDesktop = document.querySelectorAll(".desktop-fade");

const previousBtns = document.querySelectorAll(".preview__previous, .lightbox__previous");
const nextBtns = document.querySelectorAll(".preview__next, .lightbox__next");
const closeBtn = document.getElementById("closeBtn");
const previewMobile = document.getElementById("previewMobile");
const previewBig = document.getElementById("previewBig");
const lightboxPreviewBig = document.getElementById("lightboxPreviewBig");
const thumbnailList = document.querySelectorAll('.thumbnail');

const quantityField = document.getElementById("quantity");
const decreaseBtn = document.getElementById("decreaseBtn");
const increaseBtn = document.getElementById("increaseBtn");
const addBtn = document.getElementById("addBtn");
const cartSymbol = document.querySelector(".header__quantity");
const cartBtn = document.getElementById("cartBtn");
const cartElement = document.getElementById("cart");
const cartContent = document.querySelector(".cart__content");

let selectedImage = 0;
let quantity = 0;
let cart = [];

/*
* Helper Functions
* */
const setSelectedThumbnail = (oldNumber, newNumber) => {
    const oldThumbnail = thumbnailList[oldNumber];
    const newThumbnail = thumbnailList[newNumber];
    oldThumbnail.classList.remove("thumbnail__selected");
    newThumbnail.classList.add("thumbnail__selected");
}

const setSelectedImage = (number) => {
    const innerHTML = `
    <img src="images/image-product-${number + 1}.jpg" alt="Product Image ${number + 1}">
    `
    previewMobile.innerHTML = innerHTML;
    previewBig.innerHTML = innerHTML;
    lightboxPreviewBig.innerHTML = innerHTML;
    setSelectedThumbnail(selectedImage, number);
    setSelectedThumbnail(selectedImage + 4, number + 4);
    selectedImage = number;
}

const updateQuantity = (value) => {
    quantity = Math.max(value, 0);
    quantityField.value = quantity;
}

const updateCartContent = () => {
    if (cart.length === 0) {
        handleEmptyCart();
    } else {
        cartContent.classList.remove("cart__empty");
        cartContent.classList.add("cart__filled");
        cartContent.innerHTML = ``;

        const list = document.createElement("div");
        list.classList.add("cart__list");

        cart.forEach((item) => {
            const listItem = document.createElement("div");
            listItem.classList.add("cart__item");

            const sum = parseInt(item.price.replace("$", "")) * item.quantity;

            listItem.innerHTML = `
            <div class="cart__thumbnail">
                <img src="/images/image-product-1-thumbnail.jpg" alt="Thumbnail 1">
            </div>
            <div class="cart__details">
                <p>${item.title}</p>
                <p>${item.price} x ${item.quantity} <b>$${sum}</b></p>
            </div>
            `;

            const deleteBtn = document.createElement("div");
            deleteBtn.classList.add("cart__delete");
            deleteBtn.innerHTML = `<img src="/images/icon-delete.svg" alt="Delete Icon">`;
            listItem.appendChild(deleteBtn);

            deleteBtn.addEventListener("click", () => {
                cart = cart.filter(x => x.title !== item.title);
                list.removeChild(listItem);
                updateCartSymbol();

                if (cart.length === 0) {
                    handleEmptyCart();
                }
            })
            list.appendChild(listItem);
        });

        const checkoutBtn = document.createElement("button");
        checkoutBtn.innerText = "Checkout";
        console.log(cart);

        cartContent.appendChild(list);
        cartContent.appendChild(checkoutBtn);

    }
}

const handleEmptyCart = () => {
    cartContent.classList.remove("cart__filled");
    cartContent.classList.add("cart__empty");
    cartContent.innerHTML = `<b>Your cart is empty.</b>`;
}

const updateCartSymbol = () => {
    const numProducts = cart.reduce((acc, cur) => acc + cur.quantity, 0);
    cartSymbol.innerText = `${numProducts}`;

    if (numProducts > 0) {
        cartSymbol.style.visibility = "visible";
    } else {
        cartSymbol.style.visibility = "hidden";
    }
}

/*
* Initialize
 */
setSelectedImage(selectedImage);
/*
* Event Listeners
* */
btnHamburger.addEventListener("click", function () {
    if (header.classList.contains("open")) {
        body.classList.remove("noscroll");
        header.classList.remove("open");
        fadeElemsMobile.forEach(function (elem) {
            elem.classList.add("fade-out");
            elem.classList.remove("fade-in");
        });
    } else {
        body.classList.add("noscroll");
        header.classList.add("open");
        fadeElemsMobile.forEach(function (elem) {
            elem.classList.add("fade-in");
            elem.classList.remove("fade-out");
        });
    }
});


/*
Preview
 */
previewBig.addEventListener("click", function () {
    body.classList.add("noscroll");
    fadeElemsDesktop.forEach(function (elem) {
        elem.classList.add("fade-in");
        elem.classList.remove("fade-out");
    });
});

closeBtn.addEventListener("click", function () {
    body.classList.remove("noscroll");
    header.classList.remove("open");
    fadeElemsDesktop.forEach(function (elem) {
        elem.classList.add("fade-out");
        elem.classList.remove("fade-in");
    });
});

previousBtns.forEach((item) => {
    item.addEventListener("click", function () {
        const previousImage = (selectedImage + 3) % 4;
        setSelectedImage(previousImage);
        selectedImage = previousImage;
    });
});

nextBtns.forEach((item) => {
    item.addEventListener("click", function () {
        const nextImage = (selectedImage + 1) % 4;
        setSelectedImage(nextImage);
        selectedImage = nextImage;
    });
});

thumbnailList.forEach((item, number) => {
    item.addEventListener("click", () => setSelectedImage(number % 4));
});

/*
Form
 */
quantityField.addEventListener("input", (e) => {
    e.preventDefault();
    updateQuantity(e.target.value);
})

decreaseBtn.addEventListener("click", function () {
    updateQuantity(quantity - 1);
});

increaseBtn.addEventListener("click", function () {
    updateQuantity(parseInt(quantity) + 1);
});

addBtn.addEventListener("click", function () {
    const title = document.querySelector(".details__title").innerText;
    let item = cart.find(product => product.title === title);

    if (item) {
        item.quantity += quantity;
    } else {
        const price = document.querySelector(".price__new").innerText;
        cart.push({title: title, price: price, quantity: quantity});
    }

    quantity = 0
    updateQuantity(quantity);
    updateCartContent();
    updateCartSymbol();

    console.log(cart);
});

/*
Show/ Hide Cart Card
 */
cartBtn.addEventListener("click", function () {
    updateCartContent();
    if (cartElement.classList.contains("hidden")) {
        cartElement.classList.remove("hidden");
        cartElement.classList.add("fade-in");
        cartElement.classList.remove("fade-out");
    } else {
        cartElement.classList.add("hidden");
        cartElement.classList.add("fade-out");
        cartElement.classList.remove("fade-in");
    }
});

/*
Reset Width-dependent Elements
 */
window.addEventListener('resize', function() {
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    header.classList.remove("open");
    fadeElemsMobile.forEach(function (elem) {
        elem.classList.add("fade-out");
        elem.classList.remove("fade-in");
    });
});


