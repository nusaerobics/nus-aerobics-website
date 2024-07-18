import Transaction from "../../database/models/transaction.model";

export default (req, res) => {
  const method = req.method;
  switch (method) {
    case "GET":
      if (req.query.user_id != undefined) {
        return getTransactionsByUser(req, res);
      }
      return getTransactions(req, res);
    case "POST":
      return createTransaction(req, res);
  }
};

const getTransactions = async (req, res) => {
  console.log("here");
  await Transaction.findAll()
    .then((data) => {
      res.send(data);
      res.status(200).json({ json: data });
    })
    .catch((error) => {
      res.status(500).json({ message: `Error getting transactions: ${error}` });
    });
};

const getTransactionsByUser = async (req, res) => {
  const user_id = req.query.user_id;
  console.log(user_id);
  await Transaction.findAll({ where: { user_id: user_id } })
    .then((data) => {
      res.send(data);
      res.status(200).json({ json: data });
    })
    .catch((error) => {
      res.status(500).json({
        message: `Error getting transactions for user ${user_id}: ${error}`,
      });
    });
};

const createTransaction = async (req, res) => {
  const user_id = req.body.user_id;
  const date = req.body.date;
  const amount = req.body.amount;
  const description = req.body.description;
  // Handle the fullDescription after getting the data from getTransactions i.e. formatting is FE

  let newTransaction;
  if (description === "book") {
    const booking_id = req.body.booking_id;
    newTransaction = {
      user_id: user_id,
      date: date,
      amount: amount,
      description: description,
      booking_id: booking_id,
    };
  } else {
    newTransaction = {
      user_id: user_id,
      date: date,
      amount: amount,
      description: description,
    };
  }

  await Transaction.create(newTransaction)
    .then((data) => {
      res.status(200).json({ json: data });
    })
    .catch((error) => {
      res
        .status(500)
        .json({ message: `Error occurred creating transaction: ${error}` });
    });
};
