var MarketData = artifacts.require("MarketData.sol");
var TracoMarket = artifacts.require("TracoMarket.sol");
var TracoAsset = artifacts.require("TracoAsset.sol");

module.exports = function(deployer) {
  return deployer.deploy(MarketData).then(function() {
    return deployer.deploy(TracoMarket).then(function() {
      return deployer.deploy(TracoAsset, 'Traco', 'TRA', MarketData.address, TracoMarket.address, {
        //from: '0x152aCb6948b32F4aBF516B7b2B6D1c14f6Cde178',  
        gas: 4600000,
        gasPrice: 25000000000});
    });
  });
};
