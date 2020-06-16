# LM Screenshoter
Automates visual regression testing

## Installation
First of all, should install packages `npm ci`.

Then init backstop `npm run init`.

## Usage
In `settings.json` file you need set absolute path in `projectsDirectoryPath` parameter for projects path.

For the run application you should use the next example command:

`npm test -- --test --project="project-name"`

where:

* `--test` -- creates a set of test screenshots and compares them with your reference screenshots. You can use an alias `-t`.
* `--approve` -- if the test you ran looks good, then go ahead and approve it. Approving changes will update your
 reference files with the results from your last test. Future tests are compared against your most recent approved
  test screenshots. You can use an alias `-a`.
* `--project` -- set `project-name` to specify the project folder you'd like to test. You can use an alias `-p
`. Also, you can use parameter without equals symbol like this: `-p project-name`.
* `--env`  -- set environment to specify which environment you'd like to test. It can be `local` or `dev`. You can use an
 alias `-e`. By default, set `local`. 

Or you can run `npm start` and answer on questions with enjoy :)

## Examples

Run local environment test:
* `npm test -- --test --project="bad-credit-loans.co"`
* `npm test -- -t -p bad-credit-loans.co`

Approve local environment test:
* `npm test -- --approve --project="bad-credit-loans.co"`
* `npm test -- -a -p bad-credit-loans.co`

Run development environment test:
* `npm test -- --test --project="bad-credit-loans.co" --env="dev"`
* `npm test -- -t -p bad-credit-loans.co -e dev`

Approve development environment test:
* `npm test -- --approve --project="bad-credit-loans.co" --env="dev"`
* `npm test -- -a -p bad-credit-loans.co -e dev`
