'use strict';

const {Contract} = require('fabric-contract-api');

class UserContract extends Contract {

	constructor() {
		// Provide a custom name to refer to this smart contract
		super('org.property-registration-network.regnet.usercontract');
	}


	// print the success message on console on startup
	async instantiate(ctx) {
		console.log('Regnet User Smart Contract Instantiated');
	}

	/**
	 * Create a new user account request on the network
	 * @param ctx - The transaction context object
	 * @param name - Name of the user
	 * @param email - Email ID of the user
   * @param phno - Phone no of the user
   * @param aadhar - Aadhar ID of the user
	 * @returns
	 */
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

//function to view users in the system with their name and aadhar
  async viewUser(ctx, name, aadhar) {
    // Create a new composite key for the new user account
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

  //function to recharge upgradCoins to the user account
  async rechargeAccount(ctx, name, aadhar, banktxnId) {
    // Create a new composite key for the user account
    const userKey    = ctx.stub.createCompositeKey('org.property-registration-network.regnet.user', [name,aadhar]);

    //Return value of user from Blockchain
    let userBuffer = await ctx.stub
				.getState(userKey)
				.catch(err => console.log(err));

    let user = JSON.parse(userBuffer.toString());

    //defining an array to map the banktxnId with the amount of coins

    var bankTxnMapArr = { "upg100": 100, "upg500": 500, "upg1000": 1000,"upg5000": 5000, "upg10000": 10000 };

    let amount = bankTxnMapArr[banktxnId];

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
  //      upgradCoins: amount
      };


    // Convert the JSON object to a buffer and send it to blockchain for storage
    let dataBuffer = Buffer.from(JSON.stringify(UserObject));
    await ctx.stub.putState(userKey, dataBuffer);
    // Return value of new student account created to user
    return UserObject;

  }
  }


  /**
   * Create a new property request on the network
   * @param ctx - The transaction context object
   * @param propertyID - ID of the property
   * @param price - price of the property
   * @param name - name of the owner
   * @param aadhar - Aadhar ID of the owner
   * @returns
   */

  async createPropertyRequest(ctx, propertyID, price, name, aadhar) {
    // Create a new composite key for the new user account
    //let msgSender = ctx.clientIdentity.getID();
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

  async updateProperty(ctx, propertyID, name, aadhar, updatedStatus) {
    // Create a property composite key for the property

    const userKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.user', [name,aadhar]);
    const propertyKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.property', [propertyID]);


    // Check if the user updating the property request is an approved user of the system
    let userBuffer = await ctx.stub
				.getState(userKey)
				.catch(err => console.log(err));

    let propertyBuffer = await ctx.stub
				.getState(propertyKey)
				.catch(err => console.log(err));

    let property = JSON.parse(propertyBuffer.toString());

    if (userBuffer.length === 0 || propertyBuffer.length === 0) {
          throw new Error('Invalid user or' + name + aadhar + 'property' + propertyID + '. Only an approved user or a property that already exists can be updated in the system');
        } else {

    // Create a property object to be stored in blockchain
    let updatedPropObject = {
      propertyID: propertyID,
      owner: property.owner,
      price: property.price,
      status: updatedStatus
    };

    // Convert the JSON object to a buffer and send it to blockchain for storage
    let dataBuffer = Buffer.from(JSON.stringify(updatedPropObject));
    await ctx.stub.putState(propertyKey, dataBuffer);

    return updatedPropObject;
  }
  }

  async purchaseProperty(ctx, propertyID, name, aadhar) {
    // Create a property composite key for the property

    const userKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.user', [name,aadhar]);
    const propertyKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.property', [propertyID]);



    // Check if the user updating the property request is an approved user of the system
    let userBuyer = await ctx.stub
				.getState(userKey)
				.catch(err => console.log(err));

    let property = await ctx.stub
				.getState(propertyKey)
				.catch(err => console.log(err));


    let propertyStr = JSON.parse(property.toString());
    let userBuyerStr = JSON.parse(userBuyer.toString());


    const sellerKey = ctx.stub.createCompositeKey('org.property-registration-network.regnet.user', propertyStr.owner);

    let sellerBuffer = await ctx.stub
          .getState(sellerKey)
          .catch(err => console.log("Seller not found",err));

    let seller = JSON.parse(sellerBuffer.toString());

    if (userBuyer.length === 0 || property.length === 0) {
          throw new Error('Invalid user or' + name + aadhar + 'property' + propertyID + '. Only an approved user or a property that already exists can be updated in the system');
        } else {

   if(propertyStr.status === "onSale" && (parseInt(propertyStr.price) < parseInt(userBuyerStr.upgradCoins)))
	 // if(parseInt(propertyStr.price) < parseInt(userBuyerStr.upgradCoins))
	//if(propertyStr.status === "onSale")
    {
      let updatedCoins = parseInt(seller.upgradCoins) + parseInt(propertyStr.price);
      // Create a user object of the seller with updated upgradCoins balance to be stored in blockchain
      let updatedSellerObject = {
        name: seller.name,
        email: seller.email,
        phno: seller.phno,
        aadhar: seller.aadhar,
        upgradCoins: updatedCoins
  		};

      // Convert the JSON object to a buffer and send it to blockchain for storage
      let dataBuffer = Buffer.from(JSON.stringify(updatedSellerObject));
      await ctx.stub.putState(sellerKey, dataBuffer);


      // Create a user object of the buyer with updated upgradCoins balance to be stored in blockchain

      let updatedCoinsBuyer = parseInt(userBuyerStr.upgradCoins) - parseInt(propertyStr.price);

      let updatedBuyerObject = {
        name: userBuyerStr.name,
        email: userBuyerStr.email,
        phno: userBuyerStr.phno,
        aadhar: userBuyerStr.aadhar,
        upgradCoins: updatedCoinsBuyer
      };

      // Convert the JSON object to a buffer and send it to blockchain for storage
      let dataBufferBuyer = Buffer.from(JSON.stringify(updatedBuyerObject));
      await ctx.stub.putState(userKey, dataBufferBuyer);


      // Create a property object with updated ownership details to be stored in blockchain
      let updatedPropObject = {
        propertyID: propertyID,
        owner: [name,aadhar],
        price: propertyStr.price,
        status: 'registered'
      };

      // Convert the JSON object to a buffer and send it to blockchain for storage
      let dataBufferProperty = Buffer.from(JSON.stringify(updatedPropObject));
      await ctx.stub.putState(propertyKey, dataBufferProperty);

      return updatedPropObject;

    }
    else{
      throw new Error('Property Not on sale or buyer Balance lower than the price of the property ' +  propertyID);
    }
  }
  }


}
	module.exports = UserContract;
