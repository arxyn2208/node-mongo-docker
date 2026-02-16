const express = require('express');
const router = express.Router();
const {createtask, getAlltasks, gettaskbyid, updatetask, deletetask} = require('../controllers/task.controller');
const {verifyToken} = require('../middleware/auth.middleware');


router.use(verifyToken);

router.post('/', createtask);
router.get('/', getAlltasks);      
router.get('/:id', gettaskbyid);   
router.put('/:id', updatetask);
router.delete('/:id', deletetask);

module.exports = router;
