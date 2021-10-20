
self.window = self 

self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/jsencrypt/3.2.1/jsencrypt.min.js');
self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js');

let crypt = null
let privateKey = null


onmessage = function(e) {
  const [ messageType, messageId, text,signature, key ] = e.data
  let result
  switch (messageType) {
    case 'generate-keys':
      result = generateKeypair()
      break
    
    case 'sign':
      result = sign(text)
      break
    case 'verify':
      result = verify(text,signature,key)
      break
  }

  postMessage([ messageId, result ])
}

function generateKeypair () {
  crypt = new JSEncrypt({default_key_size: 2056})
  privateKey = crypt.getPrivateKey()
  return crypt.getPublicKey()
}




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