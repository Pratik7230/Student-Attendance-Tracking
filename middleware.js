import { NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";
import { NAVIGATION_ROUTES, ROUTE_ACCESS } from "./app/constants";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/public") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/logo") ||
    pathname.startsWith("/svg") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  if (pathname === "/" || pathname === "/forgot-password") {
    return NextResponse.next();
  }

  if (token) {
    const { role_id } = jwtDecode(token);
    if (role_id) {
      const routeIds = ROUTE_ACCESS[role_id];
      if (routeIds && routeIds.length > 0) {
        const routes = routeIds.map(x => NAVIGATION_ROUTES.find(y => y.id == x))
        if (routes && routes.length > 0) {
          const routePaths = routes.map(x => x.path)
          if (routePaths.some(x => x.toLowerCase().includes(pathname.toLowerCase()))) {
            return NextResponse.next();
          }
        }
      }
    }
  }

  return NextResponse.redirect(new URL("/", req.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public|images|api).*)"],
};


// import { NextResponse } from "next/server";
// import { jwtDecode } from "jwt-decode";
// import { NAVIGATION_ROUTES, ROUTE_ACCESS } from "./app/constants";

// export function middleware(req) {
//   const token = req.cookies.get("token")?.value;
//   const { pathname } = req.nextUrl;

//   // Allow access to public assets
//   if (
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/public") ||
//     pathname.startsWith("/images") ||
//     pathname.startsWith("/logo") ||
//     pathname.startsWith("/svg") ||
//     pathname === "/favicon.ico"
//   ) {
//     return NextResponse.next();
//   }

//   // Allow access to the home page and forgot-password page
//   if (pathname === "/" || pathname === "/forgot-password") {
//     return NextResponse.next();
//   }

//   if (token) {
//     const { role_id } = jwtDecode(token);
//     if (role_id) {
//       const routeIds = ROUTE_ACCESS[role_id];
//       if (routeIds && routeIds.length > 0) {
//         const routes = routeIds.map(x => NAVIGATION_ROUTES.find(y => y.id == x));
//         if (routes && routes.length > 0) {
//           const routePaths = routes.map(x => x.path);
//           if (routePaths.some(x => x.toLowerCase().includes(pathname.toLowerCase()))) {
//             return NextResponse.next();
//           }
//         }
//       }
//     }
//   }

//   return NextResponse.redirect(new URL("/", req.url));
// }

// export const config = {
//   matcher: ["/((?!_next/static|_next/image|favicon.ico|public|images|api).*)"],
// };
