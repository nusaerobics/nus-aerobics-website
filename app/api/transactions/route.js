// SELECT * FROM posts, users WHERE posts.user_id = users.id
/**
 * Posts.findAll({
    include: [{
      model: User,
      required: true
    }]
  }).then(posts => {});
 */
// require = true when it's an inner join where u're only returning posts which have a linked user
// https://stackoverflow.com/questions/20460270/how-to-make-join-queries-using-sequelize-on-node-js

import Transaction from "../../models/transaction.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);
    // getTransactionsByUser
    if (searchParams.get("user_id") != undefined) {
      const user_id = searchParams.get("user_id");
      const transactionsByUser = await Transaction.findAll({ where: { user_id: user_id } });
      if (!transactionsByUser) {
        throw new Error(`User ${user_id} has no transactions`);
      }
      return NextResponse.json(transactionsByUser, { status: 200 });
    }
    // getTransactions
    const transactions = await Transaction.findAll();
    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// createTransaction
export async function POST(request) {
  try {
    const body = await request.json();
    const user_id = body.user_id;
    const date = body.date;
    const amount = body.amount;
    const description = body.description;

    let newTransaction;
    if (description === "deposit") {
      newTransaction = {
        user_id: user_id,
        date: date,
        amount: amount,
        description: description,
      }
    } else {
      const class_id = body.class_id;
      newTransaction = {
        user_id: user_id,
        date: date,
        amount: amount,
        description: description,
        class_id: class_id,
      }
    }

    const data = await Transaction.create(newTransaction);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Error creating transaction: ${error}` },
      { status: 500 }
    );
  }
}
