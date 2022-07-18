"use strict";

// using ethereumjs-util 7.1.3
var ethUtil = require('ethereumjs-util'); // using ethereumjs-abi 0.6.9


var abi = require('ethereumjs-abi'); // using chai 4.3.4


var chai = require('chai');

var typedData = {
  types: {
    EIP712Domain: [{
      name: 'name',
      type: 'string'
    }, {
      name: 'version',
      type: 'string'
    }, {
      name: 'chainId',
      type: 'uint256'
    }, {
      name: 'verifyingContract',
      type: 'address'
    }],
    Person: [{
      name: 'name',
      type: 'string'
    }, {
      name: 'wallet',
      type: 'address'
    }],
    Mail: [{
      name: 'from',
      type: 'Person'
    }, {
      name: 'to',
      type: 'Person'
    }, {
      name: 'contents',
      type: 'string'
    }]
  },
  primaryType: 'Mail',
  domain: {
    name: 'Ether Mail',
    version: '1',
    chainId: 1,
    verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC'
  },
  message: {
    from: {
      name: 'Cow',
      wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
    },
    to: {
      name: 'Bob',
      wallet: '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB'
    },
    contents: 'Hello, Bob!'
  }
};
var types = typedData.types; // Recursively finds all the dependencies of a type

function dependencies(primaryType) {
  var found = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (found.includes(primaryType)) {
    return found;
  }

  if (types[primaryType] === undefined) {
    return found;
  }

  found.push(primaryType);
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = types[primaryType][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var field = _step.value;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = dependencies(field.type, found)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var dep = _step2.value;

          if (!found.includes(dep)) {
            found.push(dep);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator["return"] != null) {
        _iterator["return"]();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return found;
}

function encodeType(primaryType) {
  // Get dependencies primary first, then alphabetical
  var deps = dependencies(primaryType);
  deps = deps.filter(function (t) {
    return t != primaryType;
  });
  deps = [primaryType].concat(deps.sort()); // Format as a string with fields

  var result = '';
  var _iteratorNormalCompletion3 = true;
  var _didIteratorError3 = false;
  var _iteratorError3 = undefined;

  try {
    for (var _iterator3 = deps[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
      var type = _step3.value;
      result += "".concat(type, "(").concat(types[type].map(function (_ref) {
        var name = _ref.name,
            type = _ref.type;
        return "".concat(type, " ").concat(name);
      }).join(','), ")");
    }
  } catch (err) {
    _didIteratorError3 = true;
    _iteratorError3 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
        _iterator3["return"]();
      }
    } finally {
      if (_didIteratorError3) {
        throw _iteratorError3;
      }
    }
  }

  return result;
}

function typeHash(primaryType) {
  return ethUtil.keccakFromString(encodeType(primaryType), 256);
}

function encodeData(primaryType, data) {
  var encTypes = [];
  var encValues = []; // Add typehash

  encTypes.push('bytes32');
  encValues.push(typeHash(primaryType)); // Add field contents

  var _iteratorNormalCompletion4 = true;
  var _didIteratorError4 = false;
  var _iteratorError4 = undefined;

  try {
    for (var _iterator4 = types[primaryType][Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
      var field = _step4.value;
      var value = data[field.name];

      if (field.type == 'string' || field.type == 'bytes') {
        encTypes.push('bytes32');
        value = ethUtil.keccakFromString(value, 256);
        encValues.push(value);
      } else if (types[field.type] !== undefined) {
        encTypes.push('bytes32');
        value = ethUtil.keccak256(encodeData(field.type, value));
        encValues.push(value);
      } else if (field.type.lastIndexOf(']') === field.type.length - 1) {
        throw 'TODO: Arrays currently unimplemented in encodeData';
      } else {
        encTypes.push(field.type);
        encValues.push(value);
      }
    }
  } catch (err) {
    _didIteratorError4 = true;
    _iteratorError4 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
        _iterator4["return"]();
      }
    } finally {
      if (_didIteratorError4) {
        throw _iteratorError4;
      }
    }
  }

  return abi.rawEncode(encTypes, encValues);
}

function structHash(primaryType, data) {
  return ethUtil.keccak256(encodeData(primaryType, data));
}

function signHash() {
  return ethUtil.keccak256(Buffer.concat([Buffer.from('1901', 'hex'), structHash('EIP712Domain', typedData.domain), structHash(typedData.primaryType, typedData.message)]));
}

var privateKey = ethUtil.keccakFromString('cow', 256);
var address = ethUtil.privateToAddress(privateKey);
var sig = ethUtil.ecsign(signHash(), privateKey);
var expect = chai.expect;
expect(encodeType('Mail')).to.equal('Mail(Person from,Person to,string contents)Person(string name,address wallet)');
expect(ethUtil.bufferToHex(typeHash('Mail'))).to.equal('0xa0cedeb2dc280ba39b857546d74f5549c3a1d7bdc2dd96bf881f76108e23dac2');
expect(ethUtil.bufferToHex(encodeData(typedData.primaryType, typedData.message))).to.equal('0xa0cedeb2dc280ba39b857546d74f5549c3a1d7bdc2dd96bf881f76108e23dac2fc71e5fa27ff56c350aa531bc129ebdf613b772b6604664f5d8dbe21b85eb0c8cd54f074a4af31b4411ff6a60c9719dbd559c221c8ac3492d9d872b041d703d1b5aadf3154a261abdd9086fc627b61efca26ae5702701d05cd2305f7c52a2fc8');
expect(ethUtil.bufferToHex(structHash(typedData.primaryType, typedData.message))).to.equal('0xc52c0ee5d84264471806290a3f2c4cecfc5490626bf912d01f240d7a274b371e');
expect(ethUtil.bufferToHex(structHash('EIP712Domain', typedData.domain))).to.equal('0xf2cee375fa42b42143804025fc449deafd50cc031ca257e0b194a650a912090f');
expect(ethUtil.bufferToHex(signHash())).to.equal('0xbe609aee343fb3c4b28e1df9e632fca64fcfaede20f02e86244efddf30957bd2');
expect(ethUtil.bufferToHex(address)).to.equal('0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826');
expect(sig.v).to.equal(28);
expect(ethUtil.bufferToHex(sig.r)).to.equal('0x4355c47d63924e8a72e509b65029052eb6c299d53a04e167c5775fd466751c9d');
expect(ethUtil.bufferToHex(sig.s)).to.equal('0x07299936d304c153f6443dfa05f40ff007d72911b6f72307f996231605b91562');