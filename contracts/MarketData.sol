pragma solidity ^0.4.17;

import '../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol';

contract MarketData is Ownable {

  uint ethusd = 2500000000000000; 
    
  function update(uint _ethusd) public onlyOwner {
    ethusd = _ethusd;
  }

  function getFX() public view returns (uint) {
    return ethusd;             
  }
} 
