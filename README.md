# Jade Data Repository UI

Based off of [React Redux Saga Boilerplate](https://github.com/gilbarbara/react-redux-saga-boilerplate)

### Prerequisites
- install npm: `brew install npm`
- install nvm from [nvm.sh](nvm.sh) -- do NOT install through homebrew as that is no longer maintaine

Run the following to get automatic node version switching set up:
```
npm install -g avn avn-nvm avn-n
avn setup
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

### Unit Testing

- jest 23.x
- enzyme 3.x

`npm test`

### End 2 End Testing

- cypress 3.0.x

`npm run test:e2e`
