Package.describe({
  name: 'seanbrodie:accounts-web3',
  version: '0.0.1',
  summary: 'Web3 login/sign-up support for accounts',
  // URL to the Git repository containing the source code for this package.
  git: 'https://github.com/seanbrodie/meteor-accounts-web3',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  // documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('2.6.1');
  api.use(['accounts-base', 'sha', 'ejson', 'ddp'], ['client', 'server']);

  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server']);

  api.use('tracker', 'client');
  api.use('email', 'server');
  api.use('random', 'server');
  api.use('check', 'server');
  api.use('ecmascript');

  api.addFiles('client_utils.js', 'client');
  api.addFiles('web3_client.js', 'client');
  api.addFiles('web3_server.js', 'server');

  // api.mainModule('accounts-web3.js');
});

// Package.onTest(function(api) {
//   api.use('ecmascript');
//   api.use('tinytest');
//   api.use('seanbrodie:accounts-web3');
//   api.mainModule('accounts-web3-tests.js');
// });
