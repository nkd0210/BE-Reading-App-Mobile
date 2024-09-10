const bcrypt = require('bcrypt');

const saltRounds = 10;

export const hashPasswordUtils = async (plainPassword: string) => {
    try {
        // console.log("plain password:", plainPassword);
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds)
        // console.log("has password: ", hashedPassword);
        return hashedPassword;
    } catch (error) {
        console.log(error);
    }
}

export const comparePasswordUtils = async (plainPassword: string, hashedPassword: string) => {
    try {
        const validPassword = await bcrypt.compare(plainPassword, hashedPassword);
        return validPassword;
    } catch (error) {
        console.log(error);
    }
}