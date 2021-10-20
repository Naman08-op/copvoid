
self.window = self // This is required for the jsencrypt library to work within the web worker

// Import the jsencrypt library
self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/jsencrypt/3.2.1/jsencrypt.min.js');
self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js');

let crypt = null
let privateKey = null


/** Webworker onmessage listener */
onmessage = function(e) {
  const [ messageType, messageId, text,signature, key ] = e.data
  let result
  switch (messageType) {
    case 'generate-keys':
      result = generateKeypair()
      break
    case 'encrypt':
      result = encrypt(text, key)
      break
    case 'decrypt':
      result = decrypt(text)
      break
    case 'sign':
      result = sign(text)
      break
    case 'verify':
      result = verify(text,signature,key)
      break
  }

  // Return result to the UI thread
  postMessage([ messageId, result ])
}

/** Generate and store keypair */
function generateKeypair () {
  crypt = new JSEncrypt({default_key_size: 2056})
  privateKey = crypt.getPrivateKey()
  // Only return the public key, keep the private key hidden
  return crypt.getPublicKey()
}

/** Encrypt the provided string with the destination public key */
function encrypt (content, publicKey) {
  crypt.setKey(publicKey)
  return crypt.encrypt(content)
}

/** Decrypt the provided string with the local private key */
function decrypt (content) {
  crypt.setKey(privateKey)
  return crypt.decrypt(content)
}

// function sign(content){
//   var sig = new KJUR.crypto.Signature({"alg": "SHA1withRSA"});
// sig.init(privateKey);
// sig.updateString(content);
// var signature=  sig.sign();
// return signature;
// }

// function verify(content,signature,publicKey){
//   var sig = new KJUR.crypto.Signature({"alg": "SHA1withRSA"});
//   var sig2 = new KJUR.crypto.Signature({"alg": "SHA1withDSA"});
//   sig2.init(publicKey);
//   sig.updateString(content);
//   var isValid=  sig2.verify(signature);
//   if(isValid){
//     return content;
//   }
//   else{
//     return "Signature wasn't verified"
//   }
// }
function sign(content){
  
  crypt.setPrivateKey(privateKey);
  var signature= crypt.sign(content, CryptoJS.SHA256,"sha256")
  console.log(signature,'------------------------')
  return signature
  
}

function verify(content,sign,publicKey){
  crypt.setPublicKey(publicKey);
  console.log(sign,'keyyy',publicKey)
const isVerified= crypt.verify(content,sign,CryptoJS.SHA256)
  if(isVerified){
return (content);
  }
  else{
    return ' Digital signature not verified'
  }
    
  
  
}