'use strict';

const {Contract} = require('fabric-contract-api');

class RegistrarContract extends Contract {

	constructor() {
		// Provide a custom name to refer to this smart contract
		super('org.property-registration-network.regnet.registrarcontract');
	}


	// print the success message on console on startup
	async instantiate(ctx) {
		console.log('Regnet Smart Contract Registrar Instantiated');
	}

/*  //to be moved to usercontract

  async rechargeAccount(ctx, name, aadhar, amount) {
    // Create a new composite key for the user account
    const userKey    = ctx.stub.createCompositeKey('org.property-registration-network.regnet.user', [name,aadhar]);

    //Return value of user from Blockchain
    let userBuffer = await ctx.stub
        .getState(userKey)
        .catch(err => console.log(err));

    let user = JSON.parse(userBuffer.toString());

    // Make sure that user Request already exists and user with given name and aadhar does not exist.
    if (user.length === 0) {
      throw new Error('Invalid user ' + name + aadhar + '. user does not exist in the system.');
    } else {

    let coins = user.upgradCoins;
    let updatedCoins = parseInt(coins) + parseInt(amount);

    let UserObject = {
      name: name,
      email: user.email,
      phno: user.phno,
      aadhar: aadhar,
      upgradCoins: updatedCoins
    };

        // Convert the JSON object to a buffer and send it to blockchain for storage
        let dataBuffer = Buffer.from(JSON.stringify(UserObject));
        await ctx.stub.putState(userKey, dataBuffer);
        // Return value of new student account created to user
        return UserObject;

      }
      }

      async viewUser(ctx, name, aadhar) {
        // Create a new composite key for the new user account
        const userKey    = ctx.stub.createCompositeKey('org.property-registration-network.regnet.user', [name,aadhar]);

        let user = await ctx.stub
            .getState(userKey)
            .catch(err => console.log(err));

        return JSON.parse(user.toString());
      }


  async createUserRequest(ctx, name, email, phno, aadhar) {
    // Create a new composite key for the new user account
    const userReqKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.request', [name,aadhar]);

    // Create a user object to be stored in blockchain
    let newUserReqObject = {
      name: name,
      email: email,
      phno: phno,
      aadhar: aadhar,
      createdAt: new Date()
    };

    // Convert the JSON object to a buffer and send it to blockchain for storage
    let dataBuffer = Buffer.from(JSON.stringify(newUserReqObject));
    await ctx.stub.putState(userReqKey, dataBuffer);
    // Return value of new student account created to user
    return newUserReqObject;
  }

  async createPropertyRequest(ctx, propertyID, price, name, aadhar) {
    // Create a new composite key for the new user account
    let msgSender = ctx.clientIdentity.getID();
    const userKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.user', [name,aadhar]);
    const propReqKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.request', [propertyID]);


    // Check if the user creating the property request is an approved user of the system
    let userBuffer = await ctx.stub
        .getState(userKey)
        .catch(err => console.log(err));

    if (userBuffer.length === 0) {
          throw new Error('Invalid user ' + name + aadhar + '. user request does not exist in the system. only an approved user can enter his property on the system');
        } else {

    // Create a property object to be stored in blockchain
    let newPropReqObject = {
      propertyID: propertyID,
      owner: [name,aadhar],
      price: price,
      status: 'registered'
    };

    // Convert the JSON object to a buffer and send it to blockchain for storage
    let dataBuffer = Buffer.from(JSON.stringify(newPropReqObject));
    await ctx.stub.putState(propReqKey, dataBuffer);

    return newPropReqObject;
  }
  }

  //to be moved to usercontract
*/
  /**
	 * approve new user details from the request asset in the blockchain
	 * @param ctx - The transaction context
	 * @param name - name of the user to be approved
   * @param aadhar - Aadhar of the user to be approved
	 * @returns
	 */
	async approveNewUser(ctx, name, aadhar) {
		// Create the composite key required to fetch record from blockchain
//    let msgSender    = ctx.clientIdentity.getID();
		const userReqKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.request', [name,aadhar]);
    const userKey    = ctx.stub.createCompositeKey('org.property-registration-network.regnet.user', [name,aadhar]);

		// Return value of user request asset from blockchain
		let userReqBuffer = await ctx.stub
				.getState(userReqKey)
				.catch(err => console.log(err));

    let user = JSON.parse(userReqBuffer.toString());

    //Return value of user from Blockchain
    let userBuffer = await ctx.stub
				.getState(userKey)
				.catch(err => console.log(err));

		// Make sure that user Request already exists and user with given name and aadhar does not exist.
    if (userReqBuffer.length === 0 || userBuffer.length !== 0) {
			throw new Error('Invalid user ' + name + aadhar + '. Either user request does not exist or user already exists.');
		} else {

    let newUserObject = {
      name: name,
      email: user.email,
      phno: user.phno,
      aadhar: aadhar,
      upgradCoins: 0
    };

    // Convert the JSON object to a buffer and send it to blockchain for storage
    let dataBuffer = Buffer.from(JSON.stringify(newUserObject));
    await ctx.stub.putState(userKey, dataBuffer);
    // Return value of new student account created to user
    return newUserObject;
  }

	}

  /**
	 * approve new property details from the request asset in the blockchain
	 * @param ctx - The transaction context
	 * @param propertyID - name of the user to be approved
	 * @returns
	 */
	async approvePropertyRegistration(ctx, propertyID) {
		// Create the composite key required to fetch record from blockchain
//    let msgSender    = ctx.clientIdentity.getID();
		const propertyReqKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.request', [propertyID]);
    const propertyKey    = ctx.stub.createCompositeKey('org.property-registration-network.regnet.property', [propertyID]);

		// Return value of property request asset from blockchain
		let propertyReqBuffer = await ctx.stub
				.getState(propertyReqKey)
				.catch(err => console.log(err));

    let property = JSON.parse(propertyReqBuffer.toString());

    //Return value of property from Blockchain
    let propertyBuffer = await ctx.stub
				.getState(propertyKey)
				.catch(err => console.log(err));

		// Make sure that property Request already exists and property with given name and aadhar does not exist.
    if (propertyReqBuffer.length === 0 || propertyBuffer.length !== 0) {
			throw new Error('Invalid property ' + propertyID + '. Either property request does not exist or property already exists.');
		} else {

    let newPropertyObject = {
      propertyID: propertyID,
      owner: property.owner,
      price: property.price,
      status: property.status
    };

    // Convert the JSON object to a buffer and send it to blockchain for storage
    let dataBuffer = Buffer.from(JSON.stringify(newPropertyObject));
    await ctx.stub.putState(propertyKey, dataBuffer);
    // Return value of new student account created to user
    return newPropertyObject;
  }

	}


  //function to view users in the system with their name and aadhar
  async viewUser(ctx, name, aadhar) {
    // Create a new composite key for the user account
    const userKey    = ctx.stub.createCompositeKey('org.property-registration-network.regnet.user', [name,aadhar]);

    let user = await ctx.stub
        .getState(userKey)
        .catch(err => console.log(err));

    return JSON.parse(user.toString());

  }

  //function to view property in the system using the propertyID
  async viewProperty(ctx, propertyID) {
    // Create a new composite key for the new user account
    const propertyKey    = ctx.stub.createCompositeKey('org.property-registration-network.regnet.property', [propertyID]);

    let property = await ctx.stub
        .getState(propertyKey)
        .catch(err => console.log(err));

    return JSON.parse(property.toString());

  }
}

module.exports = RegistrarContract;
