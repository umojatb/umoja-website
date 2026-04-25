import { Container } from "@/components/ui/container";

export default function HomePage() {
  return (
    <Container className="flex flex-1 items-center justify-center py-16 text-center">
      <div>
        <p className="font-heading text-sm uppercase tracking-[0.2em] text-secondary-500">
          Umoja Africa
        </p>
        <h1 className="mt-2 text-4xl text-primary-700 sm:text-5xl">
          Layout system ready
        </h1>
        <p className="mt-3 max-w-md text-neutral-500">
          Global navbar, footer, and container are in place. Page content
          starts on the next branch.
        </p>
      </div>
    </Container>
  );
}
