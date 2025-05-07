const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("mongodb Connected Successfully");
    })
    .catch((err) => {
      console.log("mongodb error ", err);
    });
};



module.exports=dbConnection