// shim.js
//
// Rob Levin
// Fri Jun 24 21:33:13 PDT 2011
var shim = (function() {
  
    function buildRequiredError(arrRequiresOneOf) {
        var requiresOneOfMessage = '';
        var len = arrRequiresOneOf.length;
        for (var i = 0; i < len; i += 1) {
            if(i<len-1) {
                requiresOneOfMessage += arrRequiresOneOf[i] +" or ";
            } else {
                requiresOneOfMessage += arrRequiresOneOf[i];
            }
        };
        requiresOneOfMessage += " required.";
        return requiresOneOfMessage;
    };

    function boilerPlate(o, arrRequiresOneOf) {
        var requiresOneOfMessage = buildRequiredError(arrRequiresOneOf);
        if(!proceedOrThrow({'required':arrRequiresOneOf,
                            'arg':o,
                            'errorMessage':requiresOneOfMessage})) {
            return null;
        }
    };

    function doLink (o, arrRequiresOneOf) {
        boilerPlate(o, arrRequiresOneOf);

        if(o.hasOwnProperty('id')) {
            return document.getElementById(o.id);
        } else if(o.hasOwnProperty('name')) {
            return findLink('name', o.name);
        } else if(o.hasOwnProperty('url') || 
                  o.hasOwnProperty('href'))
        {
            var href = (o.hasOwnProperty('url')) ? o.url : o.href;
            return findLink('href', href);
        } else {} // NOP
    };

    function findLink(key, val) {
        var a = document.getElementsByTagName('a');
        for (var i= 0; i < a.length; ++i){
            switch(key) {
                case 'name':
                    if(typeof a[i].name !== 'undefined' &&
                       a[i].name === val) { 
                        return a[i];
                    }
                    break;
                case 'href':
                    // indexOf helps if href has extra '/' like foo.com/. 
                    // Basically this is a contains check ;)
                    if(typeof a[i].href!== 'undefined' &&
                       a[i].href.indexOf(val) != -1) {
                        return a[i];
                    }
                    break;
                default:
                    console.log("NOT YET IMPLEMENTED DEFAULT case....");
            }
        }
    };

    function doSelect (o, arrRequiresOneOf) {
        boilerPlate(o, arrRequiresOneOf);
        if(o.hasOwnProperty('id')) {
            return document.getElementById(o.id);
        } else if(o.hasOwnProperty('name')) {
            return findElementByName('select', o.name);
            //return findSelectByName(o.name);
        } else {} // NOP
    };

    function doTextarea(o, arrRequiresOneOf) {
        boilerPlate(o, arrRequiresOneOf);
        if(o.hasOwnProperty('id')) {
            return document.getElementById(o.id);
        } else if(o.hasOwnProperty('name')) {
            return findElementByName('textarea', o.name);
        } else {} // NOP
    };

    function findElementByName(tagName, elementName) {
        var matchingTagElements = document.getElementsByTagName(tagName);
        var len = matchingTagElements.length;
        for (var i = 0; i < len; i++) {
            if(typeof matchingTagElements[i].name !== 'undefined' && 
               matchingTagElements[i].name === elementName) {
                return matchingTagElements[i];
            }
        }
        return null;
    };

    function doInputs (o, type, arrRequiresOneOf) {
        boilerPlate(o, arrRequiresOneOf);
        if(o.hasOwnProperty('id')) {
            return document.getElementById(o.id);
        } else if(o.hasOwnProperty('name')) {
            return findInput(type, 'name', o.name);
        } else if(o.hasOwnProperty('value')) {
            return findInput(type, 'value', o.value);
        } else {} // NOP
    };

    function findInput(type, key, val) {

        var inputs = document.getElementsByTagName('input');
        var len = inputs.length;

        for (var i = 0; i < len; i++) {

            if( inputs[i].type == type ) {

                switch(key) {
                    case 'name':
                        if(typeof inputs[i].name !== 'undefined' &&
                           inputs[i].name === val) { 
                            return inputs[i];
                        }
                        break;
    
                    case 'value':
                        if(typeof inputs[i].value !== 'undefined' &&
                           inputs[i].value === val) { 
                            return inputs[i];
                        }
                        break;
     
                    default:
                        console.log("NOT YET IMPLEMENTED DEFAULT case....");
                }
            }
        }
        return null;
    };
        
    function ShimInputError(message) {
        this.prototype = Error.prototype;
        this.name = "ShimInputError";
        this.message = (message) ? message : "Bad input";
    };
 
    function proceedOrThrow(spec){
        for(var i=0; i<spec.required.length; i++) {
            if(spec.arg.hasOwnProperty(spec.required[i])) {
                return true;
            }
        }
        var msg = "Invalid Input";
        msg +=  (spec.errorMessage) ? ": "+spec.errorMessage : ". ";
        throw new ShimInputError(msg);
    };

    function prepareWhich(event) { 
		// Shamelessly lifted from jquery ;)
		if ( !event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode) ) {
			event.which = event.charCode || event.keyCode;
		}
        return event;
    };

    function triggerEvent(element, eventName, kcode) {

        function injectKeycode(evt) {
            if (evt.keyCode) { 
                evt.keyCode = kcode; 
            } else {
                evt.charCode = kcode;
            }
            return prepareWhich(evt);
        }
        if(document.createEvent) {
            var evt = document.createEvent('HTMLEvents');
            evt = injectKeycode(evt);
            evt.initEvent(eventName, true, true);
            return element.dispatchEvent(evt);
        } 
        if (element.fireEvent) {
            var evt = document.createEventObject();
            evt = injectKeycode(evt);
            return !element.fireEvent('on' + eventName, evt);
        }
    };

    function injectClear(type, el) {
        switch(type) {
            case 'text':
                el.clear = function() {
                    this.value = '';
                }
                break;
            case 'checkbox':
            case 'radio':
                el.clear = function() {
                    this.checked = false;
                }
                break;
            case 'select':
                el.clear = function() {
                    for (var i = 0; i < this.options.length; i += 1) {
                        this.options[i].selected=false;
                    }
                }
                break;
            default:
                break;
        }
    };

    function injectSet(type, el) {
        switch(type) {
            case 'text':
                el.set = function(txt) {
                    this.value = txt;
                }
                break;
            case 'checkbox':
            case 'radio':
                el.set = function(bool) {
                    this.checked = bool;
                }
                break;
            case 'select':
                el.set = function(o) {
                    for (var i = 0; i < this.options.length; i += 1) {
                        if(this.options[i].value===o.value) {
                            this.options[i].selected=true;
                        }
                    };
                }
                break;
            default:
                break;
        }
    };

    function injectClick(el) {
        el.click = function() {
            triggerEvent(this, 'click');
        }
    };

    function injectKeydown(el) {
        el.keydown = function(kcode) {
            triggerEvent(this, 'keydown', kcode);
        }
    };

    // Injects custom event handlers like click, set, etc.
    function injectHandlers(type, el) {
        switch(type) {
            case 'text':
            case 'checkbox':
            case 'select':
                injectSet(type, el);
                injectClear(type, el);
                break;
            case 'radio':
                injectSet(type, el);
                break;
            default:
                break;
        }
        // All elements get these:
        injectKeydown(el);
        injectClick(el);
        return el;
    };

    // Credit: Dive into html5 http://diveintohtml5.org/detect.html
    function isLocalStorage() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch(e){
            return false;
        }
    }

    return {
        element: function(o) {
            try {
                proceedOrThrow({'required':["id"], 'arg':o,
                                'errorMessage':'id property required'});
                return injectHandlers('element', document.getElementById(o.id));
            } catch(e){
                throw e; 
            }
        },
        textfield: function(o) {
            // First try to find text input; if none, try textarea
            var match = doInputs(o, 'text', ["id", "name"]);
            if(!match) {
                match = doTextarea(o, ["id", "name"]);
            }
            return (match) ? injectHandlers('text', match) : match;
        },
        checkbox: function(o) {
            return injectHandlers('checkbox', 
                            doInputs(o, 'checkbox', ["id", "name", "value"]));
        },
        radio: function(o) {
            return injectHandlers('radio', 
                            doInputs(o, 'radio', ["id", "name", "value"]));
        },
        selectList: function(o) {
            return injectHandlers('select', 
                            doSelect(o, ["id", "name"]));
        },
        button: function(o) {
            return injectHandlers('button', 
                            doInputs(o, 'button', ["id", "name", "value"]));
        },
        submit: function(o) {
            return injectHandlers('submit', 
                            doInputs(o, 'submit', ["id", "name", "value"]));
        },
        link: function(o) {
            return injectHandlers('link', 
                            doLink(o, ["id", "name", "url", "href"]));
        },
        setLocalStorage: function(k,v) {
            if(isLocalStorage) window.localStorage.setItem(k,v);
        },
        getLocalStorage: function(k) {
            if(isLocalStorage) { return window.localStorage.getItem(k); }
            return null;
        },
        clearLocalStorage: function() {
            if(isLocalStorage) window.localStorage.clear();
        },
        ShimInputError: function(message) { return new ShimInputError(message); }
    }
})();

