import { sql } from "../config/database.js";

    // Create profile for user
export async function createCustomer(req, res) {
try {
    const { first_name, last_name, email, password, address, phone_number, role, id } = req.body;

    if (!first_name, !last_name, !email || !id || !address || !password || !phone_number || !role) {
    return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = await sql`
    INSERT INTO customer(id, first_name, last_name, email, password, address, phone_number, role)
    VALUES (${id},${first_name},${last_name},${email},${password},${address},${phone_number},${role})
    RETURNING *
    `;

    // To use debug
    // console.log(customer);
    res.status(201).json(transaction[0]);
} catch (error) {
    console.log("Error creating the transaction", error);
    res.status(500).json({ message: "Internal server error" });
    }
}