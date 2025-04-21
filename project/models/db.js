import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const dbFile = join(__dirname, '../data/db.json');

const adapter = new JSONFile(dbFile);
const db = new Low(adapter, { users: [], refreshTokens: [] });

export const setupDatabase = async () => {
  try {
    await db.read();
    
    if (!db.data) {
      db.data = { users: [], refreshTokens: [] };
      await db.write();
      console.log('Database initialized with default data');
    }
  } catch (error) {
    console.error('Error setting up database:', error);
    db.data = { users: [], refreshTokens: [] };
  }
};

export const findUserByUsername = (username) => {
  return db.data.users.find(user => user.username === username);
};

export const findUserByEmail = (email) => {
  return db.data.users.find(user => user.email === email);
};

export const findUserById = (id) => {
  return db.data.users.find(user => user.id === id);
};

export const createUser = async (user) => {
  user.id = Date.now().toString(); 
  db.data.users.push(user);
  await db.write();
  return user;
};

export const updateUser = async (id, userData) => {
  const index = db.data.users.findIndex(user => user.id === id);
  if (index !== -1) {
    db.data.users[index] = { ...db.data.users[index], ...userData };
    await db.write();
    return db.data.users[index];
  }
  return null;
};

export const saveRefreshToken = async (token, userId) => {
  db.data.refreshTokens.push({ token, userId });
  await db.write();
};

export const findRefreshToken = (token) => {
  return db.data.refreshTokens.find(rt => rt.token === token);
};

export const removeRefreshToken = async (token) => {
  db.data.refreshTokens = db.data.refreshTokens.filter(rt => rt.token !== token);
  await db.write();
};

export default db;