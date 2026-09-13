import { auth } from "@/lib/auth";
import { getSafeCallbackPath, SIGN_IN_PATH } from "./index";
import { NextRequest, NextResponse } from "next/server";

function redirectToString(request: NextRequest, pathname: string) {
  const signInUrl = new URL(SIGN_IN_PATH, request.url);

  // Include query string so filters/search params servive the round-trip through sign-in
  signInUrl.searchParams.set(
    "callbackUrl",
    `${pathname}${request.nextUrl.search}`,
  );
  return NextResponse.redirect(signInUrl);
}

function getPostAuthRedirectPath(request: NextRequest): string {
  const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
  return getSafeCallbackPath(callbackUrl);
}

// "/" is always public
// "sign-in": logged-in users redirect away; guest process
export async function handleAuthProxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (pathname === SIGN_IN_PATH) {
    if (session) {
      const redirctPath = getPostAuthRedirectPath(request);
      return NextResponse.redirect(new URL(redirctPath, request.url));
    }

    return NextResponse.next();
  }

  if (!session) {
    return redirectToString(request, pathname);
  }
  return NextResponse.next();
}
