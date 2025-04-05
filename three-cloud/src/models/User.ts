import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema({
  user_name: {
    type: String,
  },
  user_email: {
    type: String,unique: true
  },
  user_account_id: {
    type: String, unique: true
  },
});

const User = models.User || mongoose.model("user", userSchema);
export default User;
