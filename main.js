// Form Javascript
(function() {

    var CONSTANTS = {
        FORM: 'js-form',
        EMAIL_INPUT: 'js-email-validator',
        REQUIRED_CLASS: 'js-required',
        ERROR_FIELD: 'required-field',
        CAPTCHA_ERROR: 'js-captcha-error',
        SHOW_CLASS: 'show',
        HIDDEN_CLASS: 'hidden',
        CATCHA : 'g-recaptcha',
        SERVICE_URL: '/services/quote.php'
    };

    var NAMES = {
        fullName: 'fullName',
        findOutUs: 'findOutUs',
        email: 'email',
        contactNumber: 'contactNumber',
        moveDate: 'moveDate',
        alternateMoveDate: 'alternateMoveDate',
        originAddress: 'originAddress',
        destinationAddress: 'destinationAddress',
        additionalPickUp: 'additionalPickUp',
        additionalDropOff: 'additionalDropOff',
        adultsKidsToddler: 'adultsKidsToddler',
        kindOfResidence: 'kindOfResidence',
        originFootage: 'originFootage',
        kindOfResidenceInto: 'kindOfResidenceInto',
        destinationFootage: 'destinationFootage',
        stairsElevatorsOrigin: 'stairsElevatorsOrigin',
        stairsElevatorsDestination: 'stairsElevatorsDestination',
        miscItems: 'miscItems',
        deckStuff: 'deckStuff',
        packedPrior: 'packedPrior',
        packYourBreakables: 'packYourBreakables',
        cumbersomeItems: 'cumbersomeItems',
        anythingRelevant: 'anythingRelevant',
        AnyIssue: 'AnyIssue'
    };

    var formValidation = function() {

        var $formSelector,
            $emailSelector,
            $requiredSelector,
            $capchaError,
            $capcha;

        var checkForm = function(event) {
            event.preventDefault();
            var firstItem = true,
                anyError = false,
                captcha = checkCaptcha();

            _.each($requiredSelector, function($input) {
                if ($input.value != '') {
                    $input.classList.remove(CONSTANTS.ERROR_FIELD);
                }
                else {
                    $input.classList.add(CONSTANTS.ERROR_FIELD);

                    if (firstItem) {
                        $input.focus();
                        firstItem = false;
                    }

                    anyError = true;
                }
            });

            if (!emailValidate($emailSelector) && !anyError && captcha) {
                var params = {
                    fullName: $fullName.value,
                    findOutUs: $findOutUs.value,
                    email: $email.value,
                    contactNumber: $contactNumber.testValue,
                    moveDate: $moveDate.value,
                    alternateMoveDate: $alternateMoveDate.value,
                    originAddress: $originAddress.value,
                    destinationAddress: $destinationAddress.value,
                    additionalPickUp: $additionalPickUp.value,
                    additionalDropOff: $additionalDropOff.value,
                    adultsKidsToddler: $adultsKidsToddler.value,
                    kindOfResidence: $kindOfResidence.value,
                    originFootage: $originFootage.value,
                    kindOfResidenceInto: $kindOfResidenceInto.value,
                    destinationFootage: $destinationFootage.value,
                    stairsElevatorsOrigin: $stairsElevatorsOrigin.value,
                    stairsElevatorsDestination: $stairsElevatorsDestination.value,
                    miscItems: $miscItems.value,
                    deckStuff: $deckStuff.value,
                    packedPrior: $packedPrior.value,
                    packYourBreakables: $packYourBreakables.value,
                    cumbersomeItems: $cumbersomeItems.value,
                    anythingRelevant: $anythingRelevant.value,
                    AnyIssue: $AnyIssue.value
                };
                params = JSON.stringify(params);
                postData(CONSTANTS.SERVICE_URL, postSuccess, postFail, params, true);
            }
        };

        var postSuccess = function() {
            $formSelector.classList.add(CONSTANTS.HIDDEN_CLASS);
        };

        var postFail = function(data) {

        };

        var postData = function(url, successCallback, failCallback, dataString, json) {
            httpDataMethod(url, successCallback, failCallback, dataString, json, 'POST');
        };

        var httpDataMethod = function(url, successCallback, failCallback, dataString, json, httpMethod) {
            var jsonRequest = json || false;
            var request = new XMLHttpRequest();
            request.open(httpMethod, url, true);

            if (json) {
                request.setRequestHeader("Content-Type", "application/json");
            }

            request.onload = function onload() {
                var data = '';
                var error = {
                    status: 0,
                    message: ''
                };

                if (request.status >= 200 && request.status < 400) {
                    if (request.responseText) {
                        if (jsonRequest) {
                            data = JSON.parse(request.responseText);
                        } else {
                            data = request.responseText;
                        }
                        successCallback(data);
                    }
                    else {
                        successCallback();
                    }
                } else {

                    // We reached our target server, but it returned an error
                    error.status = request.status;
                    error.message = request.response;
                    failCallback(error);
                }
            };

            request.onerror = function() {
                var error = {
                    status: 0,
                    message: ''
                };
                error.status = request.status;
                error.message = request.response;
                failCallback(error);
            };

            request.send(dataString);
        };

        var emailValidate = function($input) {
            var value = $input.value,
                testValue = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);

            if (testValue) {
                $input.classList.remove(CONSTANTS.ERROR_FIELD);
                return false;
            }
            else {
                $input.classList.add(CONSTANTS.ERROR_FIELD);
                return true;
            }
        };

        var checkCaptcha = function() {
            var googleCaptchaResponse = grecaptcha.getResponse() ? true : false;

            if (googleCaptchaResponse) {
                $capchaError.classList.remove(CONSTANTS.SHOW_CLASS);
            }
            else {
                $capchaError.classList.add(CONSTANTS.SHOW_CLASS);
            }

            return googleCaptchaResponse;
        };

        var cleanField = function(event) {
            var $target = event.target;

            if ($target.value != '') {
                $target.classList.remove(CONSTANTS.ERROR_FIELD);
            }
            else {
                $target.classList.add(CONSTANTS.ERROR_FIELD);
            }
        };

        var data = function() {
            $formSelector = document.getElementsByClassName(CONSTANTS.FORM)[0];
            $requiredSelector = $formSelector.getElementsByClassName(CONSTANTS.REQUIRED_CLASS);
            $emailSelector = $formSelector.getElementsByClassName(CONSTANTS.EMAIL_INPUT)[0];
            $capcha = $formSelector.getElementsByClassName(CONSTANTS.CATCHA)[0];
            $capchaError = $formSelector.getElementsByClassName(CONSTANTS.CAPTCHA_ERROR)[0];

            // NAMES
            $fullName = document.getElementsByName(NAMES.fullName)[0];
            $findOutUs = document.getElementsByName(NAMES.findOutUs)[0];
            $email = document.getElementsByName(NAMES.email)[0];
            $contactNumber = document.getElementsByName(NAMES.contactNumber)[0];
            $moveDate = document.getElementsByName(NAMES.moveDate)[0];
            $alternateMoveDate = document.getElementsByName(NAMES.alternateMoveDate)[0];
            $originAddress = document.getElementsByName(NAMES.originAddress)[0];
            $destinationAddress = document.getElementsByName(NAMES.destinationAddress)[0];
            $additionalPickUp = document.getElementsByName(NAMES.additionalPickUp)[0];
            $additionalDropOff = document.getElementsByName(NAMES.additionalDropOff)[0];
            $adultsKidsToddler = document.getElementsByName(NAMES.adultsKidsToddler)[0];
            $kindOfResidence = document.getElementsByName(NAMES.kindOfResidence)[0];
            $originFootage = document.getElementsByName(NAMES.originFootage)[0];
            $kindOfResidenceInto = document.getElementsByName(NAMES.kindOfResidenceInto)[0];
            $destinationFootage = document.getElementsByName(NAMES.destinationFootage)[0];
            $stairsElevatorsOrigin = document.getElementsByName(NAMES.stairsElevatorsOrigin)[0];
            $stairsElevatorsDestination = document.getElementsByName(NAMES.stairsElevatorsDestination)[0];
            $miscItems = document.getElementsByName(NAMES.miscItems)[0];
            $deckStuff = document.getElementsByName(NAMES.deckStuff)[0];
            $packedPrior = document.getElementsByName(NAMES.packedPrior)[0];
            $packYourBreakables = document.getElementsByName(NAMES.packYourBreakables)[0];
            $cumbersomeItems = document.getElementsByName(NAMES.cumbersomeItems)[0];
            $anythingRelevant = document.getElementsByName(NAMES.anythingRelevant)[0];
            $AnyIssue = document.getElementsByName(NAMES.AnyIssue)[0];
        };

        var event = function() {
            $formSelector.addEventListener('submit', checkForm);
            $emailSelector.addEventListener('change', function() {
                emailValidate($emailSelector);
            });

            _.each($requiredSelector, function($input) {
                $input.addEventListener('change', cleanField);
            });
        };

        var init = function() {
            data();
            event();
        };

        // Start Application
        init();
    }

    formValidation();
})();