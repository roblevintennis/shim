jasmine.ShimReporter = function(doc) {};

jasmine.ShimReporter.prototype.reportRunnerStarting = function(runner) {
    this.startedAt = new Date();
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
        //var suiteDescription = suite.description;
        if (suite.parentSuite) {
            var parentSuiteId = suite.parentSuite.id;
            this.log("parentSuiteId: ", parentSuiteId);
        }
    }
    this.log(suitesRunnerStartedMessage);
    this.log("\n\n");
};

jasmine.ShimReporter.prototype.reportRunnerResults = function(runner) {
    var results = runner.results();
    var passFailedString = (results.failedCount > 0) ? "runner failed" : "runner passed";
    var specs = runner.specs();
    var specCount = 0;
    for (var i = 0; i < specs.length; i++) {
        var specMessage = "Spec Description: " + specs[i].description;
        if(specs[i].results_.passedCount) { specMessage += "\n\t\tPassed"; }
        else if(specs[i].results_.failedCount) { specMessage += "\n\t\tFailed"; } 
        else { specMessage += "Result Unknown"; }
        specCount++;
        this.log(specMessage);
    }
    var message = "" + specCount + " spec" + (specCount == 1 ? "" : "s" ) + ", " + results.failedCount + " failure" + ((results.failedCount == 1) ? "" : "s");
    message += " in " + ((new Date().getTime() - this.startedAt.getTime()) / 1000) + "s";

    this.log(message);
    this.log("Finished at " + new Date().toString() + "\n\n");
    this.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>\n\n\n");

};

function getWindowSize() {
    var myWidth = 0, myHeight = 0;
    //Non-IE
    if( typeof( window.innerWidth ) == 'number' ) {
        myWidth = window.innerWidth;
        myHeight = window.innerHeight;
    } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
        //IE 6+ in 'standards compliant mode'
        myWidth = document.documentElement.clientWidth;
        myHeight = document.documentElement.clientHeight;
    } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
        //IE 4 compatible
        myWidth = document.body.clientWidth;
        myHeight = document.body.clientHeight;
    }
    return {w:myWidth, h:myWidth};
}

jasmine.ShimReporter.prototype.reportSuiteResults = function(suite) {
    var results = suite.results();
    var status = results.passed() ? 'passed' : 'failed';
    if (results.totalCount == 0) { // todo: change this to check results.skipped
        status = 'skipped';
    }
    this.log("=========================================");
    this.log("Test Results for Suite: || "+suite.description+" ||");
    this.log("=========================================");
    this.log(status);

    // Open the Modal Dialog Window 
    jq("#dialog-modal").dialog('open');
};

jasmine.ShimReporter.prototype.reportSpecStarting = function(spec) {
    //this.log('>> Jasmine Running ' + spec.suite.description + ' ' + spec.description + '...');
};

jasmine.ShimReporter.prototype.reportSpecResults = function(spec) {
    var results = spec.results();
    var status = results.passed() ? 'passed' : 'failed';
    if (results.skipped) {
        status = 'skipped';
    }
    var resultItems = results.getItems();
  
    for (var i = 0; i < resultItems.length; i++) {
        var result = resultItems[i];
        if (result.type == 'log') {
            this.log(result.toString());
        } else if (result.type == 'expect' && result.passed && !result.passed()) {
            this.log(result.message);
        }
        if (result.trace.stack) {
            this.log(result.trace.stack);
        }
    }
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

