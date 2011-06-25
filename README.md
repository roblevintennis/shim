# shim.js — Allows you to test your web application in it's own environment.

Wikipedia: "In computer programming, a shim is a small library which transparently intercepts an API, changes the parameters passed, handles the operation itself, or redirects the operation elsewhere."..

shim.js gets injected in to your web application and thereafter gives you an API to drive your UI with. Similar in spirit to things like watir, capybara, etc., but is more direct in that it's written in JavaScript and becomes a part of your page.

## Why I wrote it 

I developed a d-pad oriented application for TVs, BluRays, GTV, etc. I found that the UI test frameworks available, although wonderous in there accomplishments, not to be what I needed for my particular problem (e.g. I tried watir|watir-webdriver, Selenium, Windmill, etc., etc.) I found that they all had there own quirks and somehow prevented me from interacting with my application as directly as I would have liked. 

## How to use?
At time of writing, I have hacked up a [jasmine][jasmine] test runner that prints test results out directly to console.log. Later, I plan to write a nice overlay/pop up or something. Just haven't got to it yet (ahem, any takers???). 

Here's what you need to include if you plan to use the ShimReporter I just mentioned:

<pre>

&lt;script src='shim.js' etc...
&lt;script src='jasmine-shim-adapter.js' etc...
&lt;script src='jasmine.js' etc...

// Add then do this do kick off your test suite
jasmine.getEnv().addReporter(new jasmine.ShimReporter());
jasmine.getEnv().execute();

</pre>

Again, you need to open up console.log to see some output. Probably running the test suite and hacking on it to meet your needs is the fastest ;) 

## Does it require Jasmine?
No. The above example just assumes that you want to, but shim.js is self sufficient. I just haven't created any hooks to other frameworks yet. shim.js simply provides a small API that allows you to interact with your web page's UI (e.g. click a button, set some text, etc.) and also see if the page contains text. 

## Usage

A quick example how to use shim.js:

<code>

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

    // Some examples of using with jasmine to see if "page contains"    
    // Notice that I've used familiar aliases for the exact same functionality:
    expect(shim.pageContains('Wilson')).toBeTruthy();
    expect(shim.pageDoesNotContain('bogus_no_way')).toBeTruthy();

    // Familiar aliases #1
    expect(shim.have_content('Wilson')).toBeTruthy();
    expect(shim.have_no_content('bogus_no_way')).toBeTruthy(); 

    // Familiar aliases #2
    expect(shim.should_include('resig')).toBeTruthy();
    expect(shim.should_not_include('bogus_no_way')).toBeTruthy();


</code>

Of course these all assume that libs have been included, etc. Probably the easiest way to grok quickly would be to look at the testShim.js file and run the test suite (which uses [jasmine][jasmine] by the way).

You'll see that the test suite include [jquery][jquery]. However, shim.js does not and uses pure JavaScript so you don't need to include jquery if you don't want to.

### TODO 
1. Tables/Forms not implemented (however, form elements are!).

2. Pretty UI

3. Tie in with some other test frameworks other than just jasmine. Maybe qunit? Will be selected and hopefully get some help with this sort of thing.

## F.A.Q.

### Coming soon

[jQuery]: http://jquery.com/
[jasmine]: http://pivotal.github.com/jasmine/
