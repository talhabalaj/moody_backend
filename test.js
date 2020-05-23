console.log(
  Buffer.from(`${process.env.FIREBASE_BASE64}`, "base64").toString("ascii")
);
