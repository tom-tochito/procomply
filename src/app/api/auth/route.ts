import { NextRequest } from "next/server";
import { api } from "~/convex/_generated/api";
import { fetchMutation, fetchAction } from "convex/nextjs";

export async function POST(request: NextRequest) {
  try {
    // Check if this is a CORS request and reject it
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    if (origin && new URL(origin).host !== host) {
      return new Response("Invalid origin", { status: 403 });
    }

    const body = await request.json() as { action: string; args: any };
    const { action, args } = body;
    
    // Handle auth actions
    if (action === "auth:signIn") {
      const result = await fetchAction(api.auth.signIn, args);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    
    if (action === "auth:signOut") {
      const result = await fetchAction(api.auth.signOut, args);
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    
    return new Response("Invalid action", { status: 400 });
  } catch (error: unknown) {
    console.error("Auth route error:", error);
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return new Response(
      JSON.stringify({ error: errorMessage }), 
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}