export async function GET() {
  const data = {
    applinks: {
      apps: [],
      details: [
        {
          appID: "HY5TY63JH2.com.jernejpeternel.myfit",
          paths: ["/auth-callback", "/auth-callback/*"],
        },
      ],
    },
  };

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}