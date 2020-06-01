#LM Screenshoter
Automates visual regression testing

##Installation
First of all, should install packages `npm ci`.

Then init backstop `npm run init`.

##Usage
In `index.js` file you need set absolute path in `projectsDirectoryPath` parameter for projects path.

For the run application you should use the next example command:

`npm start -- --test --project="project-name"`

where:

* `--test` -- creates a set of test screenshots and compares them with your reference screenshots. You can use an alias `-t`.
* `--approve` -- if the test you ran looks good, then go ahead and approve it. Approving changes will update your
 reference files with the results from your last test. Future tests are compared against your most recent approved
  test screenshots. You can use an alias `-a`.
* `--project` -- set `project-name` to specify the project folder you'd like to test. You can use an alias `-p
`. Also, you can use parameter without equals symbol like this: `-p project-name`.

##Examples

Run test:
* `npm start -- --test --project="bad-credit-loans.co"`
* `npm start -- -t -p bad-credit-loans.co`

Approve test:
* `npm start -- --approve --project="bad-credit-loans.co"`
* `npm start -- -a -p bad-credit-loans.co`
