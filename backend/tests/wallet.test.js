import "./setup.js";
//jest.setTimeout(30000);

import { query } from "./db.js";
import { createWallet, getWallet } from "./wallet.service.js";

const sql = (strings, ...values) => {
  let text = strings[0];
  values.forEach((_, i) => {
    text += `$${i + 1}` + strings[i + 1];
  });
  return query(text, values).then(r => r.rows);
};

describe("Wallet service", () => {

  test("create wallet successfully", async () => {
    const wallet = await createWallet(sql, "test_customer_1");

    expect(wallet.customer_id).toBe("test_customer_1");
    expect(wallet.balance).toBe("0.00");
  });

  test("get wallet by customer_id", async () => {
    await createWallet(sql, "test_customer_2");

    const wallet = await getWallet(sql, "test_customer_2");

    expect(wallet.customer_id).toBe("test_customer_2");
  });

});
