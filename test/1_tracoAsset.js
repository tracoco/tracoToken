var MarketData = artifacts.require("../contracts/MarketData.sol");
var TracoAsset = artifacts.require("./TracoAsset.sol");
var TracoMarket = artifacts.require("./TracoMarket.sol");

var fx = 0;

contract('MarketData', function(accounts) {
  var expected = 2500001234567890;
  it('says exchange rate is ' + expected, function() {
    return MarketData.deployed().then(function(instance) {
      return instance.update(expected).then(function() {
        return instance.getFX();
      }).then(function(_fx) {
        fx = _fx;
        assert.equal(fx.valueOf(), expected, 'Exchange rate is not updated to ' + expected);
      });
    });
  });
});

var market = null;

contract('TracoMarket', function(accounts) {
  it('has symbol', function() {
    return TracoMarket.deployed().then(function(instance) {
      market = instance;
      return market.symbol().then(function(s) {
        return s;
      }).then(function(s) {
        assert.equal(s, 'TRM', 'Symbol is not TRM');
      });
    });
  });
});

var tracoAsset = null;

contract('TracoAsset', function(accounts) {
  it('has symbol', function() {
    return TracoAsset.deployed().then(function(instance) {
      tracoAsset = instance;
      return tracoAsset.symbol().then(function(s) { 
        return s;
      }).then(function(s) {
        assert.equal(s, 'TRA', 'Symbole is not TRA');
      });
    });
  });
  var hash = new String('0xf44bff3e09bdd07a1413a89a37dace563de9ce879b415dac5e46f789fb5592c5');
  var hash1 = new String('0xc41d34fe321b7567308b59de5be58eda2b4ab62e2f2a9126dfe49724ff326a10');
  it('can mint token for asset', function() {
    var uri = 'testuri';
    return tracoAsset.mint(accounts[1],uri,hash.valueOf(), {value: fx}).then(function(event) {
      assert.equal(event.logs[1].args.hash,hash.valueOf(),'NewHash event OK');
      tracoAsset.totalSupply().then(function(s) {
        assert.equal(s, 1, 'is not minted');
      });
      tracoAsset.ownerOf(0).then(function(s) {
        assert.equal(s, accounts[1], 'Owner is not set properly');
      });
      return tracoAsset.tokenURI(0).then(function(s) {
        assert.equal(s, uri, 'URI is wrong');
      });
    });
    return res;
  });
  it('can\'t mint token with same hash', function() {
    try {
      return tracoAsset.mint(accounts[1],uri,hash.valueOf(), {value: fx}).then(function(s) {
        assert(false, 'Duplicated hash');
      });
    } catch (e) {
      console.log('Passed: duplicated hash is rejected');
    }
  });
  it('can mint more', function() {
    return tracoAsset.mint(accounts[1],'',hash1.valueOf(), {value: fx}).then(function(event) {
      tracoAsset.totalSupply().then(function(s) {
        assert.equal(s, 2, 'is not minted');
      });
    });
  });
  it('can be transfered', function() {
    return tracoAsset.transferFrom(accounts[1], accounts[2],0,{from:accounts[1]}).then(function() {
      return tracoAsset.ownerOf(0).then(function(s) {
        assert.equal(s, accounts[2], 'Owner is not set properly');
      });
    });
  });
  it('can approve transfer', function() {
    return tracoAsset.approve(accounts[3],0,{from:accounts[2]}).then(function() {
      tracoAsset.getApproved(0).then(function(s) {
        assert.equal(s, accounts[3], 'Approve failed');
      });
      return tracoAsset.transferFrom(accounts[2], accounts[4],0,{from:accounts[3]}).then(function() {
        return tracoAsset.ownerOf(0).then(function(s) {
          assert.equal(s, accounts[4], 'TransferFrom failed');
        });
      });
    });
  });
  it('can list TracoAsset at market by owner', function() {
    return tracoAsset.list(0, fx, {from:accounts[4]}).then(function() {
      tracoAsset.getApproved(0).then(function(s) {
        assert.equal(s, market.address, 'Approve failed');
      });
      market.totalSupply().then(function(s) {
        assert.equal(s,1, 'Market supply wrongly.');
      });
      return market.ownerOf(0);
    }).then(function(s) {
      assert.equal(s, accounts[0], 'List went north.');
    });
  });
  it('can withdraw from market', function() { 
    return market.buy(tracoAsset.address, 0, {from: accounts[4], value: 0}).then(function() {
      return market.totalSupply();
    }).then(function(s) {
      assert.equal(s.toNumber(), 0, 'Withdraw failed.');
    });
  });
  it('can be burnt by payer', function() {
    return tracoAsset.list(0, fx, {from:accounts[4]}).then(function() {
      market.marketTokens(0).then(function(s) {
        assert.equal(s[0], tracoAsset.address, 'Address is wrong');
        assert.equal(s[3], accounts[4], 'Owner wrong');
      });
      return market.buy(tracoAsset.address, 0, {from: accounts[1], value: fx}).then(function() {
        tracoAsset.getApproved(0).then(function(s) {
          assert.equal(s, 0, 'Approval wrong');
        });
        return tracoAsset.ownerOf(0).then(function(s) {
          assert.equal(s, accounts[1], 'Owner is not set properly');
        });
      });
    });
  });
});
