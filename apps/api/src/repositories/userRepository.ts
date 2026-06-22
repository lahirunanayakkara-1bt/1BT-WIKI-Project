type User = {
  id: string;
  name: string;
  email?: string;
};

const users: User[] = [
  { id: "1", name: "John Doe", email: "john.doe@example.com" },
  { id: "2", name: "Jane Smith", email: "jane.smith@example.com" }
];

const getAll = async (): Promise<User[]> => {
  return users;
};

const create = async (data: Partial<User>): Promise<User> => {
  const user: User = { id: Date.now().toString(), name: data.name || 'Anonymous', email: data.email };
  users.push(user);
  return user;
};

export default { getAll, create };
