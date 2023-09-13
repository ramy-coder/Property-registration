# Property-registration
Project to implement property registration on Blockchain using Hyperledger technology
Implemented as a part of coursework at III-B on Blockchain

**Stakeholders of the Network**
Users and Registrar( Responsible for User validation and registraion of property)

### Logical Flow
**User registration**
1. A user with permission to access the network raises a request to the registrar to store their data/credentials on the ledger.
2. The request gets stored on the ledger. 
3. The registrar reads the request and stores the user’s data/credentials on the ledger after validating their identity manually.  
4. There is a digital currency called ‘upgradCoins’ associated with each user’s account. All the transactions on this network can be carried out with this currency only. When a user joins the network, they have 0 ‘upgradCoins’

**Property registration**
1. A user added to the Property Registration System raises a request to the registrar to register their property on the network.
2. The request gets stored on the ledger.
3. The registrar reads the request and stores the property on the ledger after validating the data present in the request. 
   
**Property transfer**
1. The owner of the property must put the property on sale.
2. The buyer of the property must ensure that the amount of ‘upgradCoins’ they have is greater than or equal to the price of the property. If not, then the user must recharge their account.
3. If the two criteria above are satisfied, then the ownership of the property changes from the seller to the buyer and ‘upgradCoins’ equal to the price of the property are transferred from the buyer’s account to the seller’s.

### Assets on the Ledger
1. Users: Each user’s data/credentials, such as name, email ID and Aadhar number, need to be captured before they can be allowed to buy/sell properties on the network. The credentials of every user are stored as states on the ledger.
2. Requests: Recall that users need to raise a request to the registrar in order to register themselves on the network or buy property on the ledger. These requests get stored on the ledger.
3. Property: The properties owned by the users registered on the network are stored as assets on the ledger.
