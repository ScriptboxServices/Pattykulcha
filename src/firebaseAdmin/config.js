import * as admin from "firebase-admin"

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId:process.env.NEXT_PUBLIC_PROJECT_ID,
            clientEmail: process.env.NEXT_PUBLIC_CLIENT_EMAIL,
            privateKey:process.env.NEXT_PUBLIC_PRIVATE_KEY.replace(/\\n/g,"\n")
        })
    })
    
}


export { admin }