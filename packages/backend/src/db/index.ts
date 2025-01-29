import { createClient } from '@libsql/client';

const db = createClient({
  url: 'file:local.db',
});

export const initDb = async () => {
  const schema = await Bun.file('./src/db/schema.sql').text();
  await db.execute(schema);
};

export { db };
