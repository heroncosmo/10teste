import path from 'path';

export const DATABASE_CONFIG = {
  path: path.resolve(process.cwd(), 'data', 'receita.db'),
  pageSize: 10,
}; 