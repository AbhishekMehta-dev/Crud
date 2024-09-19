import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";



const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        console.error("Error generating tokens:", error.message);
        throw new Error("Internal server error. Please try again later.");
        
    }
}




const createUser = async (req, res) => {
    try {
        const { fullname, username, email, password } = req.body;

        // Validate if all fields are provided
        if ([fullname, username, email, password].some(field => field?.trim() === "")) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if user already exists
        const userExists = await User.findOne({ $or: [{ username }, { email }] });
        if (userExists) {
            return res.status(400).json({ error: "User already exists" });
        }

        // Handle avatar file
        const avatarFile = req.file;
        if (!avatarFile) {
            return res.status(400).json({ message: "Avatar file is required" });
        }

        // Save avatar details in user data
        const avatar = {
            filePath: `public/temp/${avatarFile.filename}`,       // Path to the saved file on disk
            contentType: avatarFile.mimetype                      // Image MIME type (e.g., 'image/png')
        };

        // Create the user and save avatar metadata in the database
        const user = await User.create({
            fullname,
            username,
            email,
            password,
            avatar
        });

        // Generate URL to access the avatar
        const avatarUrl = `${req.protocol}://${req.get('host')}/temp/${avatarFile.filename}`;

        return res.status(201).json({
            message: "User created successfully",
            user: {
                fullname,
                username,
                email,
                avatarUrl  // Include the URL to access the image
            }
        });
    } catch (error) {
        console.error("Error creating user:", error.message);
        return res.status(500).json({ error: "Internal server error. Please try again later." });
    }
};



const userLogin = async(req,res)=>{
   
     const {username,email, password} = req.body;
    //  console.log(email)
    //  console.log(password)
     if(!username ||!password){
         return res.status(400).json({error: "Please provide username and password"})
     }
     const user = await User.findOne({username}).select('+password')
     console.log(user)
     const isPasswordValid = await user.isPasswordCorrect(password)

     if (!isPasswordValid) {
         return res.status(401).json({error: "Invalid username or password"})
         
      
      }

//      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '1h'})
//      res.status(201)
//      .json({message:"User login Successfully",user,token})

   
//     } 
     
//      catch (error) {
//      console.error("Error logging in user:", error.message);
//      return res.status(500).json({
//          error: "Internal server error. Please try again later.",
//      });
const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
        message: "User logged in successfully",
        user: loggedInUser,
        accessToken,
        refreshToken
    })


    
    
}   
const userLogout = async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({
        message: "User logged out successfully"
    })
}

    


const refreshAccessToken = async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        return res.status(401).json({ error: "No refresh token provided" })
        
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            return res.status(403).json({ error: "User not found" })

            }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            return res.status(401).json({ error: "Refresh token does not match" })
            
            }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json({message:"Access token refreshed",accessToken, refreshToken: newRefreshToken,
            } )
    } catch (error) {
        console.error("Error refreshing access token:", error.message);
        return res.status(500).json({
            error: "Internal server error. Please try again later.",
        });
      
    }

}

export{createUser,userLogin,userLogout,generateAccessAndRefereshTokens,refreshAccessToken}