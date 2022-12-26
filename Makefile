install-deps:
	npm ci

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

collect-coverage:
	npm test -- --collectCoverage

lint:
	npx eslint .
