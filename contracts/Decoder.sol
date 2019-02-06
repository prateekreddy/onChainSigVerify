pragma solidity ^0.5.0;


library Decoder {
    
    function recoverKey (
        bytes32 messageHash, 
        bytes memory messageSignature
    )
        public
        pure
        returns (address) 
    {
        if (messageSignature.length != 65) {
            return (address(0));
        }
        uint8 v;
        bytes32 r;
        bytes32 s;
        (v, r, s) = signatureSplit(messageSignature);
        if (v < 27) {
            v += 27;
        }

        // If the version is correct return the signer address
        if (v != 27 && v != 28) {
            return (address(0));
        } else {
            return ecrecover(messageHash, v, r, s);
        }
    }

    /// @dev divides bytes signature into `uint8 v, bytes32 r, bytes32 s`
    /// @param signature concatenated rsv signatures
    function signatureSplit(bytes memory signature)
        public
        pure
        returns (uint8 v, bytes32 r, bytes32 s)
    {
        // The signature format is a compact form of:
        //   {bytes32 r}{bytes32 s}{uint8 v}
        // Compact means, uint8 is not padded to 32 bytes.
        // solium-disable-next-line security/no-inline-assembly
        assembly {
            r := mload(add(signature, 0x20))
            s := mload(add(signature, 0x40))
            v := byte(0, mload(add(signature, 0x60)))
            // v := and(mload(add(signatures, add(signaturePos, 0x41))), 0xff)
        }
    }
    
    function toEthSignedMessageHash(bytes memory data)
    public
    pure
    returns (bytes32)
    {
        return keccak256(
            abi.encodePacked("\x19Ethereum Signed Message:\n96", data)
        );
    }  
}
