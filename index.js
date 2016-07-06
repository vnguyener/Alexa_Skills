"use strict"

const hotswap = require('hotswap'),
	fs = require('fs'),
	path = path = require('path'),
	http = require('http'),
	https = require('https'),
	express = require('express'),
	alexa = require('alexa-app'),
	bodyParser = require('body-parser'),
	Promise = require('bluebird');

let appServer = function (config) {
	config = config || {};

	let self = {};
	let server_root = config.server_root || '';
	
	self.apps = {};

	self.log = function (msg) {
		if (config.log !== false) {
			console.log(msg);
		}
	};

	self.error = function (msg) { console.log(msg); };

	// Configure hotswap
	hotswap.on('swap', function (filename) {
		self.log("hotswap reloaded: " + filename);
	});
	hotswap.on('error', function (e) {
		self.log("-----\nhotswap error: " + e + "\n-----\n");
	});

	// Load skills
	self.loadSkills= function (app_dir, root) {
		var app_directories = function (srcpath) {
			return fs.readdirSync(srcpath).filter(function (file) {
				return fs.statSync(path.join(srcpath, file)).isDirectory();
			});
		}
		app_directories(app_dir).forEach(function (dir) {
			var package_json = path.join(app_dir, dir, "/package.json");
			if (!fs.existsSync(package_json) || !fs.statSync(package_json).isFile()) {
				self.log("   package.json not found in directory: " + dir);
				return;
			}
			var pkg = JSON.parse(fs.readFileSync(package_json, 'utf8'));
			if (!pkg || !pkg.main || !pkg.name) {
				self.log("   Failed to load: " + package_json);
				return;
			}
			var main = fs.realpathSync(path.join(app_dir, dir, pkg.main));
			if (!fs.existsSync(main) || !fs.statSync(main).isFile()) {
				self.log("   main file not found for app [" + pkg.name + "]: " + main);
				return;
			}
			try {
				var app = require(main);
				self.apps[pkg.name] = pkg;
				self.apps[pkg.name].exports = app;
				if (typeof app.express != "function") {
					self.log("   App [" + pkg.name + "] is not an instance of alexa-app");
					return;
				}

				// Extract Alexa-specific attributes from package.json, if they exist
				if (typeof pkg.alexa == "object") {
					app.id = pkg.alexa.applicationId;
				}

				// The express() function in alexa-app doesn't play nicely with hotswap,
				// so bootstrap manually to express
				var endpoint = (root || '/') + (app.endpoint || app.name);
				self.express.post(endpoint, function (req, res) {
					var json = req.body, response_json;
					// preRequest may return altered request JSON, or undefined, or a Promise
					Promise.resolve(typeof config.preRequest == "function" ? config.preRequest(json, req, res) : json)
						.then(function (json_new) {
							if (json_new) {
								json = json_new;
							}
							return json;
						})
						.then(app.request)
						.then(function (app_response_json) {
							response_json = app_response_json;
							return Promise.resolve(typeof config.postRequest == "function" ? config.postRequest(app_response_json, req, res) : app_response_json)
						})
						.then(function (response_json_new) {
							response_json = response_json_new || response_json;
							res.json(response_json).send();
						})
						.catch(function () {
							res.status(500).send("Server Error");
						});
				});
				// Configure GET requests to run a debugger UI
				if (false !== config.debug) {
					self.express.get(endpoint, function (req, res) {
						if (typeof req.param('schema') != "undefined") {
							res.set('Content-Type', 'text/plain').send(app.schema());
						}
						else if (typeof req.param('utterances') != "undefined") {
							res.set('Content-Type', 'text/plain').send(app.utterances());
						}
						else {
							res.render('test', { "app": app, "schema": app.schema(), "utterances": app.utterances(), "intents": app.intents });
						}
					});
				}

				self.log("   Loaded app [" + pkg.name + "] at endpoint: " + endpoint);
			}
			catch (e) {
				self.log("Error loading app [" + main + "]: " + e);
			}
		});
		return self.apps;
	};

	self.start = function () {

		self.express = express();
		self.express.use(bodyParser.urlencoded({ extended: true }));
		self.express.use(bodyParser.json());
		self.express.set('views', path.join(__dirname, 'views'));
		self.express.set('view engine', 'ejs');


		// Find and load alexa-app modules
		let app_dir = path.join(server_root, config.app_dir || 'skills');

		if (fs.existsSync(app_dir) && fs.statSync(app_dir).isDirectory()) {
			self.log("Loading apps from: " + app_dir);
			self.loadSkills(app_dir, config.app_root || '/alexa/');
		}
		else {
			self.log("Apps not loaded because directory [" + app_dir + "] does not exist");
		}

		// Start the server listening
		config.port = config.port || process.env.port || 80;
		let instance = self.express.listen(config.port);

		self.log("Magic happens on port: " + config.port);

		return instance;
	};

	return self;
};

// A shortcut start(config) method to avoid creating an instance if not needed
appServer.start = function (config) {
	let appServerInstance = new appServer(config);
	appServerInstance.start();
	return appServerInstance;
};

module.exports = appServer;
