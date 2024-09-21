import { match as matchLocale } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";
import { type NextRequest, NextResponse } from "next/server";
import { i18n } from "../../dictionaries/i18n-config";

function getLocale(request: NextRequest): string | undefined {
	const { locales, defaultLocale } = i18n;
	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
	if (locales.length < 2) {
		return defaultLocale;
	}
	const negotiatorHeaders: Record<string, string> = {};
	for (const [key, value] of request.headers.entries()) {
		negotiatorHeaders[key] = value;
	}

	// @ts-expect-error locales are readonly
	const languages = new Negotiator({ headers: negotiatorHeaders }).languages(locales);

	const locale = matchLocale(languages, locales, i18n.defaultLocale);

	return locale;
}

/**
 * Middleware to redirect to the correct locale.
 * @param request - The incoming request object.
 * @returns The response object.
 */
export function i18nMiddleware(request: NextRequest) {
	const { pathname, search } = request.nextUrl;

	const pathnameIsMissingLocale = i18n.locales.every(
		(locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
	);

	if (pathnameIsMissingLocale) {
		const locale = getLocale(request);
		return NextResponse.redirect(
			new URL(`/${locale}${pathname.startsWith("/") ? "" : "/"}${pathname}${search}`, request.url),
		);
	}

	return NextResponse.next();
}
