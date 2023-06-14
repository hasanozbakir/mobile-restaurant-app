import { menuArray } from "./data.js"

let orderedItemsArray = []
const menuItems = document.getElementById("menu-items")
const orderDetails = document.getElementById("order-details")
const paymentContainer = document.getElementById("payment-container")
const payForm = document.getElementById("pay-form")
const nameInputEl = document.getElementById("name")
const cardNumberInputEl = document.getElementById("card-number")
const cvvInputEl = document.getElementById("cvv")
const confirmationText = document.getElementById("confirmation-text")

document.addEventListener("click", function(e) {
    let itemId 
    // Check if the filter list parent element exist
    const isClosest = e.target.closest("#payment-container");

    if(e.target.dataset.add) {
        itemId = Number(e.target.dataset.add)
        let currentItem = menuArray.filter(item => item.id === itemId)[0]
        
        if(!orderedItemsArray.some(item => item.id === itemId)){
            currentItem = {...currentItem, "amount":1}
            orderedItemsArray.push(currentItem)
        } else {
            orderedItemsArray.map(item => {
                if(item.id === itemId){
                    item.amount++
                }
            })
        }
        render()
    } else if(e.target.dataset.minus) {
        itemId = Number(e.target.dataset.minus)
        orderedItemsArray.map(item => {
            if(item.id === itemId){
                item.amount--
            }
        })
        render()
    } else if(e.target.dataset.plus) {
        itemId = Number(e.target.dataset.plus)
        orderedItemsArray.map(item => {
            if(item.id === itemId){
                item.amount++
            }
        })
        render()
    } else if(e.target.dataset.remove) {
        itemId = Number(e.target.dataset.remove)
        orderedItemsArray = orderedItemsArray.filter(item => item.id !== itemId)
        render()
    } else if(e.target.id === "order-btn") {
        paymentContainer.classList.remove("hidden")
    } else if (!isClosest && !paymentContainer.classList.contains("hidden")) {
        paymentContainer.classList.add("hidden");
        nameInputEl.value = ""
        cardNumberInputEl.value = ""
        cvvInputEl.value = ""

      }
})

payForm.addEventListener("submit", function(e) {
    e.preventDefault()
    let payFormData = new FormData( payForm )
    const name = payFormData.get("name").split(" ")[0]
    const firstName = name[0].toUpperCase() + name.slice(1)
    orderedItemsArray = []
    nameInputEl.value = ""
    cardNumberInputEl.value = ""
    cvvInputEl.value = ""

    paymentContainer.classList.add("hidden")
    render()
    confirmationText.innerHTML = `
        <div class="confirmation-text-container">
            <p class="confirmation-text">Thanks, ${name}!Your order is on the way!</p>
        </div>`

    
})

render() 

function render() {
    renderMenuItems()
    renderOrderedItems()
    confirmationText.innerHTML = ""
}

function renderMenuItems() {
    menuItems.innerHTML = getMenuItemsHtml()
}

function renderOrderedItems() {
    if(orderedItemsArray.length > 0) {
        orderDetails.innerHTML = getOrderedDetailsHtml()
    }else{
        orderDetails.innerHTML = ""
    }
}

function getMenuItemsHtml() {
    let menuItemsHtml = ""

    menuArray.forEach( item => {
        const { name, ingredients, id, price, emoji } = item

        const ingredientsText = ingredients.join(", ")

        menuItemsHtml += `
            <div class="item-container">
                <p class="item-emoji">${emoji}</p>
                <div class="item-info">
                    <h2>${name}</h2>
                    <p class="ingredients-text">${ingredientsText}</p>
                    <h3>$${price}</h3>
                </div>
                <div class="plus-container">
                    <p class="plus-text" data-add="${id}">+</p>
                </div>
            </div>`
    })

    return menuItemsHtml
}

function getOrderedDetailsHtml() {
    const orderedItemsHtml = getOrderedItemsHtml()
    const totalPriceDetailsHtml = getTotalPriceDetailsHtml()

    return ` <div class="order-details-container">
                <h2 class="order-header">Your order</h2>
                ${orderedItemsHtml}
                ${totalPriceDetailsHtml}
                <button id="order-btn" class="order-btn">Complete order</button>
            </div>` 
}

function getOrderedItemsHtml(){
    let orderedItemsHtml = ""

    orderedItemsArray.forEach(item => {
        const { name, price, id, amount } = item

        orderedItemsHtml += `
            <div class="ordered-item-details">
                <h2>${name}</h2>
                <p class="order-remove-text" data-remove="${id}">remove</p>
                ${amount > 1 ? `<h2>${amount}</h2><span class="change-amount"><i class="fa fa-circle-arrow-up" data-plus="${id}"></i><i class="fa fa-circle-arrow-down" data-minus="${id}"></i></span>`: ""}
                <h3 class="price-value">$${amount*price}</h3>
            </div>`
    })

    return orderedItemsHtml
}

function getTotalPriceDetailsHtml() {
    const totalPrice = orderedItemsArray.reduce((total, currentItem) => total + currentItem.amount*currentItem.price,0)

    return `<div class="ordered-item-details total-price-container">
                <h2>Total price:</h2>
                <h3 class="price-value">$${totalPrice}</h3>
            </div>`
}


