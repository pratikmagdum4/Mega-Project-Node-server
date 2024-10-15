import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  mobile: { type: String, default: "" },
  email: { type: String, default: "" },
  password: { type: String, default: "" },
});

const UserSchema = mongoose.model(
    "UserModel",
    userSchema
)

const userSchemaData = new mongoose.Schema({
  Entries: { type: String, default: "" },
  

});
const UserSchemaDAta = mongoose.model("UserDAtaModel", userSchema);


export { UserSchemaDAta,UserSchema};