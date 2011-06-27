# shim.js — Allows you to test your web application in it's own environment.

Wikipedia: "In computer programming, a shim is a small library which transparently intercepts an API, changes the parameters passed, handles the operation itself, or redirects the operation elsewhere."..

shim.js gets injected in to your web application and thereafter gives you an API to drive your UI with. Similar in spirit to things like watir, capybara, etc., but is more direct in that it's written in JavaScript and becomes a part of your page. On the other hand it's very different from these in that (at time of writing) it will vanish as soon as you leave the page. This requires you to test one page at a time. If you have a one page monster web app it's a great fit. However, I do have on my TODOs to add multipage support (see below).

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

It uses jqueryui and creates a nice modal dialog wrapped around an accordian to the right top side of your viewport. Again, all but the first line assumes you want to use the jasmine test runner. If not, just include shim.js alone.

## Does it require Jasmine?
No. The above example just assumes that you want to, but shim.js is self sufficient. This would, for example, equate to only using shim.js. For the UI, well, yes for now. I just haven't created any hooks to other frameworks yet. 

The shim.js script itself simply provides a small API that allows you to interact with your web page's UI (e.g. click a button, set some text, etc.) and also see if the page contains text. If you don't want to use jasmine but feel intrigued by shim.js, you could first run the shim test suite (which uses jasmine and jquery), and get a feel for what's going on quickly; then you could just take shim.js and use in a way that suites your needs.

## Usage

A quick example how to use shim.js (assuming you've included it):

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

1) Multipage: At time of this writing, it runs one page and reports results. This means it will dissapear if you link off the page. Also, if your used to the watir/capybara, etc., paradign where you keep reloading pages, you'll have to shift your thinking as shim does not keep track of where in the test suite it last left off. 

However, I do see a case for adding multipage functionality that might work like this: if you needed to traverse multiple pages you would:

<pre>

// Set this at top of app
shim.multipage = true; 

// And then maybe on the last page put an indicator like:
shim.lastPage=true;

</pre>

These could be checked for before presenting test results, and, if multipage and not last page, write results to Web Storage (or similar). Again, you're reading the TODO section - this functionality does not yet exist ;)

2) Tables/Forms not implemented (however, form elements are!).
3) For Jasmine reporter, support nested describes.
4) Tie in with some other test frameworks other than just jasmine. Maybe qunit? Will be selected and hopefully get some help with this sort of thing.

## F.A.Q.

### Coming soon

[jQuery]: http://jquery.com/
[jasmine]: http://pivotal.github.com/jasmine/
