// shim.js
//
// Rob Levin
// With credits for used works given inline.
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


    // findTextOnPage - Returns a boolean indicating if the search
    // string supplied was found on page. Not comprehensive; if text
    // is already selected, it searches from there. Leverages the
    // windows.find function available FF, Chrome, Safari; or findText
    // for IE.
    //
    // stringToFind - search text
    // caseSensitive - true means it IS case sensitive
    // wholeWords - Might not work. MDC says 'Unimplemented'
    //
    // References: 
    // http://www.javascripter.net/faq/searchin.htm
    // http://help.dottoro.com/ljstxqnd.php
    // https://developer.mozilla.org/en/DOM/window.find
    function findTextOnPage (stringToFind, caseSensitive, wholeWords) {
        var stringFound = false;
    
        // default to being case sensitive and matching partial words
        if(typeof caseSensitive === 'undefined') {
            caseSensitive = true;
        }
        if(typeof wholeWords === 'undefined') {
            wholeWords = false;
        }
    
        // Firefox, Google Chrome, Safari
        if (window.find) {        
            stringFound =
                window.find(stringToFind, 
                            caseSensitive, 
                            true,           // backwards
                            true,           // wrap around. turns out
                                            // to be important in my tests
                                            // when same term 2+ times
                            wholeWords,     // NOT IMPLEMENTED in MDC!
                            true,           // search in frames
                            false);         // show dialog

            //console.log(window.getSelection().getRangeAt(0).cloneContents().textContent);
            window.getSelection().removeAllRanges();
        }
    
        // Internet Explorer, Opera before version 10.5
        else if (document.selection && document.selection.createRange) { 
            var textRange = document.selection.createRange ();
    
            // http://msdn.microsoft.com/en-us/library/ms536422(VS.85).aspx
            if (textRange.findText) {
                textRange.collapse (true);
    
                if(caseSensitive && wholeWords) {
                    // Case sensitive and whole words
                    stringFound = textRange.findText(stringToFind, 0, 6);
                } 
                else if(caseSensitive && !wholeWords) {
                    // Case sensitive and partial words
                    stringFound = textRange.findText(stringToFind, 0, 4);
    
                } else {
    
                    if(wholeWords) {
                        // Case insensitive but whole words
                        stringFound = textRange.findText(stringToFind, 0, 2);
    
                    } else {
                        // Case insensitive and partial words
                        stringFound = textRange.findText(stringToFind, 0, 2);
                    }
                }
                // deselect (wanted to find out if exists, not leave selection) 
                document.selection.empty();
            }
        }
        return stringFound;
    }
          

    /*
    	Developed by Robert Nyman, http://www.robertnyman.com
    	Code/licensing: http://code.google.com/p/getelementsbyclassname/
    */	
    var getElementsByClassName = function (className, tag, elm) {
    	if (document.getElementsByClassName) {
    		getElementsByClassName = function (className, tag, elm) {
    			elm = elm || document;
    			var elements = elm.getElementsByClassName(className),
    				nodeName = (tag)? new RegExp("\\b" + tag + "\\b", "i") : null,
    				returnElements = [],
    				current;
    			for(var i=0, il=elements.length; i<il; i+=1){
    				current = elements[i];
    				if(!nodeName || nodeName.test(current.nodeName)) {
    					returnElements.push(current);
    				}
    			}
    			return returnElements;
    		};
    	}
    	else if (document.evaluate) {
    		getElementsByClassName = function (className, tag, elm) {
    			tag = tag || "*";
    			elm = elm || document;
    			var classes = className.split(" "),
    				classesToCheck = "",
    				xhtmlNamespace = "http://www.w3.org/1999/xhtml",
    				namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
    				returnElements = [],
    				elements,
    				node;
    			for(var j=0, jl=classes.length; j<jl; j+=1){
    				classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
    			}
    			try	{
    				elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
    			}
    			catch (e) {
    				elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
    			}
    			while ((node = elements.iterateNext())) {
    				returnElements.push(node);
    			}
    			return returnElements;
    		};
    	}
    	else {
    		getElementsByClassName = function (className, tag, elm) {
    			tag = tag || "*";
    			elm = elm || document;
    			var classes = className.split(" "),
    				classesToCheck = [],
    				elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
    				current,
    				returnElements = [],
    				match;
    			for(var k=0, kl=classes.length; k<kl; k+=1){
    				classesToCheck.push(new RegExp("(^|\\s)" + classes[k] + "(\\s|$)"));
    			}
    			for(var l=0, ll=elements.length; l<ll; l+=1){
    				current = elements[l];
    				match = false;
    				for(var m=0, ml=classesToCheck.length; m<ml; m+=1){
    					match = classesToCheck[m].test(current.className);
    					if (!match) {
    						break;
    					}
    				}
    				if (match) {
    					returnElements.push(current);
    				}
    			}
    			return returnElements;
    		};
    	}
    	return getElementsByClassName(className, tag, elm);
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
        // All elements get the rest
        // elements is an array so we have to apply to each indice
        if(type==='elements') {
            for (var i = 0; i < el.length; i += 1) {
                if(el[i]) {
                    injectKeydown(el[i]);
                    injectClick(el[i]);
                }
            }
        } else {
            injectKeydown(el);
            injectClick(el);
        }
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
        elementsByClass: function(o) {
            try {
                proceedOrThrow({'required':["class"], 'arg':o,
                                'errorMessage':'id property required'});
                return injectHandlers('elements', getElementsByClassName(o.class));
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
        triggerEvent: function(element, eventName, kcode) {
            return triggerEvent(element, eventName, kcode);
        },
        // Page contains. Decided to provide some aliases for this ;)
        // Only stringFound is required as it defaults to case sensitive
        // partial words
        pageContains: function (stringToFind, caseSensitive, wholeWords){
            return findTextOnPage(stringToFind, caseSensitive, wholeWords);
        },
        pageDoesNotContain: function (stringToFind, caseSensitive, wholeWords){
            return !findTextOnPage(stringToFind, caseSensitive, wholeWords);
        },

        should_include: function (stringToFind, caseSensitive, wholeWords){
            return findTextOnPage(stringToFind, caseSensitive, wholeWords);
        },
        should_not_include: function (stringToFind, caseSensitive, wholeWords){
            return !findTextOnPage(stringToFind, caseSensitive, wholeWords);
        },
        have_content: function (stringToFind, caseSensitive, wholeWords){
            return findTextOnPage(stringToFind, caseSensitive, wholeWords);
        },
        have_no_content: function (stringToFind, caseSensitive, wholeWords){
            return !findTextOnPage(stringToFind, caseSensitive, wholeWords);
        },
        clearAllSelections: function() {
            if(window.selection) {
                document.selection.empty();
            } else {
                window.getSelection().removeAllRanges();
            }
        }, 
        ShimInputError: function(message) { return new ShimInputError(message); }
    }
})();

