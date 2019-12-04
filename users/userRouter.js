const express = require('express');
const Users = require('../users/userDb');
const Posts = require('../posts/postDb');
const router = express.Router();

router.post('/', validateUser, (req, res) => {
  Users.insert(req.body)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).json({ error: 'The user could not be added..' });
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
  Users.get().then(data => {
    res.status(200).json(data);
  });
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const userId = req.params.id;
  Users.getUserPosts(userId);
});

router.delete('/:id', validateUserId, (req, res) => {
  const id = req.params.id;
  Users.remove(id).then(data => {});
});

router.put('/:id', validateUser, validateUserId, (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  // do your magic!
});

//custom middleware

function validateUserId(req, res, next) {
  Users.getById(req.params.id)
    .then(user => {
      if(user.id) {
        req.user = user;
        console.log(user);
        next();
      } else {
        res.status(404.json({ message: "User ID not found! "}));
      }
    })
    .catch(err => {
      res.status(400).json({ message: "Invalid user id"});
    });

}

function validateUser(req, res, next) {
  if(req.body.name) {
    next();
  } else {
    res.status(400).json({ message: "Missing name field"});
  }
}

function validatePost(req, res, next) {
 if(req.body.text) {
   next();
 } else {
  res.status(400).json({ message: "Missing required text field"});
 }


module.exports = router;
