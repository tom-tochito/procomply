/**
 * @deprecated This repository pattern is not used in this application.
 * Use Convex queries and mutations directly instead.
 */

export function getTeamById(): never {
  throw new Error(
    "Repository pattern not implemented. Use Convex queries directly with useQuery() or api.teams.get"
  );
}

export function createTeam(): never {
  throw new Error(
    "Repository pattern not implemented. Use Convex mutations directly with useMutation() or api.teams.create"
  );
}

export function updateTeam(): never {
  throw new Error(
    "Repository pattern not implemented. Use Convex mutations directly with useMutation() or api.teams.update"
  );
}

export function deleteTeam(): never {
  throw new Error(
    "Repository pattern not implemented. Use Convex mutations directly with useMutation() or api.teams.delete"
  );
}

export function listTeams(): never {
  throw new Error(
    "Repository pattern not implemented. Use Convex queries directly with useQuery() or api.teams.list"
  );
}

export function listTeamsByCompany(): never {
  throw new Error(
    "Repository pattern not implemented. Use Convex queries directly with useQuery() or api.teams.listByCompany"
  );
}

export function addTeamMember(): never {
  throw new Error(
    "Repository pattern not implemented. Use Convex mutations directly with useMutation() or api.teams.addMember"
  );
}

export function removeTeamMember(): never {
  throw new Error(
    "Repository pattern not implemented. Use Convex mutations directly with useMutation() or api.teams.removeMember"
  );
}

export function findTeamsByTenant(): never {
  throw new Error(
    "Repository pattern not implemented. Use Convex queries directly with useQuery() or api.teams.listByTenant"
  );
}

export function getTeamsByTenant(): never {
  throw new Error(
    "Repository pattern not implemented. Use Convex queries directly with useQuery() or api.teams.listByTenant"
  );
}