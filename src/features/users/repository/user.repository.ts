/**
 * @deprecated This repository pattern is not used in this application.
 * Use Convex queries and mutations directly instead.
 */

export function getUserById(): never {
  throw new Error(
    "Repository pattern not implemented. Use Convex queries directly with useQuery() or api.users.get"
  );
}

export function updateUser(): never {
  throw new Error(
    "Repository pattern not implemented. Use Convex mutations directly with useMutation() or api.users.update"
  );
}

export function deleteUser(): never {
  throw new Error(
    "Repository pattern not implemented. Use Convex mutations directly with useMutation() or api.users.delete"
  );
}

export function listUsers(): never {
  throw new Error(
    "Repository pattern not implemented. Use Convex queries directly with useQuery() or api.users.list"
  );
}

export function findUsersByTenant(): never {
  throw new Error(
    "Repository pattern not implemented. Use Convex queries directly with useQuery() or api.users.listByTenant"
  );
}

export function findUsersWithProfilesByTenant(): never {
  throw new Error(
    "Repository pattern not implemented. Use Convex queries directly with useQuery() or api.users.listByTenant"
  );
}