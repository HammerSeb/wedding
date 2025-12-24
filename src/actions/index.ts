import { defineAction } from "astro:actions";
import mariadb from "mariadb";
import { loadEnv } from "vite";
import { z } from "astro:schema";

export const server = {
  submitForm: defineAction({
    accept: "form",
    input: z.object({
      notcoming: z.boolean().nullable().default(false),
      coming: z.boolean().nullable().default(false),
      name: z.string().nullable(),
      amount: z.number(),
      diet_norm: z.number().default(0),
      diet_veggie: z.number().default(0),
      diet_vegan: z.number().default(0),
      comment: z.string().nullable(),
    }),
    handler: async (input) => {
      const {
        notcoming,
        coming,
        name,
        amount,
        diet_norm,
        diet_veggie,
        diet_vegan,
        comment,
      } = input;

      let connection: mariadb.PoolConnection | undefined;
      try {
        const { DB_HOST, DB_PASSWORD } = loadEnv(
          process.env.NODE_ENV!,
          process.cwd(),
          ""
        );

        const pool = mariadb.createPool({
          host: DB_HOST,
          port: 3306,
          user: "root",
          password: DB_PASSWORD,
          database: "wedding",
        });
        connection = await pool.getConnection();
        await connection.query(
          `INSERT INTO wedding.guests (id, notcoming, coming, name, amount, diet_norm, diet_veggie, diet_vegan, comment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            crypto.randomUUID(),
            notcoming,
            coming,
            name,
            amount,
            diet_norm,
            diet_veggie,
            diet_vegan,
            comment,
          ]
        );
      } catch (error) {
        console.error(error);
      } finally {
        if (connection) connection.release();
      }
    },
  }),
};
