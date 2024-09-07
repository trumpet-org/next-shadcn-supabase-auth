import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import LandingPage from "./page";
import { getServerClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getDictionary } from "dictionaries/dictionaries";

// Mock the necessary imports and functions
vi.mock("@/utils/supabase/server", () => ({
	getServerClient: vi.fn(),
}));

vi.mock("next/navigation", () => ({
	redirect: vi.fn(),
}));

vi.mock("next/image", () => ({
	// biome-ignore lint/a11y/useAltText: <explanation>
	default: ({ alt, ...props }: any) => <img alt={alt || "mock image"} {...props} />,
}));

vi.mock("dictionaries/dictionaries", () => ({
	getDictionary: vi.fn(),
}));

describe("LandingPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		// Set up a default mock for getDictionary
		vi.mocked(getDictionary).mockResolvedValue({
			landingTitle: "Mock Title",
			landingDescription: "Mock Description",
			landingCta: "Mock CTA",
		});
	});

	it("redirects when user is authenticated", async () => {
		const mockSupabase = {
			auth: {
				getUser: vi.fn().mockResolvedValue({ data: { user: { id: "test-user-id" } } }),
			},
		};
		vi.mocked(getServerClient).mockReturnValue(mockSupabase as any);

		await LandingPage({ params: { lang: "en" } });

		expect(vi.mocked(redirect)).toHaveBeenCalledWith("/test-user-id");
	});

	it("renders landing page content with correct structure", async () => {
		const mockSupabase = {
			auth: {
				getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
			},
		};
		vi.mocked(getServerClient).mockReturnValue(mockSupabase as any);
		vi.mocked(getDictionary).mockResolvedValue({
			landingTitle: "Mock Title",
			landingDescription: "Mock Description",
			landingCta: "Mock CTA",
		});

		const { container } = render(await LandingPage({ params: { lang: "en" } }));

		expect(container.querySelector("h1")).toBeInTheDocument();
		expect(container.querySelector("p")).toBeInTheDocument();
		expect(screen.getByRole("link")).toBeInTheDocument();
		expect(container.querySelector('img[alt="screenshot"]')).toBeInTheDocument();
	});

	it("uses the correct language parameter for the auth link", async () => {
		const mockSupabase = {
			auth: {
				getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
			},
		};
		vi.mocked(getServerClient).mockReturnValue(mockSupabase as any);
		vi.mocked(getDictionary).mockResolvedValue({
			landingTitle: "Mock Title",
			landingDescription: "Mock Description",
			landingCta: "Mock CTA",
		});

		render(await LandingPage({ params: { lang: "en" } }));

		const link = screen.getByRole("link");
		expect(link).toHaveAttribute("href", "en/auth");
	});

	it("applies translations from getDictionary", async () => {
		const mockSupabase = {
			auth: {
				getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
			},
		};
		vi.mocked(getServerClient).mockReturnValue(mockSupabase as any);
		const mockDictionary = {
			landingTitle: "Mock Title",
			landingDescription: "Mock Description",
			landingCta: "Mock CTA",
		};
		vi.mocked(getDictionary).mockResolvedValue(mockDictionary);

		const { container } = render(await LandingPage({ params: { lang: "en" } }));

		expect(container.querySelector("h1")?.textContent).toBe(mockDictionary.landingTitle);
		expect(container.querySelector("p")?.textContent).toBe(mockDictionary.landingDescription);
		expect(screen.getByRole("link").textContent).toBe(mockDictionary.landingCta);
	});
});
