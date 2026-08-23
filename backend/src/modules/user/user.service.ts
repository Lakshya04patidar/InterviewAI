import { User } from "./user.model";
import { AppError } from "../../shared/errors/AppError";
import { UpdateProfileInput } from "./user.validation";
import bcrypt from "bcrypt";

export const updateUserProfile = async (
    userId: string,
    input: UpdateProfileInput
 ) => {
    const user = await User.findById(userId);

    if(!user){
        throw new AppError("User not found", 404);
    }

    if(input.fullName !== undefined){
        user.fullName = input.fullName;
    }
    
    if(input.avatar !== undefined){
        user.avatar = input.avatar;
    }

    await user.save();

    return {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        provider: user.provider,
        isEmailVerified: user.isEmailVerified,
        avatar: user.avatar,
        lastLogin: user.lastLogin,
        updatedAt: user.updatedAt,
    };
};

export const changeUserPassword = async (
  userId: string,
  currentPassword: string,
  newPassword: string
) => {
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (!user.password) {
    throw new AppError("Password hash not found", 500);
  }

  const isCurrentPasswordValid = await bcrypt.compare(
    currentPassword,
    user.password
  );

  if (!isCurrentPasswordValid) {
    throw new AppError("Current password is incorrect", 401);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  user.password = hashedPassword;

  await user.save();

  return true;
};

export const deleteUserAccount = async(userId: string) => {
    const user = await User.findById(userId);

    if(!user){
        throw new AppError("User not found", 404);
    }

    await User.findByIdAndDelete(userId);

    return true;
}