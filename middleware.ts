// Middleware Edge para generar nonces y aplicar CSP dinámico
// Intercepta respuestas HTML, inyecta nonce en scripts inline y añade
// una cabecera Content-Security-Policy que incluye el nonce.

export const config = {
  // matcher amplio; filtramos rutas concretas en tiempo de ejecución
  matcher: ['/((?!api|_next|static|images|icons|favicon.ico).*)'],
};

function generateNonce() {
  // genera 16 bytes y los codifica en base64 URL-safe
  const arr = new Uint8Array(16);
  crypto.getRandomValues(arr);
  // convertir a base64 URL-safe
  let str = btoa(String.fromCharCode(...arr));
  str = str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return str;
}

export default async function middleware(request: Request) {
  // Evitar procesamiento recursivo de la petición que hacemos internamente
  if (request.headers.get('x-middleware-bypass') === '1') {
    return fetch(request);
  }

  // Solo procesar GET que acepten HTML
  if (request.method !== 'GET') return fetch(request);
  const accept = request.headers.get('accept') || '';
  if (!accept.includes('text/html')) return fetch(request);

  // Hacemos un fetch al origen, añadiendo un header para que la llamada interna
  // no vuelva a ser procesada por este middleware.
  const forwarded = new Request(request.url, {
    method: request.method,
    headers: new Headers([...request.headers, ['x-middleware-bypass', '1']]),
    redirect: 'manual',
  });

  const originRes = await fetch(forwarded);

  // Si la respuesta no es HTML, devolvemos tal cual
  const contentType = originRes.headers.get('content-type') || '';
  if (!contentType.includes('text/html')) return originRes;

  let text = await originRes.text();

  // Generar nonce y reemplazar <script> sin src por <script nonce="...">
  const nonce = generateNonce();

  // Regex: match <script ...> that does NOT contain src= and add nonce attr
  text = text.replace(/<script(?![^>]*\bsrc\b)([^>]*)>/gi, (m, g1) => {
    // si ya tiene nonce, no duplicar
    if (/nonce\s*=/.test(m)) return m;
    return `<script${g1} nonce="${nonce}">`;
  });

  // Construir CSP que permita scripts desde self y los scripts inline con nonce
  const csp = [
    "default-src 'none'",
    "frame-src https://vercel.live/",
    `script-src 'self' 'nonce-${nonce}' https://www.gstatic.com https://www.googleapis.com https://vercel.live`,
    `script-src-elem 'self' 'nonce-${nonce}' https://vercel.live`,
    "connect-src 'self' https://firestore.googleapis.com https://*.firebaseio.com https://*.firebaseapp.com https://identitytoolkit.googleapis.com",
    "img-src 'self' data: https:",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "frame-ancestors 'self' https://vercel.live",
    "object-src 'none'",
    "base-uri 'self'",
    "manifest-src 'self'",
  ].join('; ');

  // Clonar headers y establecer CSP dinámico
  const headers = new Headers(originRes.headers);
  headers.set('Content-Security-Policy', csp);
  // evitar content-length inconsistente
  headers.delete('content-length');

  return new Response(text, {
    status: originRes.status,
    statusText: originRes.statusText,
    headers,
  });
}
