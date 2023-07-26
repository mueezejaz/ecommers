import bcrypt from "bcrypt"
import  colors from "colors"
export const hashpassword = async (password)=>{
    try {
        const salatRound = 10;
        const hashedpassword = await bcrypt.hash(password,salatRound)
        return hashedpassword
    } catch (error) {
        console.log(`${error}`.bgRed)
    }
}

export const comparepassword = async (password,hashedpassword)=>{
return bcrypt.compare(password,hashedpassword)
};