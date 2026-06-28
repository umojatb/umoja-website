import { ImageTextSection } from "../../src/components/sections/image-text-section";

const PLACEHOLDER_IMG = {
  src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23e8edf2'/%3E%3Cpath d='M340 230 L460 230 L400 310Z' fill='%23b0bec5'/%3E%3Ccircle cx='400' cy='210' r='25' fill='%23b0bec5'/%3E%3C/svg%3E",
  alt: "Students working together in a library",
};

export function Preview() {
  return (
    <div style={{ background: "#fff" }}>
      <ImageTextSection
        eyebrow="Our approach"
        title="Holistic support from application to graduation"
        description="Every Umoja scholar receives a full scholarship, a dedicated mentor, and access to a network of educators and community partners. We walk with students through every step — not just the first."
        image={PLACEHOLDER_IMG}
        cta={{ label: "Learn how we select scholars", href: "#", variant: "outline" }}
      />
      <ImageTextSection
        eyebrow="Community partnerships"
        title="Built on trust with local schools and families"
        description="We work closely with head teachers, parents, and local leaders to identify students who are both academically gifted and in genuine financial need."
        image={PLACEHOLDER_IMG}
        reverse
        variant="soft"
        cta={{ label: "Meet our partners", href: "#", variant: "primary" }}
      />
    </div>
  );
}
