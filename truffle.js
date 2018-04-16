module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    dev: {
      host: "127.0.0.1",
      port: 9545,
      network_id: "*"
    },
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777" // Match any network id
    },
    live: {
      network_id: 3,
      host: "127.0.0.1",
      gas: 4612388,
      gasPrice: 25000000000,
      port: "8545"   // Different than the default below
    }
  }
};
