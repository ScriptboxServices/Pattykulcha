import CryptoJS from "crypto-js";

export const encrypt = (plan_data) => {
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(plan_data), process.env.NEXT_PUBLIC_CRYPTO_SK).toString();

    return encryptedData
}

export const decrypt = (encrypt_data) => {
    const bytes = CryptoJS.AES.decrypt(encrypt_data, process.env.NEXT_PUBLIC_CRYPTO_SK);
    const originalData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return originalData
}

export const formatTimestampToDDMMYYYY = (timestamp) => {
    const date = new Date(timestamp?.seconds * 1000); // Convert seconds to milliseconds
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed in JS
    const year = String(date.getFullYear()) // Get the last two digits of the year
  
    return `${day}-${month}-${year}`;
  }