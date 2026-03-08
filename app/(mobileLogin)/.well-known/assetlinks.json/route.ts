export async function GET() {
    const data = [
      {
        relation: ["delegate_permission/common.handle_all_urls"],
        target: {
          namespace: "android_app",
          package_name: "com.jernejpeternel.myfit", // ✅ tvoj package
          sha256_cert_fingerprints: [
            "AA:BB:CC:DD:..." // ⚠️ ZAMENJAJ s pravim SHA256
          ]
        }
      }
    ];
  
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
    });
  }