function calculateBill(options) {
    function getPriceValue(element) {
        return Number(element.innerText.slice(1));
    }

    // Get bill Element
    var billElement = document.querySelector(options.billSelector);
    var productElements = billElement.querySelectorAll(options.productSelectors);
    var totalElement = document.querySelector(options.totalPriceSelector)
    var totalPrice = getPriceValue(totalElement);
    
    Array.from(productElements).forEach(function(productElement) {
        if (productElement) {
            var productPriceElement = productElement.querySelector(options.productPriceSelector);
            var reduceButtonElement = productElement.querySelector(options.reduceBtn);
            var addButtonElement = productElement.querySelector(options.addBtn);

            addButtonElement.addEventListener('click', function() {
                totalPrice += getPriceValue(productPriceElement);
                totalElement.innerText = `$${totalPrice.toFixed(2)}`;
            });

            reduceButtonElement.addEventListener('click', function() {
                totalPrice -= getPriceValue(productPriceElement);
                totalElement.innerText = `$${totalPrice.toFixed(2)}`;
            });
        }
    });
}