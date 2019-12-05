const express = require('express');
const Users = require('./userDb');
const Posts = require('../posts/postDb');
const router = express.Router();

router.use(express.json());

router.post('/', validateUser, (req, res) => {
  Users.insert(req.body)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({ error: 'Error adding the user..' });
    });
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  req.body.user_id = req.params.id;
  Posts.insert(req.body)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      res.status(500).json({ error: 'The post could not be added.. ' });
    });
});

router.get('/', (req, res) => {
  Users.get()
    .then(users => {
      res.status(200).json(users);
    })
    .catch(err => {
      res.status(500).json({ error: 'Error retrieving users...' });
    });
});
router.get('/:id', validateUserId, (req, res) => {
  Users.getById(req.params.id)
    .then(get => {
      res.status(200).json(get);
    })
    .catch(error => {
      res.status(500).json({ message: 'Error retrieving user...' });
    });
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const userId = req.params.id;

  Users.getUserPosts(userId)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(err => {
      res.status(500).json({ error: 'The users posts could not be retrieved.' });
    });
});

router.delete('/:id', validateUserId, (req, res) => {
  Users.remove(req.params.id)
    .then(removed => {
      if (removed !== 0) {
        res.status(200).json({ message: 'You have successfully deleted this user...' });
      } else {
        res.status(404).json({ message: 'The user could not be found.' });
      }
    })
    .catch(error => {
      res.status(500).json({ error, message: 'Error deleting the user.' });
    });
});

router.put('/:id', validateUserId, (req, res) => {
  Users.update(req.params.id, req.body)
    .then(change => {
      res.status(201).json(change);
    })
    .catch(error => {
      res.status(500).json({ message: 'Error updating user' });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then(user => {
      if (user.id) {
        req.user = user;
        console.log(user);
        next();
      } else {
        res.status(404).json({ message: 'User ID not found! ' });
      }
    })
    .catch(err => {
      res.status(400).json({ message: 'Invalid user id' });
    });
}

function validateUser(req, res, next) {
  if (req.body.name) {
    next();
  } else {
    res.status(400).json({ message: 'Missing name field' });
  }
}

function validatePost(req, res, next) {
  if (req.body.text) {
    next();
  } else {
    res.status(400).json({ message: 'Missing required text field' });
  }
}

module.exports = router;
