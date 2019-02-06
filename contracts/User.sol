pragma solidity ^0.5.0;

import "./decoder.sol";

contract User {
    struct Person {
        bytes32 name;
        bytes32 id;
        bytes32 addr;
    }
    
    Person person;
    
    address owner;
    event PersonSet(bytes32 name, bytes32 id, bytes32 addr);
    
    modifier verifyOwner(bytes memory _data, bytes memory _signature) {
        bytes32 ethereumDataHash = Decoder.toEthSignedMessageHash(_data);
        require(owner == Decoder.recoverKey(ethereumDataHash, _signature), "message is not from owner");
        _;
    }
    
    constructor(address _owner) public {
        owner = _owner;
    }
    
    function setPerson(bytes memory data, bytes memory signature) public verifyOwner(data, signature) returns(bool) {
        bytes32 name = toBytes32(data, 0);
        bytes32 id = toBytes32(data, 32);
        bytes32 addr = toBytes32(data, 64);
        person = Person(name, id, addr);
        emit PersonSet(name, id, addr);
        return true;
    }
    
    function toBytes32(bytes memory _bytes, uint _start) internal pure returns (bytes32) {
        require(_bytes.length >= (_start + 32));
        bytes32 tempBytes32;
        assembly {
            tempBytes32 := mload(add(add(_bytes, 0x20), _start))
        }
        return tempBytes32;
    }
}