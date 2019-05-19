Stripe.setPublishableKey(`pk_test_rf5GmNV5bTN6gg1X680nRyju005B6bdbO2`);

const checkoutForm = document.querySelector(`#checkout-form`),
    checkoutButton = checkoutForm.querySelector(`button`);

checkoutForm.addEventListener(`submit`, (e) => {
    e.preventDefault();
    
    // Disabling submit button to prevent multiple submissions
    checkoutButton.setAttribute(`disabled`, true);
    checkoutButton.textContent = `Processing...`;

    Stripe.card.createToken({
        number: checkoutForm.querySelector(`#card-number`).value,
        cvc: checkoutForm.querySelector(`#card-cvc`).value,
        exp_month: checkoutForm.querySelector(`#card-expiry-month`).value,
        exp_year: checkoutForm.querySelector(`#card-expiry-year`).value,
        name: checkoutForm.querySelector(`#card-name`).value
    }, stripeResponseHandler);
    return false;
});


function stripeResponseHandler(status, response){
    if(response.error){
        document.querySelector(`#charge-error`).textContent = response.error.message;
        document.querySelector(`#charge-error`).classList.remove(`hidden`);
        checkoutButton.removeAttribute(`disabled`);
        checkoutButton.textContent = `Buy Now`;
    }
    else{
        const token = response.id;
        let stripeInput = `<input type="hidden" name="stripeToken" value="${token}"></input>`;
        checkoutForm.insertAdjacentHTML(`beforeend`, stripeInput);

        checkoutForm.submit();
    }
}