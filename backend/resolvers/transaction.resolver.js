import { Transaction } from "../models/transaction.model.js";

export const transactoinResolver = {
    Query: {
        transactions: async(_, {input}, context) => {
            try {
                if(!context.getUser()) throw new Error("Unauthorized");
                const userId = await context.getUser()._id;

                const transaction = await Transaction.find({userId});
                return transaction;
            } catch (err) {
                console.log("Error in getting transaction", err);
                throw new Error("Error in getting Transaction");
            }
        },
        transaction: async(_, {transactionId}, ) => {
            try {
                const transaction = await Transaction.findById(transactionId);
                return transaction;
            } catch (err) {
                console.log("Error in getting transaction", err);
                throw new Error("Error in getting transaction");
            }
        }
    },
    Mutation: {
        createTransaction: async(_, {input}, context) => {
            try {
                const newTransaction = new Transaction({
                    ...input,
                    userId: context.getUser()._id
                });
                await newTransaction.save();
                return newTransaction;
            } catch(err) {
                console.log("Error in creating transaction", err);
                throw new Error("Error in creating transaction");
            }
        },
        updateTransaction: async(_, {input}) => {
            try {
                const updatedTransaction = await Transaction.findByIdAndUpdate(input.transactionId, input, {new: true});
                return updatedTransaction;
            } catch(err) {
                console.log("Error in updating transaction", err);
                throw new Error("Error in updating transaction");
            }
        },
        deleteTransaction: async(_, {transactionId}, ) => {
            try {
                const deletedTransaction = await Transaction.findByIdAndDelete(transactionId);
                return deletedTransaction;
            } catch(err) {
                console.log("Error in deleting transaction", err);
                throw new Error("Error in deleting transaction");
            }
        }
    }
}