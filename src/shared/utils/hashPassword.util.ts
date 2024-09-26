import * as bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
  const saltOrRounds = 10;
  return await bcrypt.hash(password, saltOrRounds);
};

export const comparePassword = async (inputPassword: string, hashedPassword: string ) => {
  return await bcrypt.compare(inputPassword, hashedPassword);
}
