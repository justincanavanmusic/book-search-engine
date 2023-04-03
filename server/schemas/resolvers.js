const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
// import sign token function from auth
const { signToken } = require('../utils/auth');


const resolvers = {
    Query: {

    me: async (parent, args, context) => {
        if (context.user) {
          return User.findOne({ _id: context.user._id });
        }
        throw new AuthenticationError('You need to be logged in!');
      },
},

Mutation: {

    addUser: async (parent, { username, email, password }) => {
        const user = await User.create({ username, email, password });

        const token = signToken(user);
        //auth type
        return { token, user };
      },
               //CHECK
      login: async(parent, { email, password })=> {
        const user = await User.findOne({ email });
  
        if(!user) {
          throw new AuthenticationError('No user found with this email address');
        }
  
        const correctPassword = await user.isCorrectPassword(password);
  
        if(!correctPassword) {
          throw new AuthenticationError('The password you entered is incorrect! Please try again.');
        }
        const token = signToken(user);
  
        return { token, user }
      },

    saveBook: async(parent, args, context) => {
      try {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { savedBooks: args } },
          { new: true, runValidators: true }
        );
        return updatedUser;
      } catch (err) {
        console.log(err);
        throw new AuthenticationError(err.message);
      }
    },
                //CHECK
    removeBook: async(parent, args, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: args.bookId } } },
          { new: true }
        );
      return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in!');
    }
             
 
},


}

module.exports = resolvers;