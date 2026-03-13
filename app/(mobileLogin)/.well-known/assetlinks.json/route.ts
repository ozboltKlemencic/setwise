export async function GET() {
  const data = [
    {
      relation: ["delegate_permission/common.handle_all_urls"],
      target: {
        namespace: "android_app",
        package_name: "com.jernejpeternel.myfit",
        sha256_cert_fingerprints: [
          "F9:18:C9:9E:82:34:3A:F8:B6:EA:7A:D9:C3:20:F7:D5:10:E1:D4:3E:AB:59:89:28:57:A8:01:A3:E8:F2:E1:DE",
          "9F:97:64:60:44:F0:CA:4C:8A:36:4A:19:8A:1F:84:4D:EF:95:9B:79:3E:27:F0:DE:7C:77:90:F4:04:B9:F4:1B"
        ]
      },
    },
  ];

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}