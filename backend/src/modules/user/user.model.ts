import { Document, Model, Schema, model } from "mongoose";
import {
  AUTH_PROVIDERS,
  USER_ROLES,
  AuthProvider,
  UserRole,
} from "../../shared/constants";

export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string;
  role: UserRole;
  provider: AuthProvider;
  isEmailVerified: boolean;
  avatar?: string;
  lastLogin?: Date;
  refreshTokenHash?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: function (): boolean {
        return this.provider === AUTH_PROVIDERS.LOCAL;
      },
      select: false,
    },

    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.STUDENT,
      required: true,
      index: true,
    },

    provider: {
      type: String,
      enum: Object.values(AUTH_PROVIDERS),
      default: AUTH_PROVIDERS.LOCAL,
      required: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
      required: true,
    },

    avatar: {
      type: String,
      trim: true,
    },

    lastLogin: {
      type: Date,
    },

    refreshTokenHash: {
      type: String,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> = model<IUser>("User", userSchema);