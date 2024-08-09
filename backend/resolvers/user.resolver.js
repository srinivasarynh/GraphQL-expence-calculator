import bcrypt from "bcryptjs";
import { User } from "../models/user.model.js";

export const userResolver = {
    Query: {
        authUser: async(_, {input}, context) => {
            try {
                const user = await context.getUser();
                return user;
            } catch(err) {
                console.log("Error in authUser", err);
                throw new Error(err.message || "Internal server error");
            }
        }, 
        user: async(_, {userId}) => {
            try {
                const user = await User.findById(userId);
                return user;
            } catch(err) {
                console.log("Error in user query", err);
                throw new Error(err.message || "Internal server error");
            }
        }
    },
    Mutation: {
            signUp: async(_, {input}, context) => {
                try {
                    const {username, name, password, gender} = input;
                    if(!username || !name || !password || !gender) {
                        throw new Error("All fields are required");
                    }
                    const existingUser = await User.findOne({username});
                    if(existingUser) {
                        throw new Error("User already exists");
                    }
                    const salt = await bcrypt.genSalt(10);
                    const hashPassword = await bcrypt.hash(password, salt);

                    const newUser = new User({
                        username,
                        name,
                        password: hashPassword,
                        gender,
                        profilePicture: "https://static.vecteezy.com/system/resources/thumbnails/002/002/403/small/man-with-beard-avatar-character-isolated-icon-free-vector.jpg"
                    });
                    await newUser.save();
                    await context.login(newUser);
                    return newUser;
                } catch (err) {
                    console.log("Error in signup", err);
                    throw new Error(err.message || "Internal server error");
                }
            
            },

        login: async(_, {input}, context) => {
            try {
                const {username, password} = input;
                const {user} = await context.authenticate("graphql-local", {username, password});
                await context.login(user);
                return user;
            } catch(err) {
                console.log("Error in login", err);
                throw new Error(err.message || "Internal server error");
            }
        },

        logout: async(_, {input}, context) => {
            try {
                await context.logout();
                req.session.destroy(err => {
                    if(err) {
                        throw err;
                    }
                })
                resizeBy.clearCookie("connect.sid");
                return {message: "Logged out."};
            } catch (err) {
                onsole.log("Error in logout", err);
                throw new Error(err.message || "Internal server error");
            }
        }
    }
}

