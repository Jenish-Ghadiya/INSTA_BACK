import bcrypt from "bcrypt";
import UserSchema from "../../models/user.model.js";
export default {
    handler: async (req, res) => {
        try {
            const id = req.user.id;
            const { password, newPassword } = req.body;
            const user = await UserSchema.findById(id);
            if (!user) 
                return res.status(404).json({ message: "user not found" });
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch){
                return res.status(400).json({ message: "invalid password" });
            }
            if (password === newPassword){
                return res.status(400).json({ message: "new password cannot be same as old password" });
            }
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            await UserSchema.findByIdAndUpdate(id, {
                password: hashedPassword,
            });

            return res.status(200).json({ message: "password updated successfully" });
        } catch (error) {
            return res.status(500).json({ message: "internal server error" });
        }
    },
};
