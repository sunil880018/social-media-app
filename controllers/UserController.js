import { User } from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError } from "../errors/index.js";

const searchUser = async (req, res) => {
  try {
    const { username } = req.query;
    const users = await User.find({
      username: { $regex: username },
    })
      .limit(10)
      .select("fullname username avatar");

    return res.status(StatusCodes.OK).json({ users });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message, statusCode: error.statusCode });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new BadRequestError("Please provide id");
    }
    const user = await User.findById(id)
      .select("-password")
      .populate("followers following", "-password");

    if (!user) {
      throw new NotFoundError(`user with ${id} id Not Found!`);
    }
    return res.status(StatusCodes.OK).json({ user });
  } catch (error) {
    if (error.statusCode === 404) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: error.message, statusCode: error.statusCode });
    } else if (error.statusCode === 400)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: error.message, statusCode: error.statusCode });
    else
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: error.message, statusCode: error.statusCode });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id, avatar, fullname, mobile, address, story, website, gender } =
      req.body;
    if (!fullname) {
      throw new BadRequestError("Please provide fullname");
    }

    const user = await User.findOneAndUpdate(
      { _id: id },
      { avatar, fullname, mobile, address, story, website, gender }
    );

    return res.status(StatusCodes.CREATED).json({ user });
  } catch (error) {
    if (error.statusCode === 400)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: error.message, statusCode: error.statusCode });
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message, statusCode: error.statusCode });
  }
};

const follow = async (req, res) => {
  try {
    const { id, followerId } = req.params;
    if (!id) {
      throw new BadRequestError("Please provide user id");
    }

    const user = await User.find({
      _id: id,
      followers: followerId,
    });

    if (user.length > 0) {
      throw new BadRequestError("You are already following this user.");
    }

    const newUser = await User.findOneAndUpdate(
      { _id: id },
      {
        $push: {
          followers: followerId,
        },
      },
      { new: true }
    ).populate("followers following", "-followers");

    return res.status(StatusCodes.CREATED).json({ newUser });
  } catch (error) {
    if (error.statusCode === 400)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: error.message, statusCode: error.statusCode });
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message, statusCode: error.statusCode });
  }
};

const unfollow = async (req, res) => {
  try {
    const { id, followerId } = req.params;
    if (!id) {
      throw new BadRequestError("Please provide user id");
    }
    const newUser = await User.findOneAndUpdate(
      { _id: id },
      {
        $pull: { followers: followerId },
      },
      { new: true }
    ).populate("followers following", "-followers");

    return res.status(StatusCodes.CREATED).json({ newUser });
  } catch (error) {
    if (error.statusCode === 400)
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: error.message, statusCode: error.statusCode });
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: error.message, statusCode: error.statusCode });
  }
};

const suggestionsUser = async (req, res) => {
  try {
    const newArr = [...req.user.following, req.user._id];

    const num = req.query.num || 10;
    const users = await User.aggregate([
      { $match: { _id: { $nin: newArr } } },
      { $sample: { size: Number(num) } },
      {
        $lookup: {
          from: "User",
          localField: "followers",
          foreignField: "_id",
          as: "followers",
        },
      },
      {
        $lookup: {
          from: "User",
          localField: "following",
          foreignField: "_id",
          as: "following",
        },
      },
    ]).project("-password");

    return res.json({
      users,
      result: users.length,
    });
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

export { searchUser, getUser, updateUser, follow, unfollow, suggestionsUser };
