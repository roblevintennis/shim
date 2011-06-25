# shim.js — A simple hack that allows you to test your application in it's own environment.

According to Wikipedia, a shim in programming is: "In computer programming, a shim is a small library which transparently intercepts an API, changes the parameters passed, handles the operation itself, or redirects the operation elsewhere."..

> Why I wrote it 

I developed a d-pad oriented application for TVs, BluRays, GTV, etc. I found that the UI test frameworks available, although wonderous in there accomplishments, not to be what I needed for my particular problem (e.g. I tried watir|watir-webdriver, Selenium, Windmill, etc., etc.) I found that they all had there own quirks and somehow prevented me from interacting with my application as directly as I would have liked. 

## How to use?
At time of writing, I have patched the [jasmine][jasmine] test runner to print out directly in to console.log. I plan to write a nice overlay/pop up or something but haven't got to it yet. Probably running the test suite and hacking on it to meet your needs is the fastest ;) 

## Usage

A quick example how to use shim.js:

    // Here's finding a textfield and setting it's value           
    var t = shim.textfield({name:"firstname"});
    t.set("john malkovich")
    t.clear();

    // Find a link and the click it
    var ll = shim.link({href:"http://www.foo.com/path/to/index.html"});
    ll.click();

    // Find a button and fire a keydown RIGHT event
    var b = shim.button({value:"Button1"});
    b.keydown(39);

Of course these all assume that libs have been included, etc. Probably the easiest way to grok quickly would be to look at the testShim.js file and run the test suite (which uses [jasmine][jasmine] by the way).

## F.A.Q.

### Coming soon

Credits
[jQuery]: http://jquery.com/
[jasmine]: http://pivotal.github.com/jasmine/
