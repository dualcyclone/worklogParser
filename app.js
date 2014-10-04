var fs = require('fs'),
	json2csv = require('json2csv'),
	isJson = /^.*\.json$/,
	watchedDirectory = '/tmp/worklog/';
	
fs.mkdir(watchedDirectory, function(err) {
	console.log('made watched worklog directory');
})

fs.watch(watchedDirectory, function (event, filename) {
	var jsonData, issues, issue, worklogs, worklog, 
		csvData = "",
		csvFilename = filename + '.output.' + Date.now() + '.csv';
	
  	if (filename && isJson.test(filename)) {
  		fs.readFile(watchedDirectory + filename, function(err, data) {
			jsonData = JSON.parse(data);
			
			issues = jsonData.issues;
			
			// loop over issues
			for (var i = 0, ii = issues.length; i < ii; i++) {
				issue = issues[i];
				worklogs = issue.fields.worklog.worklogs;
				
				for (var j = 0, jj = worklogs.length; j < jj; j++) {
					worklog = worklogs[j];
					csvData += issue["key"] + "," + worklog["author"]["displayName"] + "," + worklog["timeSpentSeconds"] + "," + worklog["created"] + "\n";
				}
			}
			
			fs.writeFile(watchedDirectory + csvFilename, csvData, function() {
				console.log('Created: ' + watchedDirectory + csvFilename);
			});
		});
  	}
});