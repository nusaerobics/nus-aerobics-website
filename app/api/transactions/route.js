import { NextResponse } from "next/server";
const db = require("../../config/sequelize");

const Transaction = db.transactions;
const User = db.users;

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const searchParams = new URLSearchParams(url.searchParams);

    // getTransactionsByUser
    if (searchParams.get("userId") != undefined) {
      const userId = searchParams.get("userId");
      const transactionsByUser = await Transaction.findAll({
        where: { userId: userId },
      });
      if (!transactionsByUser) {
        throw new Error(`User ${userId} has no transactions`);
      }
      return NextResponse.json(transactionsByUser, { status: 200 });
    }

    // getNumberOfDeposits
    if (searchParams.get("isCount") != undefined) {
      const number = await Transaction.sum('amount', {
        where: {
          type: "deposit",
        }
      });
      if (number == null) {
        return NextResponse.json(0, { status: 200 });
      }
      return NextResponse.json(number, { status: 200 });
    }

    // getTransactions
    const transactions = await Transaction.findAll({
      include: [
        {
          model: User,
          required: true,
          as: "user",
        },
      ],
    });

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
    const { userId, amount, type, description } = body;
    const data = await Transaction.create({
      userId: userId,
      amount: amount,
      type: type,
      description: description,
    });
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Error creating transaction: ${error}` },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    // deleteTransactionsByUser
    const body = await request.json();
    const userId = body.userId;
    await Transaction.destroy({ where: { userId: userId } });
    return NextResponse.json(
      { json: `Transactions for user ${userId} deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: `Error deleting transactions of user ${userId}: ${error}` },
      { status: 500 }
    );
  }
}
