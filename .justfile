fmt:
	npx prettier --write .

eslint +FLAGS="":
	npx eslint --cache {{FLAGS}}

esfix: (eslint "--fix")

oxlint +FLAGS="":
	bunx oxlint -c .oxlintrc.json {{FLAGS}}

oxfix: (oxlint "--fix")

lint: oxlint eslint

fix: oxfix esfix

quickfix: oxfix

extract:
	bunx lingui extract
compile:
	bunx lingui compile --typescript

i18n: extract compile
