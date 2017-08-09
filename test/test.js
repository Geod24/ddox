var fs = require('fs'),
    phantomcss = require(fs.workingDirectory + '/node_modules/phantomcss/phantomcss.js');

casper.test.begin('ddox visual test', function(test) {
    var options = {
	rebase: casper.cli.get( "rebase" ),
        libraryRoot: './node_modules/phantomcss',
        screenshotRoot: './test/screenshots',
        failedComparisonsRoot: './test/failures',
        addLabelToFailedImage: false,
        addIteratorToImage: false
    };
    phantomcss.init(options);

    var tests = ['declaration_prototype', 'function_parameters', 'code_example', 'class_main_contents'];

    casper
        .start('http://localhost:8080/vibe.web.rest/registerRestInterface')
        .viewport(1024, 768)
        .then(function() {
            phantomcss.screenshot('#main-contents > div:nth-child(3)', tests[0]);
        })
        .then(function() {
            phantomcss.screenshot('#main-contents > section:nth-child(5)', tests[1]);
        })
        .then(function() {
            phantomcss.screenshot('#main-contents > section:nth-child(7)', tests[2]);
        })
        .thenOpen('http://localhost:8080/vibe.web.rest/RestInterfaceClient')
        .then(function() {
            phantomcss.screenshot('#main-contents', tests[3]);
        });

    casper
        .then(function() {
            phantomcss.compareExplicit(tests.map(function (name) {
                return options.screenshotRoot + "/" + name + ".diff.png";
            }));
        })
        .run(function() {
            test.done();
        });
});
