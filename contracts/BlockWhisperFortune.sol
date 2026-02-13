// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract BlockWhisperFortune {
    string public name = "BlockWhisper Fortune";
    string public symbol = "BWF";
    
    uint256 private _tokenIds;
    mapping(uint256 => address) private _owners;
    struct FortuneData {
        string[] lines;
        string themeColor;
        string emoji;
    }

    mapping(uint256 => FortuneData) private _fortuneData;
    mapping(address => uint256) private _balances;
    
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    
    function mint(string[] memory fortuneLines, string memory themeColor, string memory emoji) public returns (uint256) {
        require(fortuneLines.length > 0, "Fortune cannot be empty");
        _tokenIds++;
        uint256 newItemId = _tokenIds;
        
        _owners[newItemId] = msg.sender;
        
        FortuneData storage data = _fortuneData[newItemId];
        data.lines = fortuneLines;
        data.themeColor = themeColor;
        data.emoji = emoji;
        
        _balances[msg.sender]++;
        
        emit Transfer(address(0), msg.sender, newItemId);
        return newItemId;
    }
    
    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "Token does not exist");
        return owner;
    }
    
    function balanceOf(address owner) public view returns (uint256) {
        require(owner != address(0), "Invalid address");
        return _balances[owner];
    }
    
    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(_owners[tokenId] != address(0), "Token does not exist");
        
        FortuneData memory data = _fortuneData[tokenId];
        string memory svg = generateSVG(data);
        string memory json = generateJSON(tokenId, data, svg);
        
        return string(abi.encodePacked("data:application/json;base64,", base64Encode(bytes(json))));
    }

    function generateSVG(FortuneData memory data) internal pure returns (string memory) {
        string[] memory lines = data.lines;
        string memory textContent = "";
        
        // Calculate starting Y aligned to center
        uint256 lineHeight = 25;
        uint256 totalTextHeight = lines.length * lineHeight;
        uint256 startY = (350 - totalTextHeight) / 2 + 15;

        for(uint i = 0; i < lines.length; i++) {
            textContent = string(abi.encodePacked(
                textContent,
                '<text x="50%" y="',
                toString(startY + (i * lineHeight)),
                '" fill="#fff" font-size="16" font-family="monospace" text-anchor="middle" style="text-shadow: 1px 1px 2px #000">',
                lines[i],
                '</text>'
            ));
        }

        string memory watermark = string(abi.encodePacked(
            '<text x="50%" y="55%" font-size="200" text-anchor="middle" dominant-baseline="middle" opacity="0.1" filter="url(#blur)">',
            data.emoji,
            '</text>'
        ));

        return string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 350 500">',
            '<defs>',
            '<filter id="blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3"/></filter>',
            '<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">',
            '<stop offset="0%" stop-color="#1a1a2e"/>',
            '<stop offset="100%" stop-color="', data.themeColor, '"/>',
            '</linearGradient>',
            '</defs>',
            '<rect width="100%" height="100%" fill="url(#g)"/>',
            watermark,
            '<rect x="15" y="15" width="320" height="470" fill="none" stroke="', data.themeColor, '" stroke-width="2" rx="20"/>',
            textContent,
            '<text x="50%" y="460" fill="', data.themeColor, '" font-size="12" font-family="monospace" text-anchor="middle" letter-spacing="2">BLOCK WHISPER</text>',
            '</svg>'
        ));
    }

    function generateJSON(uint256 tokenId, FortuneData memory data, string memory svg) internal pure returns (string memory) {
        return string(abi.encodePacked(
            '{"name":"BlockWhisper: ', data.emoji, 
            '","description":"Onchain Fortune","attributes":[{"trait_type":"Theme","value":"', data.themeColor, 
            '"}],"image":"data:image/svg+xml;base64,',
            base64Encode(bytes(svg)),
            '"}'
        ));
    }
    
    function toString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
    
    function base64Encode(bytes memory data) internal pure returns (string memory) {
        string memory table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        uint256 len = data.length;
        if (len == 0) return "";
        uint256 encodedLen = 4 * ((len + 2) / 3);
        bytes memory result = new bytes(encodedLen);
        uint256 j = 0;
        for (uint256 i = 0; i < len; i += 3) {
            uint256 a = uint256(uint8(data[i]));
            uint256 b = i + 1 < len ? uint256(uint8(data[i + 1])) : 0;
            uint256 c = i + 2 < len ? uint256(uint8(data[i + 2])) : 0;
            uint256 triple = (a << 16) | (b << 8) | c;
            result[j++] = bytes(table)[((triple >> 18) & 63)];
            result[j++] = bytes(table)[((triple >> 12) & 63)];
            result[j++] = i + 1 < len ? bytes(table)[((triple >> 6) & 63)] : bytes("=")[0];
            result[j++] = i + 2 < len ? bytes(table)[(triple & 63)] : bytes("=")[0];
        }
        return string(result);
    }
}
