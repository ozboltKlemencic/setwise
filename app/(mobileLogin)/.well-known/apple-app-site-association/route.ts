export async function GET() {
    const data = {
      applinks: {
        apps: [],
        details: [
          {
            appID: "HY5TY63JH2.com.jernejpeternel.myfit", // ✅ tvoj Team ID + bundle
            paths: ["/auth-callback", "/auth-callback/*"]
          }
        ]
      },
      webcredentials: {
        apps: ["HY5TY63JH2.com.jernejpeternel.myfit"]
      }
    };
  
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  }