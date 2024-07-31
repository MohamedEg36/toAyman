const pool = require('../models/db');


exports.addMessage = (req, res) => {
   const { fromUserID, toUserID,  message, date } = req.body;
    const newMessage = { fromUserID, toUserID,  message, date };

    pool.query('INSERT INTO tbl_115_connection SET ?', newMessage, (err, result) => {
      if (err) throw err;
        res.json({ fromUserID: result.insertId, ...newMessage });
    });
};

exports.getMessages = (req, res) => {
    const { carID } = req.query;
    const userID = req.user.id;

    pool.query('SELECT * FROM tbl_115_messages WHERE carID = ? AND (fromUserID = ? OR toUserID = ?)', [carID, userID, userID], (err, results) => {
       if (err) throw err;
        res.json(results);
   });
};
