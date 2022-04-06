# accounts-web3
[![Project Status: Active – The project has reached a stable, usable state and is being actively developed.](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)
***
A Meteor plugin for simple web3 authentication.

## Getting started

### Install

```shell
meteor add seanbrodie:accounts-web3
```

### Web3 calls

The plugin exposes two functions in the base accounts library: `login / logout`
They can be accessed through the added web3 object:
```
import { Accounts } from 'meteor/accounts-base'
Accounts.web3.login()
```
This initializes the web3 login mechanism using [Web3Modal](https://github.com/Web3Modal/web3modal).
Custom providers can be specified in the settings.json file.

### Login flow
1. `getNonce` - checks if address is already in database, or creates new user and nonce
2. The nonce associated with the address is then signed thru web3
3. The server verifies the signature matches the address+nonce of user
4. User is logged in. New nonce randomly generated.

### Requirements
The plugin expects various configs in the project settings.json file.
An example config can be found in [settings-example.json](settings-example.json)


---
##### Note:
This is my first Meteor plugin so please let me know if I've not utilised the correct patterns