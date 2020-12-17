
// Validor object
function Validator(options) {
    function getParent(element, selector) {
        while(element.parentElement) {
            var parentElement = element.parentElement;
            if (parentElement.matches(selector)) {
                return parentElement;
            }
            element = parentElement;
        }
    }

    function validate(inputElement, rule, errorElement) {
        var errorMessage;

        // Get all element's rules
        var rules = selectorRules[rule.selector];

        for(var i = 0; i < rules.length; i++) {
            switch(inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i] (
                        formElement.querySelector(rule.selector)
                    );
                    break;
                default:
                    errorMessage = rules[i](inputElement.value);
            }
            if (errorMessage) break;
        } 

        if (errorMessage) {
            errorElement.innerText = errorMessage;
            getParent(inputElement, options.formGroupSelector).classList.add('invalid');
        } else {
            removeErrorMessage(inputElement, errorElement);
        }

        return !errorMessage;
    }

    function removeErrorMessage(inputElement, errorElement) {
        errorElement.innerText = '';
        getParent(inputElement, options.formGroupSelector).classList.remove('invalid');
    }

    function submitForm(formElement) {
        var isFormValid = true;

        // Validate each input element in form
        options.rules.forEach(function(rule) {
            var inputElement = formElement.querySelector(rule.selector);
            var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
            var isValid = validate(inputElement, rule, errorElement);
            if(!isValid) {
                isFormValid = false;
            }
        });


        if (isFormValid) {
            // Submit with JS
            if (typeof options.onSubmit === 'function') {
                var enableInputs = formElement.querySelectorAll('[name]');
                var formValues = Array.from(enableInputs).reduce(function(values, input) {
                    switch(input.type) {
                        case 'radio':
                            if (input.matches(':checked'))
                                values[input.name] = input.value;
                            break;
                        case 'checkbox':
                            if (input.matches(':checked')) {
                                if (Array.isArray(values[input.name])) {
                                    values[input.name].push(input.value);
                                }

                                values[input.name] = [input.value];
                            } else {
                                values[input.name] = "";
                                return values;
                            }
                            break;
                        case 'file':
                            values[input.name] = input.files;
                            break;
                        default: 
                            values[input.name] = input.value.trim();
                    }
                    return values;
                }, {});

                options.onSubmit(formValues);
                alert("Your checkout was successfull");
            } 
            // Default submition
            else {
                formElement.submit();
            }
        }
    }

    // Get form Element
    var formElement = document.querySelector(options.form);
    var submitButton = formElement.querySelector(options.submitButtonSelector)
    var selectorRules = {};

    // Submit event
    if (formElement) {
        submitButton.onclick = function() {
            formElement.onsubmit = function(e) {
                e.preventDefault();
                submitForm(formElement);
            }
        }

        // Submit with Enter key
        document.addEventListener("keyup", function(event) {
            if (event.code === 'Enter') {
                formElement.onsubmit = function(e) {
                    e.preventDefault();
                    submitForm(formElement);
                }
            }
            
          });
    
        // Validate each input element in form
        options.rules.forEach(function(rule) {

            // Save rule for each input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test]; 
            }

            var inputElements = formElement.querySelectorAll(rule.selector);

            Array.from(inputElements).forEach(function(inputElement) {
                var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector);
                if (inputElement) {
                    // In case user blur out of input field
                    inputElement.onblur = function() {
                        validate(inputElement, rule, errorElement);
                    }

                    // In case user input the field => delete the error message
                    inputElement.oninput = function() {
                        removeErrorMessage(inputElement, errorElement);
                    }
                }
            });
        });
    }

}


// Rules defination:
// 1. Got an error => Display the error message
// 2. Right => Do nothing 
Validator.isRequire = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value ? undefined : message || 'Please input this field';
        }
    }
}

Validator.isEmail = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return regex.test(value) ? undefined : message || 'Trường này phải là Email'
        }
    }
}

Validator.numberOnly = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            return !isNaN(value) ? undefined : 'The input only allows Numbers'
        }
    }
}

Validator.minLength = function(selector, min) {
    return {
        selector: selector,
        test: function(value) {
            return value.length > min ? undefined : `Please input at least ${min} characters`;
        }
    }
}

Validator.maxLength = function(selector, max) {
    return {
        selector: selector,
        test: function(value) {
            return value.length <= max ? undefined : `Please input maximum ${max} characters`;
        }
    }
}

Validator.lengthBetween = function(selector, min, max) {
    return {
        selector: selector,
        test: function(value) {
            return (value.length >= min && value.length <= max) ? undefined : `Please input length must be from ${min} to ${max} characters`;
        }
    }
}

Validator.percificLength = function(selector, length) {
    return {
        selector: selector,
        test: function(value) {
            return value.length === length ? undefined : `The input must have ${length} characters`;
        }
    }
}

