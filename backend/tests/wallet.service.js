export async function createWallet(sql, customer_id) {
  const existing = await sql`
    SELECT id FROM wallet WHERE customer_id = ${customer_id}
  `;
  if (existing.length) {
    throw new Error("Wallet already exists");
  }

  const [wallet] = await sql`
    INSERT INTO wallet (customer_id)
    VALUES (${customer_id})
    RETURNING id, customer_id, balance
  `;
  return wallet;
}

export async function getWallet(sql, customer_id) {
  const [wallet] = await sql`
    SELECT * FROM wallet WHERE customer_id = ${customer_id}
  `;
  if (!wallet) throw new Error("Wallet not found");
  return wallet;
}
