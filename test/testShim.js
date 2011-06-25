//***************
// Local Storage
//***************

describe("Local Storage", function() {
    it('should be able to clear localstore (assumes exists)', function () {
        shim.clearLocalStorage();
        expect(window.localStorage.length).toBe(0);
    });

    it('should be able to get and set localstore', function () {
        shim.setLocalStorage("foo","bar");
        expect(shim.getLocalStorage('foo')).toMatch('bar');
    });
});

//*************
// DOM Getters
//*************
describe("Getting DOM Elements", function() {

    //********************
    // TODO: Form, Tables
    //********************

    it('should get an element by id', function() {
        var e = shim.element({id:"ninja"});
        expect(e.nodeType>0).toBeTruthy();
    });

    it('should get a textfield by name or id', function() {
        var t = shim.textfield({name:"firstname"});
        expect(t.value).toMatch('tom');
        t2 = shim.textfield({id:"fn"});
        expect(t2.value).toMatch('tom');
    });

    it('should also be able to use textfield to get textareas', function() {
        var t = shim.textfield({name:"mytextarea"});
        expect(t.value).toMatch('some text');
    });

    it('should get an input checkbox', function() {
        var b = shim.checkbox({value:"penn"});
        expect(b.name).toMatch('ball');
        var b2 = shim.checkbox({name:"ball"});
        // since name is not unique it could be either
        expect(b2.value).toMatch(/penn|wilson/); 
    });

    it('should get an input submit', function() {
        var s = shim.submit({value:"My Submit"});
        expect(s.name).toMatch('mysubmit');
    });

    it('should get an input radio', function() {
        var r = shim.radio({value:"R"});
        expect(r.name).toMatch('colors');
        expect(r.id).toMatch('red');
        var b = shim.radio({id:"blue"});
        expect(b.checked).toEqual(true);
    });

    it('should get select', function() {
        var s = shim.selectList({name:"tennis"});
        expect(s.options[0].value).toBe('nadal');
        expect(s.options[0].text).toBe('Nadal');
        expect(s.options[1].value).toBe('federer');
    });

    it('should throw ShimInputError if required input not supplied', function() {
        expect(function() {
            shim.element({"yada":"dada"});
        }).toThrow(shim.ShimInputError("Invalid Input: id property required"));
    });

    it('should get an input button by value', function() {
        var b = shim.button({value:"Button1"});
        expect(b.value).toMatch('Button1');
    });

    it('should get links using href or url', function() {
        var g = shim.link({url:"http://www.google.com"});
        expect(g.name).toMatch('google_link');
        var y = shim.link({href:"http://www.yahoo.com"});
        expect(y.name).toMatch('yahoo_link');
        ll = shim.link({href:"http://www.foo.com/path/to/index.html"});
        expect(ll.name).toMatch('long_link');
    });

});



//*************************
// DOM Setters and Actions
//*************************
describe("DOM Setters and Actions", function() {

    it('should set a textfield value', function() {
        var t = shim.textfield({name:"firstname"});
        t.set("john malkovich")
        expect(t.value).toMatch('john malkovich');
    });

    it('should clear a textfield value', function() {
        var t = shim.textfield({name:"firstname"});
        t.clear();
        expect(t.value).not.toMatch('john malkovich');
        expect(t.value).toMatch('');
    });
    it('should use textfield to set and clear textareas', function() {
        var t = shim.textfield({name:"mytextarea"});
        t.clear();
        expect(t.value).toMatch('');
        t.set("something cool 1\nsomething cool 2")
        expect(t.value).toMatch('something cool 1\nsomething cool 2');
    });

    it('should set a checkbox value', function() {
        var c = shim.checkbox({name:"ball"});
        var c2 = shim.checkbox({value:"wilson"});
        c.set(true);
        expect(c.checked).toEqual(true);
        c2.set(false);
        expect(c2.checked).toEqual(false);
    });

    it('should clear a checkbox', function() {
        var c = shim.checkbox({name:"ball"});
        c.clear();
        expect(c.checked).toEqual(false);
    });

    it('should set an input radio', function() {
        var r = shim.radio({value:"R"});
        r.set(true);
        expect(r.checked).toEqual(true);
    });

    it('should set selected option in dropdown by value', function() {
        var s = shim.selectList({name:"tennis"});
        s.set({value: 'agassi'});
        expect(s.options[2].selected).toEqual(true);
        s.clear();
        expect(s.options[2].selected).not.toEqual(true);
    });

//********
// Events
//*******

    // helper to prevent links
    function stopEvent(e) {
        if(window.event) {
            var e = window.event;
	        e.cancelBubble = true;
	        e.returnValue = false;
	        return false;
        } else {
            e.stopPropagation();
		    e.stopPropagation();
            e.preventDefault();
        }
    };

    it('should fire click events', function() {
        // Fire click on button
        var b = shim.button({value:"Button1"});
        jQuery(b).click(function(eventObject) {
            expect(eventObject.type).toBe('click');
            stopEvent(eventObject);
        });
        b.click();

        // Fire click on submit
        var s = shim.submit({value:"My Submit"});
        jQuery(s).click(function(eventObject) {
            expect(eventObject.type).toBe('click');
            stopEvent(eventObject);
        });
        s.click();

        // Fire click on link
        var ll = shim.link({href:"http://www.foo.com/path/to/index.html"});
        jQuery(ll).click(function(eventObject) {
            expect(eventObject.type).toBe('click');
            stopEvent(eventObject);
        });
        ll.click();
    });
 
    it('should fire click event on element by id', function() {
        var e = shim.element({id:"ninja"});
        jQuery(e).click(function(eventObject) {
            runs(function () {
                expect(eventObject.type).toBe('click');
                stopEvent(eventObject);
            });
        });
        e.click();
    });

    it('should fire keydown event with keycode', function() {
        // Fire keycode 39 on a button
        var b = shim.button({value:"Button1"});
        jQuery(b).keydown(function(eventObject) {
            runs(function() {
                expect(eventObject.which).toBe(39);
                stopEvent(eventObject);
            });
        });
        b.keydown(39);

        // Fire keycode 13 on a link
        var ll = shim.link({href:"http://www.foo.com/path/to/index.html"});
        jQuery(ll).keydown(function(eventObject) {
            runs(function () {
                expect(eventObject.which).toBe(13);
                stopEvent(eventObject);
            });
        });
        ll.keydown(13);
    });

});

//*********************************
// TODO: Page Should Contain Tests
//*********************************
// For exaple, watir has this:
// @browser.text.should include("#{GLOBS::Signin}")
describe("Page Contains", function() {

console.log("\n\n\n\n#####################################");
console.log("#####################################");
console.log(">>>>> TODO <<<<<");
console.log("Need to implement some \"page contains\" type of functionality.");
console.log("For example, waitr has b.text.should include('string')");
console.log("And capybara has: page.should have_content || have_no_content('foo')");
console.log("#####################################");
console.log("#####################################\n\n\n\n");

    it('should be able to see text on page', function () {
        // Not yet implemented
    });
});

