import UserRepository from '../repositories/userRepository.js';

const getAll = async () => {
  return UserRepository.getAll();
};

const create = async (data: any) => {
  return UserRepository.create(data);
};

export default { getAll, create };
