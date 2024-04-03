import { central, db1, db2, db3, vault } from "./databases.js";

// Define the dbs object with references to db1, db2, and db3
const dbs = {
  db1: db1,
  db2: db2,
  db3: db3
};

// Function to get user data based on id
async function getUserData(id) {
  try {
    // Fetch the identifier of the database containing user data
    const databaseIdentifier = await central(id);

    // Check if the database identifier exists in the dbs object
    if (!(databaseIdentifier in dbs)) {
      throw new Error(`Database '${databaseIdentifier}' not found`);
    }

    // Create an array of promises to fetch user data from different databases
    const promises = [
      dbs[databaseIdentifier](id), // Fetch user data from the appropriate database
      vault(id) // Fetch personal data from the vault database
    ];

    // Use Promise.all() to execute the promises concurrently
    const [userData, personalData] = await Promise.all(promises);

    // Construct the final user object
    const user = {
      id: id,
      name: userData.name,
      username: userData.username,
      email: userData.email,
      address: userData.address,
      phone: userData.phone,
      website: userData.website,
      company: userData.company,
      ...personalData // Merge personal data into the user object
    };

    return user;
  } catch (error) {
    // Handle errors from central, db1, db2, db3, or vault
    return Promise.reject(error);
  }
}

// Example usage
getUserData(1)
  .then(user => console.log(user))
  .catch(error => console.error(error));
