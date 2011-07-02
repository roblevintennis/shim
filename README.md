# shim.js — Allows you to test your web application in it's own environment.

Wikipedia: "In computer programming, a shim is a small library which transparently intercepts an API, changes the parameters passed, handles the operation itself, or redirects the operation elsewhere."..

shim.js gets injected in to your web application and thereafter gives you an API to drive your UI with. Similar in spirit to things like watir, capybara, etc., but is more direct in that it's written in JavaScript and becomes a part of your page. On the other hand it's very different from these in that (at time of writing) it will vanish as soon as you leave the page. This requires you to test one page at a time. If you have a one page monster web app it's a great fit. However, I do have on my TODOs to add multipage support (see below).

## Screenshot
<img src="https://lh5.googleusercontent.com/-LrlDW3YLNbM/Tg6nRgSAxuI/AAAAAAAAAMI/Zcu4FrW4KtY/s640/shim_ui.jpg" alt="Screen capture of shim.ja test suite using the shim UI using jasmine" />

## Why I wrote it 

I developed a d-pad oriented application for TVs, BluRays, GTV, etc. I found that the UI test frameworks available, although wonderous in there accomplishments, not to be what I needed for my particular problem (e.g. I tried watir|watir-webdriver, Selenium, Windmill, etc., etc.) I found that they all had there own quirks and somehow prevented me from interacting with my application as directly as I would have liked. 

## How to use?
At time of writing, I have created a [jasmine][jasmine] test runner that uses jqueryui to show test results in a modal accordian view. It waits until the tests have completed before presenting itself.

Here's what you need to include if you plan to use the above mentioned "ShimReporter" I just mentioned:

<pre>

&lt;script src='shim.js' etc...
&lt;script src='jasmine-shim-adapter.js' etc...
&lt;script src='jasmine.js' etc...

// Add then do this do kick off your test suite
jasmine.getEnv().addReporter(new jasmine.ShimReporter());
jasmine.getEnv().execute();

</pre>

The modal dialog accordian will show up to the right top side of your viewport upon test completion. Again, all but the first line assumes you want to use the jasmine test runner. If not, just include shim.js alone.

## Does it require Jasmine?
No. The above example just assumes that you want to, but shim.js is self-sufficient. However, for the UI test runner to work, well, yes for now. I just haven't created any hooks to other frameworks yet but I hope to.

The shim.js script itself simply provides a small API that allows you to interact with your web page's UI (e.g. click a button, set some text, etc.) and also see if the page contains text. If you don't want to use jasmine but feel intrigued by shim.js, you could first run the shim test suite (which uses jasmine and jquery), and get a feel for what's going on quickly. Then you could just take shim.js and use in a way that suites your needs.

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

Probably the easiest way to grok quickly would be to look at the testShim.js file and run the test suite, shim.html. 
You'll see that the test suite includes [jquery][jquery] and [jasmine][jasmine]. However, again, shim.js itself does not, and uses pure JavaScript so you don't need to include jquery or jasmine if you don't want to. 

### TODO 

1) Multipage: At time of this writing, the jasmine based test runner works on a per page basis assumming that you have included your test suite/cases into the web page. It then reports the test results upon completion in the modal accordian view. So this means it will dissapear if you follow a link off that page! If your used to the watir/capybara, etc., paradign where you keep reloading pages case by case, you'll have to shift your thinking as shim does not keep track of where in the test suite it last left off. This make a very strong case to use one of those frameworks should you have that sort of requirement.

Note that I do see a case for adding multipage functionality -- multipage, in that you would be able to follow links to other pages that also include shim.js. Note that I do NOT mean that it would keep track of how many test cases have run and then start subsequently. Again, capybara/watir might be better if that's required.

The multipage version I'm hoping to code up would likely work like this:

<pre>

// You'd set this at top of your app to tell shim you want multipage
shim.multipage = true; 

// And then maybe on the last page put an indicator like:
shim.lastPage=true;

</pre>

These could be checked for before presenting test results, and, if multipage is true, and not last page, write results to Web Storage localStorage. Then, on lastPage, shim would present the results by parsing the localStorage. 

Again, you're reading the TODO section - this functionality does not yet exist ;)

2) Tables/Forms not implemented (however, form elements are!). This will probably come when I or someone else needs this for their project. Probably pretty easy to add.

3) For Jasmine reporter, support nested describes. Partly due to my laziness ;-0

4) Tie in with some other test frameworks other than just jasmine. Maybe qunit? If/when I do this, I'll be selective and follow my own biases. At present, I seem to favor jasmine and qunit so qunit would be next. Love/hate with jstestdriver and can be hooked in to jasmine, etc., so probably not from my fingers. Great to get some open source love for this one ;)

5) Reload Support: Would require shim to keep track of how many test cases have run and then start from where it left off. Perhaps this could be a config property:

<pre>

shim.reload = true;

</pre>

I'll have to think about how to do this without creating a whole test framework as this requires keeping some sort of map of test cases and another progress map of tests ran. This could leverage localStorage. Not yet thought out...very desirable feature as reloading the browser between test cases insures truly independent test cases ;)

## F.A.Q.

### Coming soon

[jQuery]: http://jquery.com/
[jasmine]: http://pivotal.github.com/jasmine/
