const { MongoClient } = require('mongodb');
const dotenv = require("dotenv")

dotenv.config()

async function main(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const uri = process.env.MONGODB_URI;  
  
    const client = new MongoClient(uri);
  
    try {
        // Connect to the MongoDB cluster
        await client.connect();
  
        // Make the appropriate DB calls
        await  listDatabases(client);
  
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
  }
  
  
  main().catch(console.error);

  async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};
 