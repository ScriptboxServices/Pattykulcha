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


export const formatTimestampToCustomDate = (timestamp) => {
    const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
  
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
  
    return `${day}-${month}-${year} ${String(hours).padStart(2, '0')}:${minutes}:${seconds} ${ampm}`;
}

export const formatPhoneNumber = (value) => {
    // Remove all non-numeric characters
    const cleaned = ('' + value).replace(/\D/g, '');

    // Format the number as (XXX) XXX-XXXX
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      return (
        (match[1] ? `(${match[1]}` : '') +
        (match[2] ? `) ${match[2]}` : '') +
        (match[3] ? `-${match[3]}` : '')
      );
    }

    return value;
  };