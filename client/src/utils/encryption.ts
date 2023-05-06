// 定义加密秘钥
const key = 'a2b7e151628aed2a6abf7158809cf4f3';

// 将字符串类型的key转换为CryptoKey类型
const importKey = async()=>{
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const importedKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      {
        name: 'AES-CBC'
      },
      false,
      ['encrypt', 'decrypt']
    );
    return importedKey;
}

// AES加密函数
export const encrypt = async (data:string)=>{
    const importedKey = await importKey();
    const cipher = await crypto.subtle.encrypt({ name: 'AES-CBC', iv: new Uint8Array(16) }, importedKey, new TextEncoder().encode(data));
    return Array.from(new Uint8Array(cipher)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// AES解密函数
export const decrypt = async (str:string)=>{
    const importedKey = await importKey();
    const buffer = new Uint8Array(str.match(/.{2}/g)!.map(b => parseInt(b, 16)));
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-CBC', iv: new Uint8Array(16) }, importedKey, buffer);
    return new TextDecoder().decode(decrypted);
}
