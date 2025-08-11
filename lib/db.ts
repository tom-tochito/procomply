// This file has been replaced with Convex
// Use convex/react and api imports instead

export const db = {
  useQuery: () => {
    throw new Error("Use useQuery from convex/react instead");
  },
  transact: () => {
    throw new Error("Use useMutation from convex/react instead");
  },
  useAuth: () => {
    throw new Error("Use useAuth from src/hooks/useAuth instead");
  },
  auth: {
    sendMagicCode: () => {
      throw new Error("Use Convex auth instead");
    },
    signInWithMagicCode: () => {
      throw new Error("Use Convex auth instead");
    },
  },
};