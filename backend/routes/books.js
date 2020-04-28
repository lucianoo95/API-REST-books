const { Router } = require('express');
const router = Router();

router.get('/', (req, res) => {
  response = {
    'ok': 'true',
    'message': 'Hello world !!'
  };
  res.json(response);
})

module.exports = router;