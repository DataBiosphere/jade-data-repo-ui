# Jade Data Repository UI

Based off of [React Redux Saga Boilerplate](https://github.com/gilbarbara/react-redux-saga-boilerplate)

### Prerequisites

- install npm: `brew install npm`
- install nvm from [nvm.sh](https://github.com/nvm-sh/nvm#install--update-script):

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

Note: Do NOT install nvm through homebrew as that is no longer maintained

- Run the following to get automatic node version switching set up (see [.node-version](.node-version) for latest version to use):

```
nvm install 20.11.0
rm -R ~/.avn (if you want to reset an existing or failed avn setup)
nvm exec 20.11.0 npm install -g avn avn-nvm avn-n
nvm exec 20.11.0 avn setup
nvm install lts/gallium --default
nvm use lts/gallium
```

- Run `npm install` to download dependencies defined in the package.json file and generate the node_modules folder with the installed modules.

```
npm install
```

- Make sure you have the following environment variables set:

  - `export PROXY_URL=https://jade.datarepo-dev.broadinstitute.org`
  - `export CYPRESS_BASE_URL=http://localhost:3000`
    
- If running E2E tests and/or you want to replicate the conditions of a run on GitHub, you may want to change PROXY_URL. You can see what environment was used on a GitHub run by viewing the test error and then the "Check for an available namespace to deploy API to and set state lock" step. In the final lines, this will include a namespace such as integration-N where N is some number. Then, you can set the PROXY_URL accordingly:
  
  - `export PROXY_URL=https://jade-N.datarepo-integration.broadinstitute.org`

- For performance gains, you should disable linting (don't worry, it gets checked in GitHub actions) by setting the following environment variable:

  - `export DISABLE_ESLINT_PLUGIN=true`

- Before running e2e tests, set CYPRESS_GOOGLE_TOKEN to your access token

```
export CYPRESS_GOOGLE_TOKEN=$(gcloud auth print-access-token <the user you want to test with, e.g. dumbledore.admin@test.firecloud.org>)
```

you may need to log in with the test account using:

```
gcloud auth login --no-activate
```

### Provides

- react ^17.x
- react-router ^6.x
- react-helmet ^6.x
- redux ^4.x
- redux-saga ^1.x

### Development

- vite-dev-server ^5.x
- redux-devtools (with browser plugin)

`npm start`

### Building

- vite ^4.x
- babel ^7.x

`npm run build`

### Code Quality

- eslint ^8.x

`npm run lint` / `npm run lint:styles`

### Testing

- cypress 13.x

To run end-to-end tests: `npx cypress run` or `npx cypress open` (interactive mode)

To run unit tests: `npx cypress run --component` or `npx cypress open --component` (interactive mode)

## skaffold

To render your own local skaffold.yaml run the following with your initials

```
sed -e 's/TEMP/<initials>/g' skaffold.yaml.template > skaffold.yaml
```

To deploy UI work to your personal environment, run the following commands

```
npm run build --production
skaffold run
```

To deploy the UI used in the Github e2e action, find the image tag in the output of the job and then substitute it for the <TAG> in the command below:

```
skaffold deploy --images=gcr.io/broad-jade-dev/jade-data-repo-ui:<TAG>
```

for example, if the e2e "Echo tagged image" in your action log output was:
Pushed docker image gcr.io/broad-jade-dev/jade-data-repo-ui:abcdefg

You would run:

```
skaffold deploy --images=gcr.io/broad-jade-dev/jade-data-repo-ui:abcdefg
```
