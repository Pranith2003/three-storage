import { Schema, models, model } from "mongoose";

const userSchema = new Schema({
  user_name: {
    type: String,
  },
  user_email: {
    type: String,
    unique: true,
  },
  user_account_id: {
    type: String,
    unique: true,
  },
});

const User = models.User || model("User", userSchema);
export default User;
