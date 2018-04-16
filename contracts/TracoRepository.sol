pragma solidity ^0.4.17;

import '../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';
import '../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol';

contract TracoRepository is ERC721Token, Ownable {
  
  mapping(uint256 => address) internal tokenAddresses;

  function TracoRepository() ERC721Token('Traco Repository', 'TRR') Ownable() public {
  }

  function tokenAddress(uint256 _tokenId) public view returns (address) {
    require(exists(_tokenId));
    return tokenAddresses[_tokenId];
  }

  function isContract(address _address) public view returns (bool) {
    uint256 size;
    assembly { size := extcodesize(_address) }
    return size > 0;
  }

  function _setTokenAddress(uint256 _tokenId, address _address) internal {
    require(isContract(_address));
    tokenAddresses[_tokenId] = _address;
  }

  function mint(address _to, address _address) public onlyOwner {
    super._mint(_to, totalSupply());
    _setTokenAddress(totalSupply(), _address);
  }

  function burn(address _owner, uint256 _tokenId) public onlyOwner {
    super._burn(_owner, _tokenId);
    delete tokenAddresses[_tokenId];
  }
}
