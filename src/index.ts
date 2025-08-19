export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    if (!url.pathname.startsWith("/__/auth/")) {
      return new Response("Not found", { status: 404 });
    }

    const targetUrl = `https://toebeans-421217.firebaseapp.com${url.pathname}${url.search}`;
    const init: RequestInit = {
      method: request.method,
      headers: new Headers(request.headers),
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.arrayBuffer(),
      redirect: "follow",
    };

    const upstream = await fetch(targetUrl, init);
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: upstream.headers,
    });
  },
};