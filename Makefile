node:
	gulp ts; node build/app.js
chai:
	gulp test; mocha test/.build/test.js || true