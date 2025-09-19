export async function POST(req) {
  try {
    // Read body if provided, but do not rely on or persist server-side session/token state.
    // Stateless logout: client clears its token; server acknowledges.
    try {
      await req.json();
    } catch (_) {
      // ignore empty/invalid JSON
    }

    return new Response(
      JSON.stringify({ message: "User logged out successfully" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error during logout:", error);
    // Still respond 200 to let client clear token reliably
    return new Response(
      JSON.stringify({ message: "User logged out successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
