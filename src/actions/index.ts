import { defineAction } from "astro:actions";
import mariadb from "mariadb";
import { loadEnv } from "vite";
import { z } from "astro:schema";

export const server = {
  submitForm: defineAction({
    accept: "form",
    input: z.object({
      coming: z.boolean().nullable().default(false),
      name: z.string().nullable(),
      amount: z.number(),
      diet: z.string().nullable().default("none"),
      comment: z.string().nullable(),
    }),
    handler: async (input) => {
      const { coming, name, amount, diet, comment } = input;

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
          `INSERT INTO wedding.guests (id, coming, name, amount, diet, comment) VALUES (?, ?, ?, ?, ?, ?)`,
          [crypto.randomUUID(), coming, name, amount, diet, comment]
        );
      } catch (error) {
        console.error(error);
      } finally {
        if (connection) connection.release();
      }
    },
  }),
};
