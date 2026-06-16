import ContactForm from "@/components/sections/ContactForm";

export default function ContactPage() {
  return (
    <main className="px-5 py-16 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <p className="label-caps text-mint">BOOKINGS</p>
        <h1 className="mt-3 text-4xl font-light tracking-[-0.03em] text-accent md:text-5xl">
          Get in touch
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          Fashion campaigns, brand shoots, fitness editorials, and commercial
          work — share your brief and Syed will respond promptly.
        </p>
        <div className="mt-12">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}