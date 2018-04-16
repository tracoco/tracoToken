pragma solidity ^0.4.17;

import '../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';
import '../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol';
import '../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol';
import './MarketData.sol';
import './TracoMarket.sol';

contract TracoAsset is Ownable, ERC721Token {
  using SafeMath for uint256;

  MarketData _m;
  address market;
  uint256 minted;
  mapping(uint256 => bytes32) tokenHash;
  mapping(bytes32 => bool) usedHash;
 
  function TracoAsset(string _name, string _symbol, address _marketData, address _market)
    ERC721Token(_name, _symbol) public {
    _m = MarketData(_marketData);
    market = _market;
    minted = 0;
  }

  event NewHash(bytes32 hash);
  
  function mint(address _to, string _uri, bytes32 _hash) payable external {
    if (msg.value < _m.getFX()) revert();
    require(usedHash[_hash]!=true);
    tokenURIs[minted] = _uri;
    tokenHash[minted] = _hash;
    usedHash[_hash] = true;
    super._mint(_to, minted);
    minted = minted.add(1);
    emit NewHash(_hash);
  }

  function burn(address _owner, uint256 _tokenId) public {
    usedHash[tokenHash[_tokenId]] = false;
    super._burn(_owner, _tokenId);
  }

  function list(uint256 _tokenId, uint256 price) public {
    require(ownerOf(_tokenId) == msg.sender);
    TracoMarket tm = TracoMarket(market);
    tm.mint(msg.sender, this, '', _tokenId, price);
    approve(market,_tokenId);
  }
  
  function undoApprove(uint256 _tokenId) public {
    require(msg.sender == market);
    clearApproval(ownerOf(_tokenId), _tokenId);
  }

}
