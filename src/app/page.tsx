import Link from "next/link";
import { Button, buttonStyles } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { Section } from "@/components/ui/section";

/**
 * Component showcase — verifies the UI primitives render together with
 * consistent spacing and design tokens. Replaced when real page content
 * lands.
 */
export default function HomePage() {
  return (
    <>
      <Section>
        <Heading
          level={1}
          align="center"
          eyebrow="UI System"
          description="Building blocks for every page on the site. Composed from design tokens, the 8px spacing scale, and the brand palette."
        >
          Umoja Africa components
        </Heading>
      </Section>

      <Section variant="muted">
        <Heading
          level={2}
          eyebrow="Buttons"
          description="Four variants × three sizes. Use `buttonStyles()` directly when a non-button element (e.g. a Link) needs to look like one."
        >
          Calls to action
        </Heading>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Button variant="primary" size="sm">
            Primary sm
          </Button>
          <Button variant="primary" size="md">
            Primary md
          </Button>
          <Button variant="primary" size="lg">
            Primary lg
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
          <Link
            href="/donate"
            className={buttonStyles({ variant: "secondary", size: "lg" })}
          >
            Donate today
          </Link>
        </div>
      </Section>

      <Section>
        <Heading
          level={2}
          eyebrow="Cards"
          description="Surface for blog posts, programs, and impact stats."
        >
          Reusable surfaces
        </Heading>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <p className="font-heading text-3xl font-bold text-primary-700">
              12K+
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              Students reached across literacy programs.
            </p>
          </Card>
          <Card>
            <p className="font-heading text-3xl font-bold text-primary-700">
              48
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              Community partners across six countries.
            </p>
          </Card>
          <Card>
            <p className="font-heading text-3xl font-bold text-primary-700">
              $1.2M
            </p>
            <p className="mt-1 text-sm text-neutral-600">
              Raised for clean-water infrastructure in 2025.
            </p>
          </Card>
        </div>
      </Section>

      <Section variant="dark">
        <Heading
          level={2}
          align="center"
          tone="inverted"
          eyebrow="Section variants"
          description="Default, muted, and dark surfaces share the same vertical rhythm."
        >
          One rhythm, three surfaces
        </Heading>
      </Section>
    </>
  );
}
