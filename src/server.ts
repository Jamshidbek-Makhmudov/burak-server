import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import app from "./app";

mongoose
.connect(process.env.MONGO_URL as string, {})
.then((data) => {
  console.log("Mongodb connection succed");
  const PORT = process.env.PORT ?? 3000;
  app.listen(PORT, function() {
    console.log(`The server is running successfully on port: ${PORT}`);
    console.log(`Admin project on http://localhost:${PORT}/admin \n`)
  })
})
.catch((err) =>console.log("ERROR on cinection MongoDB", err));