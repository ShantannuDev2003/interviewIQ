import  jwt  from "jsonwebtoken"

const isAuth =async (req,res,next)=>{
    try {
        let {token}=req.cookies
        if(!token){
            return res.status(400).json({message:"User does not have a valid token"})
        }
        const verifyToken=jwt.verify(token, process.env.JWT_SECRET)
        // console.log(verifyToken)
        // console.log(verifyToken.userId)
         if(!verifyToken){
            return res.status(400).json({message:"User does not have a valid token"})
        }
        req.userId=verifyToken.userId
        next()
    } catch (error) {
        return res.status(500).json({message:"isAuth error"})
    }
}

export default isAuth;