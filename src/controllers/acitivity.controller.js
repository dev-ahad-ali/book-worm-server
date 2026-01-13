import Activity from '../models/acitivity.model.js';
import Follow from '../models/follow.model.js';

export const getActivityFeed = async (req, res) => {
  const following = await Follow.find({ follower: req.user._id }).select('following');

  const ids = following.map((f) => f.following);

  const feed = await Activity.find({
    user: { $in: ids },
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .populate('user', 'name photo')
    .populate('book', 'title coverImage');

  res.json(feed);
};
