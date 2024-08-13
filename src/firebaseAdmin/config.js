import * as admin from "firebase-admin"

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId:'pattykulcha',
            clientEmail:'firebase-adminsdk-gw31r@pattykulcha.iam.gserviceaccount.com',
            privateKey:"-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC441Z2R280nb6q\nskLOgfrDhs29QfcQcIO8Yw4Zq1bKSyYr5NVklsu7r8WbzV6DkqgGrF5ZMKtxudID\n7Lk0S8TJOEkAspTg84ziItmT4Nr+QVlvz2aptXl0KPMH/3toWel/Lv2g5tt0CMEH\nA8HYpg+5tlMnJeoBDmKJJAnDTqDpzCehkk6UyIBmZ8aJgg9ZjLbhX2EQhbr75cwi\nPUTXBE7IzsLcN/ee8b3+8b4m/pfv3xqzdyE6ebc76rTdPWpeexM27+x30qatvU3T\nAbkdmUQJ8E+CtyztK42QbpBV6Di44BrmooxgQJ8Xe9DlyOwcFDGiDPIn9x7Cr1d4\nk0g8m1N3AgMBAAECggEADHa2425ZXtCrg9JUkptMjlXOFM4Xm7IaD18WGkDkrup1\n/kuE3y0TOunUhnZHwtLmJN0F1zlitV3zfHQ+3/mjoHT85uEjDC8e9jenN0LXQICj\nSNhQcWxcbao9B/L/HL/C7+H5Exm8/YuBh7mHHdXEBZ726BK0PbH8joYxaksoqdoO\nE9c18vBF1z7hY/MXzxVfvPwRrmIzAhfYEPfh1cClJoEsZYtd3ckU9qJXOR3IUUIH\nbdGilo2VYcvuRTJcZG8k5YDXNvH5Z8ALRZ/nOepGesZBCR/l3fWpbYeW2c7gLtQK\n0teMWk0ROwfNhV6UdUNTvwPHvZeXyCv1jlS5qUa5YQKBgQDc+bo9P28l3V//a07A\nwHeILr7deLQacSosB+2LKGvinOwos8/kVfJdmkK/9nWHjpmvx14QDJqSQrv2Fc/u\nDM4eeyh4TYmiSMI/MnCGrBexNVWj3E3X+4iOR/ROTmupwWui82jhM3YiMGfMxdEa\nTbSTssevVVSYiKL89tGo7ZwBKQKBgQDWMVSLlpT92f7RRKXR4/6m+GdXh16Vg/ZB\nmxFUiBed7/OV8bhrwgwUu99xak5XPnv2OvUAeu2iZtqbBQtZ2pFpvpNgtUimMTXB\nABuiwDlZ+9klXrzUqZSpklstb5I69r8fIKHmZzufjEbcEzbfmymreVKLZ/BwOKwu\nVgy4G94jnwKBgGYWRREoriu7Ey+IHrDz+gUDO5BLxED3CPmgjACfIwBlaMEBGUku\n37KYor/Wl8ORgLTxkSYu/HYXuIhe2VnrtonkcfTqNWyw2nSh09STyrpGnpL+I0Rl\n41eALIDEv/6D6js04r4vrSLsY/f5Z7oULhmSHaiF7ngtn8boLEIzy7/JAoGBAK4j\nAupNbSoIrhsypWFD7AeRUmsd2i7ST0W9LVS9I/46U53nHBk3dJzytNE/LRvO5/ci\nrYdLaaEr37RCYJ0XjjsbPjRUjhDXVy1myhECGF5o23x/TiPTDtLh8xC4cXlQm8dR\nv25TJW0sHXvUfztBqZoIE6zUvuxtlsZBHSwdM/dfAoGANu9OrStaCZvgvUy+uLHa\ndkfNxtNrJ9GDjhWBwuuDU3YTGCxjjZ5HXpK2PX3XjAMXe5GGNjUonsP1lSwGpUtm\nENRQ+39e0FVwmU/1+cB+/i05uUWEXvujd4L39EsQFxv6JsnyD8k5K7GB+wVSvBoZ\nEBaaFd8rkhn3q/E1Gg9/RLs=\n-----END PRIVATE KEY-----\n".replace(/\\n/g,"\n")
        })
    })
    
}


export { admin }