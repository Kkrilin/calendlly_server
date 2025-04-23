import { Model, Optional, ModelStatic } from 'sequelize';
export interface UserAttributes {
    id: string;
    name: string;
    email: string;
    password?: string;
    profileSlug: string;
    googleId?: string;
    refreshToken?: string;
    createdAt?: Date;
    updatedAt?: Date;
  }

  // Creation attributes
  export interface UserCreationAttributes extends Optional<UserAttributes,
    'id' | 'password' | 'googleId' | 'refreshToken' | 'createdAt' | 'updatedAt'> {}
  
  // Model instance
  export interface UserInstance extends Model<UserAttributes, UserCreationAttributes>,UserAttributes {}
  
  // 👇 Extend ModelStatic to add associate
  export interface UserModelStatic extends ModelStatic<UserInstance> {
    associate(models: any): void;
  }