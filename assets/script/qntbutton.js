function qntButton(options) {
    var boxElements = document.querySelectorAll(options.boxSelectors);

    Array.from(boxElements).forEach(function(boxElement) {
        if (boxElement) {
            var qntElement = boxElement.querySelector(options.qnt);
            var reduceBtnElement = boxElement.querySelector(options.reduceBtn);
            var addBtnElement = boxElement.querySelector(options.addBtn);

            if (qntElement.innerText === '1') {
                reduceBtnElement.disabled = true;
            }

            addBtnElement.onclick = function() {
                qntElement.innerText = Number(qntElement.innerText) + 1;
                if (qntElement.innerText !== '1') {
                    reduceBtnElement.disabled = false;
                }
            }

            reduceBtnElement.onclick = function() {
                qntElement.innerText = Number(qntElement.innerText) - 1;
                if (qntElement.innerText === '1') {
                    reduceBtnElement.disabled = true;
                }
            }
        }
    });
}