import Image from "next/image";

import { getServerClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Button, buttonVariants } from "gen/ui/button";
import { cn } from "gen/cn";
import { redirect } from "next/navigation";
import type { Locale } from "dictionaries/i18n-config";
import { getDictionary } from "dictionaries/dictionaries";

export default async function LandingPage({
	params,
}: {
	params: { lang: Locale };
}) {
	const supabase = getServerClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (user) {
		redirect(`/${user.id}`);
	}

	const dictionary = await getDictionary(params.lang);

	return (
		<section className="container flex flex-col md:flex-row md:h-[calc(100dvh-10rem)] h-[calc(100dvh-8rem)]">
			<div className="w-full md:w-1/2  pt-8 flex flex-col gap-3 md:gap-4 justify-center text-center md:text-left">
				<h1 className="text-balance text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl ">
					{dictionary.landingTitle}
				</h1>
				<p className="text-sm max-w-screen-md text-balance  text-muted-foreground sm:text-xl sm:leading-8">
					{dictionary.landingDescription}
				</p>
				<Link href={`${params.lang}/auth`}>
					<Button className={cn(buttonVariants({ variant: "default", size: "lg" }))}>{dictionary.landingCta}</Button>
				</Link>
			</div>
			<div className="w-full md:w-1/2 flex items-center justify-center">
				<div className="aspect-video w-full max-w-2xl">
					<Image width="1000" height="600" src="/images/screenshot.png" alt={"screenshot"} className="w-full h-auto" />
				</div>
			</div>
		</section>
	);
}
