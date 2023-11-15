![Calendrier](logo.png "Calendrier")

Simple REST API using implemented on top of HTTP that provide a way to manage projects

## Setup

You need to follow few steps to setup this project before start using/working with it.

### Generating JWT signing key/secret

To generate your own JWT secret for token signing use :
```
$ npm run gen-secret
```

Get the secret and pass it to environ var `JWT_SECRET`

## Test

To run full unit test stack use :
```
$ npm run test
```