pragma solidity ^0.4.17;
pragma experimental ABIEncoderV2;

import '../node_modules/zeppelin-solidity/contracts/token/ERC721/ERC721Token.sol';
import '../node_modules/zeppelin-solidity/contracts/ownership/Ownable.sol';
import '../node_modules/zeppelin-solidity/contracts/math/SafeMath.sol';

contract TracoAsset1 {
  function transferFrom(address, address, uint256) public;
  function balanceOf(address) public returns (uint256);
  function undoApprove(uint256) public;
  function ownerOf(uint256) public returns (address);
}

contract TracoMarket is ERC721Token, Ownable {
  using SafeMath for uint256;
  uint256 minted;
 
  struct MarketToken {
    address tokenTracoAsset;
    uint256 tokenId;
    uint256 tokenPrice;
    address tokenOwner;
  }

  mapping(uint256 => MarketToken) public marketTokens; 
  mapping(address => mapping(uint256 => uint256)) assetToMarketToken;

  function TracoMarket()
    ERC721Token("TracoMarket", "TRM") public {
    minted = 0;
  }
  
  function mint(address _owner, address _tracoAssetAddr, string _uri, uint256 _tokenId, uint256 _price) external {
    uint256 id = minted;
    tokenURIs[id] = _uri;
    marketTokens[id] = MarketToken({tokenTracoAsset: _tracoAssetAddr,
      tokenId: _tokenId,
      tokenPrice: _price,
      tokenOwner: _owner
    });
    assetToMarketToken[_tracoAssetAddr][_tokenId] = id;
    super._mint(owner, id);
    minted = minted.add(1);
  }

  function buy(address _tracoAssetAddr, uint256 _tokenId) payable public {
    MarketToken memory _t = marketTokens[assetToMarketToken[_tracoAssetAddr][_tokenId]];
    require(msg.value >=  _t.tokenPrice
        || msg.sender == _t.tokenOwner);
    TracoAsset1 _a = TracoAsset1(_tracoAssetAddr);
    if (msg.sender != _t.tokenOwner) {
      _a.transferFrom(_a.ownerOf(_tokenId), msg.sender, _tokenId);
    } else {
      _a.undoApprove(_tokenId);
    }
    super._burn(owner, assetToMarketToken[_tracoAssetAddr][_tokenId]);
  }

}
