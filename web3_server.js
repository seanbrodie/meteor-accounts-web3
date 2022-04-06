import { Accounts } from "meteor/accounts-base";
import { ethers } from "ethers";

// Utility for grabbing user
const getUserById = (id, options) => Meteor.users.findOne(id, Accounts._addDefaultFieldSelector(options));

const createUser = options => {
  const address = options.address;
  console.log("creating user: " + address)
  if (!address) {
    throw new Meteor.Error(400, "Need to set an address");
  }

  const nonce = updateNonce(address);
  const web3 = { address, nonce };
  const user = { username: address, services: { web3 } };

  return Accounts._createUserCheckingDuplicates({ user, options })
};

Accounts.createUser = (options, callback) => {
  options = { ...options };

  // XXX allow an optional callback?
  if (callback) {
    throw new Error("Accounts.createUser with callback not supported on the server yet.");
  }

  return createUser(options);
};

const updateNonce = (address) => {
  let nonce = Math.floor(100000*Math.random());
  affectedRecords = Meteor.users.update(
    {
      'services.web3.address': address
    },
    {
      $set: {
        'services.web3.nonce': nonce,
      }
    });
  return nonce;
}

// Register method to handle login. Requests come from the client.
Meteor.methods({
  validateLogin: async function (...args) {

    const { address, signature } = args[0];

    let user = Meteor.users.findOne(
      { "services.web3.address": address },
      { fields: { services: 1, } }
    );

    let nonce = user.services.web3.nonce;

    let message = "This is a login request for "+Meteor.settings.public.appName+". \nIt does not cost anything. \nNonce: " + nonce;

    const msgHash = ethers.utils.hashMessage(message);
    const msgHashBytes = ethers.utils.arrayify(msgHash);

    const recoveredAddress = ethers.utils.recoverAddress(msgHashBytes, signature).toLowerCase();

    if (recoveredAddress==address) {
      return Accounts._loginMethod(this, 'validateLogin', args, 'web3', () => {
        updateNonce(address);

        let user = Meteor.users.findOne(
          { "services.web3.address": address },
          { fields: { services: 1, } }
        );

        return {userId: user._id, address: address};
      } );
    } else {
      throw new Meteor.Error(403, "Invalid signature");
    }
  }
});

// Register method to retreive nonce. Requests come from the client.
Meteor.methods({
  getNonce: function (...args) {
    const { address } = args[0];

    let user = Meteor.users.findOne(
      { "services.web3.address": address },
      { fields: { services: 1, } }
    );

    if (!user) { // create user
      const userId = Accounts.createUser({ address });
      user = getUserById(userId);
    }

    let nonce = user.services.web3.nonce;

    return nonce;
  }
});

Meteor.users.createIndex('services.web3.nonce', { unique: false, sparse: true });
Meteor.users.createIndex('services.web3.address', { unique: true, sparse: true });