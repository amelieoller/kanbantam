const getMany = (model) => async (req, res) => {
  const user = req.user._id;
  const board = req.query.boardId;

  try {
    let docs;
    if (board) {
      docs = await model.find({ user, board }, { __v: 0, user: 0 }).lean().exec();
    } else {
      docs = await model.find({ user }, { __v: 0, user: 0 }).lean().exec();
    }

    res.status(200).send({ message: 'Docs retrieved successfully', data: docs });
  } catch (e) {
    console.log('ERROR', e);
    res.status(400).send({ message: 'Retrieving of docs failed', e });
  }
};

const createOne = (model) => async (req, res) => {
  const user = req.user._id;

  try {
    const doc = await model.create({ ...req.body, user });

    res.status(201).send({ message: 'Doc created successfully', data: doc });
  } catch (e) {
    console.log('ERROR', e);
    res.status(400).send({ message: 'Creation of doc failed', e });
  }
};

const updateOne = (model) => async (req, res) => {
  try {
    const updatedDoc = await model
      .findOneAndUpdate(
        {
          user: req.user._id,
          _id: req.params.id,
        },
        { ...req.body, updated_at: Date.now() },
        { new: true },
      )
      .lean()
      .exec();

    if (!updatedDoc) {
      return res.status(400).send({ message: 'Update of doc failed' });
    }

    res.status(200).send({ message: 'Doc updated successfully', data: updatedDoc });
  } catch (e) {
    console.log('ERROR', e);
    res.status(400).send({ message: 'Update of doc failed' });
  }
};

const removeOne = (model) => async (req, res) => {
  try {
    const removed = await model.findOneAndRemove({
      user: req.user._id,
      _id: req.params.id,
    });

    if (!removed) {
      return res.status(400).send({ message: 'Removing of doc failed' });
    }

    return res.status(200).send({ message: 'Doc removed successfully', data: removed });
  } catch (e) {
    console.log('ERROR', e);
    res.status(400).send({ message: 'Removing of doc failed', e });
  }
};

const crudControllers = (model) => ({
  getMany: getMany(model),
  createOne: createOne(model),
  updateOne: updateOne(model),
  removeOne: removeOne(model),
});

module.exports = crudControllers;
