jasmine.ShimReporter = function(doc) {
    this.document = doc || document;
};

shim.results = {};

//***********************************
// TODO: Put up a progress indicator
//***********************************
jasmine.ShimReporter.prototype.reportRunnerStarting = function(runner) {
    this.startedAt = new Date();
/*
    var parentSuiteId;
    var version = runner.env.versionString();
    var suites  = runner.suites();
    var suitesRunnerStartedMessage =  "\n\n\n\n\n\n\n\n";
    suitesRunnerStartedMessage     += ">>>>>>>>>>>>>>>>>>";
    suitesRunnerStartedMessage     += "Starting Suites";
    suitesRunnerStartedMessage     += "<<<<<<<<<<<<<<<<<<\n\n";
    for (var i = 0; i < suites.length; i++) {
        var suite = suites[i];
        var suiteFullName = 
        suitesRunnerStartedMessage += "|" + suite.getFullName() + "|";
        if (suite.parentSuite) {
            parentSuiteId = suite.parentSuite.id;
            this.log("parentSuiteId: ", parentSuiteId);
        }
    }
    this.log(suitesRunnerStartedMessage);
    this.log("\n\n");
*/
};

jasmine.ShimReporter.prototype.reportSpecStarting = function(spec) {
    //this.log('>> Jasmine Running ' + spec.suite.description + ' ' + spec.description + '...');
};

/*
jasmine.ShimReporter.prototype.reportSpecResults = function(spec) {
    var thisSpecMessage = '';
    var results = spec.results();
    var resultItems = results.getItems();
    for (var i = 0; i < resultItems.length; i++) {
        var result = resultItems[i];
        if (result.type == 'log') {
            this.log(result.toString());
            thisSpecMessage += result.toString();
        } else if (result.type == 'expect' && result.passed && !result.passed()) {
            this.log(result.message);
            thisSpecMessage += result.message;
        }
        if (result.trace.stack) {
            this.log(result.trace.stack);
            thisSpecMessage += result.trace.stack;
        }
    }
};
*/

jasmine.ShimReporter.prototype.reportSuiteResults = function(suite) {
    var specs, suiteTitle, suiteContent, len, specMessage = '', specCount = 0, messagesForThisSuite = '';
    var results = suite.results();
    var status = results.passed() ? 'passed' : 'failed';

    if (results.totalCount == 0) { // todo: change this to check results.skipped
        status = 'skipped';
    }
    suiteTitle = jQuery('<h3 class="'+status+'"><a href="#">'+ suite.getFullName() +'</a></h3>');
    suiteContent = jQuery('<div id="'+ suite.id +'"></div>');
    specs = suite.specs_;
    len = specs.length;

    for (j = 0; j < len; j++) {

        specMessage = '<div class="spec-desc"><span class="dbl-r-angle">&#187;</span>'+specs[j].description+"</div>";

        if(specs[j].results_.passedCount) { 
            specMessage += "<div class='result "+status+"'>Passed</div>"; 
        }
        else if(specs[j].results_.failedCount) { 
            specMessage += "<div class='result "+status+"'>Failed</div>"; 

            if(specs[j].results_.items_[0]) {
                specMessage +=  '<div class="stack-trace">' + specs[j].results_.items_[0].trace +': '+
                                specs[j].results_.items_[0].trace.stack + '</div>';
            }
        } else { 
            specMessage += "<div class='result "+status+"'>Result Unknown</div>"; 
        }
        specCount++;
        jQuery(suiteContent).append(
            '<p>'+specMessage+'</p>'
        );
    }
    jQuery(suiteContent).prepend('<span class="spec-count">Spec Count: '+specCount+'</span>');

    // Append the suite's contents to the accordian
    jQuery('#accordion').append(suiteTitle)
                    .append(suiteContent)
};


jasmine.ShimReporter.prototype.reportRunnerResults = function(runner) {
    var specCount = 0;
    var results = runner.results();
    var suites  = runner.suites();
    var desc, specs, message, thisSuitesSpecMessages, specMessage, i, j;

    message = "" + specCount + " spec" + (specCount == 1 ? "" : "s" ) + ", " + results.failedCount + " failure" + ((results.failedCount == 1) ? "" : "s");
    message += " in " + ((new Date().getTime() - this.startedAt.getTime()) / 1000) + "s";
    this.log(message);
    this.log("Finished at " + new Date().toString() + "\n\n");
    this.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>\n\n\n");

    for (i = 0; i < suites.length; i += 1) {
        desc = suites[i].description;
        specs = suites[i].specs_;
        thisSuitesSpecMessages = '';
        for (j = 0; i < specs.length; i++) {
            specMessage = "Spec Description: " + specs[j].description;
            if(specs[j].results_.passedCount) { specMessage += " - Passed"; }
            else if(specs[j].results_.failedCount) { specMessage += " - Failed"; } 
            else { specMessage += " - Result Unknown"; }
            thisSuitesSpecMessages += specMessage;
            specCount++;
        }
    }
    // Open the Modal Dialog Window 
    jQuery("#dialog-modal").dialog('open');
    jQuery('#accordion').find('h3 :first-child').click();
};

jasmine.ShimReporter.prototype.log = function() {
    var console = jasmine.getGlobal().console;

    if (console && this.log) {
        if (this.log.apply) {
            this.log.apply(console, arguments);
        } else {
            this.log(arguments); // ie fix: this.log.apply doesn't exist on ie
        }
    }
};

jasmine.ShimReporter.prototype.getLocation = function() {
    return this.document.location;
};

