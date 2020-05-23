import * as admin from "firebase-admin";
import { clientEmail, privateKey, projectId } from "../config";

export const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert({
    clientEmail: clientEmail,
    privateKey: privateKey.replace(/\\n/g, "\n"),
    projectId: projectId,
  }),
  databaseURL: "https://instagram-clone-45dc4.firebaseio.com",
});
