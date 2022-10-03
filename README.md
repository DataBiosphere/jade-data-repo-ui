# Jade Data Repository UI

Based off of [React Redux Saga Boilerplate](https://github.com/gilbarbara/react-redux-saga-boilerplate)

### Prerequisites

- install npm: `brew install npm`
- install nvm from [nvm.sh](https://github.com/nvm-sh/nvm#install--update-script):

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

Note: Do NOT install nvm through homebrew as that is no longer maintained

- Run the following to get automatic node version switching set up:

```
nvm install 10.0.0
rm -R ~/.avn (if you want to reset an existing or failed avn setup)
nvm exec 10.0.0 npm install -g avn avn-nvm avn-n
nvm exec 10.0.0 avn setup
nvm install lts/erbium --default
nvm use lts/erbium
```

- Run `npm install` to download dependencies defined in the package.json file and generate the node_modules folder with the installed modules.

```
npm install
```

- Make sure you have the following environment variables set:

  - `export PROXY_URL=https://jade.datarepo-dev.broadinstitute.org`
  - `export CYPRESS_BASE_URL=http://localhost:3000`

- For performance gains, you should disable linting (don't worry, it gets checked in GitHub actions) by setting the following environment variable:

  - `export DISABLE_ESLINT_PLUGIN=true`

- Before running e2e tests, set CYPRESS_GOOGLE_TOKEN to your access token

```
export CYPRESS_GOOGLE_TOKEN=$(gcloud auth print-access-token)
```

### Provides

- react ^16.x
- react-router 4.x
- react-helmet 5.x
- redux 4.x
- redux-saga 0.16.x

### Development

- webpack-dev-server 3.x
- react-hot-loader 4.x
- redux-devtools (with browser plugin)

`npm start`

### Building

- webpack 4.x
- babel 7.x

`npm run build`

### Code Quality

- eslint 5.x
- stylelint 9.x

`npm run lint` / `npm run lint:styles`

### Testing

- cypress 9.x

To run end-to-end tests: `npx cypress run` or `npx cypress open` (interactive mode)

To run unit tests: `npx cypress run-ct` or `npx cypress open-ct` (interactive mode)

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