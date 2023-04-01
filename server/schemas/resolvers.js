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

        //do i need? how do i return an auth type?
        const token = signToken(user);
        //auth type
        return { token, user };
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

    }

},


}

module.exports = resolvers;