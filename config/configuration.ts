export default () => ({
  database: {
    host: process.env.POSTGRES_HOST,
    port: Number.parseInt(process.env.POSTGRES_PORT || ''),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    name: process.env.POSTGRES_DB,
  },
});
