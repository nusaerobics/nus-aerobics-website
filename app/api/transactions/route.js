import { NextResponse } from "next/server";
const db = require("../../config/sequelize");
const Transaction = db.transactions;

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