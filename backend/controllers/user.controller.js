import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import { Post } from "../model/post.model.js";
import { User } from "../model/user.model.js";

export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(401).json({
                message: "Something is missing, please check!",
                success: false,
            });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(401).json({
                message: "Try different email",
                success: false,
            });
        };

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({
            username,
            email,
            password: hashedPassword,
        });
        return res.status(201).json({
            message: "Account Created Successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
    }
}

// export const login = async(req,res)=>{
//     try{
//        const {email,password}=req.body;
//        if(!email || !password){
//         return res.status(401).json({
//             message:"Something is missing , please check !",
//             success:false,
//         })
//        }
//        let user = await User.findOne({ email });
//        console.log("User found:", user);
//        if(!user){
//         return res.status(401).json({
//             message:"incorrect email or password !",
//             success:false,
//         })
//        }
//        const isPasswordMatch = await bcrypt.compare(password,user.password);
//        if(!isPasswordMatch){
//         return res.status(401).json({
//             message:"incorrect email or password !",
//             success:false,
//         })
//        }
//        const token = await jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:'1d'})
//        //populate each post id in the post array\

//        const populatedPosts = await Promise.all(
//         user.posts.map(async(postId)=>{
//             const post = await Post.findById(postId);
//             if(post.author.equals(user._id)){
//                 return post;
//             }
//             return null;
//         })
//        )

//        user = {
//         _id:user._id,
//         username:user.username,
//         email:user.email,
//         profilepicture:user.profilepicture,
//         bio:user.bio,
//         followers:user.followers,
//         following:user.following,
//         posts:populatedPosts
//        }

//        return res.cookie('token',token,{httpOnly:true,sameSite:'strict',maxAge:1*24*60*60*1000}).json({
//         message:`Welcome back ${user.username}`,
//         success:true,
//         user
//        })
//     }catch(error){
//         console.log(error)
//     }
// }
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({
                message: "Email and password are required.",
                success: false,
            });
        }

        let user = await User.findOne({ email });
        if (!user) {
            console.log(`User with email ${email} not found.`);
            return res.status(401).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            console.log(`Password mismatch for user with email ${email}.`);
            return res.status(401).json({
                message: "Incorrect email or password.",
                success: false,
            });
        }

        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY);
        console.log(`Token generated for user: ${user._id}`);

        const populatedPosts = await Promise.all(
            user.posts.map(async (postId) => {
                const post = await Post.findById(postId);
                if (post) {
                    if (post.author.equals(user._id)) {
                        console.log(`Post ${post._id} found for user ${user._id}.`);
                        return post;
                    } else {
                        console.log(`Post ${post._id} is not authored by user ${user._id}.`);
                        return null;
                    }
                } else {
                    console.log(`Post with ID ${postId} not found.`);
                    return null;
                }
            })
        )

        user = {
            _id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
            posts: populatedPosts
        };

        return res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        }).json({
            message: `Welcome back, ${user.username}`,
            success: true,
            user
        });

    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({
            message: "An error occurred. Please try again later.",
            success: false
        });
    }
};

export const logout = async (_, res) => {
    try {
        return res.cookie("token", "", { maxAge: 0 }).json({
            message: 'Logged out successfully.',
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        let user = await User.findById(userId).populate({path:'posts', createdAt:-1}).populate('bookmarks');
        return res.status(200).json({
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
    }
};

export const editProfile = async (req, res) => {
    try {
        const userId = req.id;
        const { bio, gender } = req.body;
        const profilePicture = req.file;
        let cloudResponse;

        if (profilePicture) {
            const fileUri = getDataUri(profilePicture);
            cloudResponse = await cloudinary.uploader.upload(fileUri);
        }

        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({
                message: 'User not found.',
                success: false
            });
        };
        if (bio) user.bio = bio;
        if (gender) user.gender = gender;
        if (profilePicture) user.profilePicture = cloudResponse.secure_url;

        await user.save();

        return res.status(200).json({
            message: 'Profile updated.',
            success: true,
            user
        });

    } catch (error) {
        console.log(error);
    }
};

export const getSuggestedUsers = async (req, res) => {
    try {
        const suggestedUsers = await User.find({ _id: { $ne: req.id } }).select("-password");
        if (!suggestedUsers) {
            return res.status(400).json({
                message: 'Currently do not have any users',
            })
        };
        return res.status(200).json({
            success: true,
            users: suggestedUsers
        })
    } catch (error) {
        console.log(error);
    }
};

export const followOrUnfollow = async (req, res) => {
    try {
        const Me = req.id;
        const thoseIFollow = req.params.id;
        if (Me === thoseIFollow) {
            return res.status(400).json({
                message: 'You cannot follow/unfollow yourself',
                success: false
            });
        }

        const user = await User.findById(Me);
        const targetUser = await User.findById(thoseIFollow);

        if (!user || !targetUser) {
            return res.status(400).json({
                message: 'User not found',
                success: false
            });
        }
        // Check whether to follow or unfollow
        const isFollowing = user.following.includes(thoseIFollow);
        if (isFollowing) {
            // unfollow logic
            await Promise.all([
                User.updateOne({ _id: Me }, { $pull: { following: thoseIFollow } }),
                User.updateOne({ _id: thoseIFollow }, { $pull: { followers: Me } }),
            ])
            return res.status(200).json({ message: 'Unfollowed successfully', success: true });
        } else {
            // follow logic
            await Promise.all([
                User.updateOne({ _id: Me }, { $push: { following: thoseIFollow } }),
                User.updateOne({ _id: thoseIFollow }, { $push: { followers: Me } }),
            ])
            return res.status(200).json({ message: 'Followed successfully', success: true });
        }
    } catch (error) {
        console.log(error);
    }
}