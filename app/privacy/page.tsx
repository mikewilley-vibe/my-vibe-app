import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/app/components/motion/FadeIn";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for the My Vibe app by Michael Willey. What stays on your phone, what calendar access is used for, and which public feeds the app requests.",
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="font-display text-2xl font-semibold tracking-tight text-[var(--ink)]">
        {title}
      </h2>
      <div className="space-y-3 text-base leading-relaxed text-[var(--ink-muted)]">
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pb-16">
      <article className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <FadeIn>
          <header className="mb-10 space-y-3">
            <p className="label-xs">My Vibe</p>
            <h1 className="headline-lg">Privacy Policy</h1>
            <div className="accent-rule" />
            <p className="text-base sm:text-lg text-[var(--ink-muted)] leading-relaxed">
              This policy covers the My Vibe mobile app, published by Michael Willey.
              It describes what the app stores, what it asks to see, and which services
              it contacts. Effective date: September 24, 2026.
            </p>
          </header>
        </FadeIn>

        <FadeIn delay={0.08}>
          <div className="space-y-10 rounded-2xl border border-[var(--fog)] bg-white/90 p-6 shadow-sm sm:p-8">
            <Section title="What My Vibe is">
              <p>
                My Vibe is a personal companion for the week. It shows a family Google
                calendar, lets you save plans on your phone, lists upcoming concerts
                around Hampton Roads, Richmond, and Washington, DC, and shows University
                of Virginia football and men&apos;s basketball schedules.
              </p>
              <p>
                The app does not ask you to create an account or sign in. There is no
                username, password, or profile stored by the developer.
              </p>
            </Section>

            <Section title="Information stored on your phone">
              <p>
                Plans you create or save stay in the app&apos;s storage on that device.
                A plan can include:
              </p>
              <ul className="list-disc space-y-2 pl-5">
                <li>a title</li>
                <li>a start time and an end time</li>
                <li>a location you type, such as a venue or address</li>
                <li>notes you type</li>
                <li>an optional link, such as a ticket page</li>
                <li>
                  an identifier for the plan, and, if you add it to a calendar, the
                  identifier of that calendar event
                </li>
              </ul>
              <p>
                The app also remembers which lists you have chosen to show on the
                calendar, such as saved plans, Google calendar events, concerts, and
                UVA games. Those choices stay on the device.
              </p>
              <p>
                This information is not uploaded to an account I operate, and it does
                not sync to your other phones. A new plan you type gets a random
                identifier generated on the device. A saved concert or game uses the
                public id from that listing.
              </p>
            </Section>

            <Section title="Calendar">
              <p>
                My Vibe asks for calendar permission so it can add a plan you choose
                and check whether that plan is already on a calendar. iOS and Android
                show the system permission prompt. You can decline. Saved plans remain
                in the app either way.
              </p>
              <p>When you add a plan, the app writes:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>the title, start, end, location text, and notes</li>
                <li>on iPhone, a link when the plan has one</li>
                <li>
                  a short marker in the notes so the app can recognize that event later
                  and avoid adding it a second time
                </li>
              </ul>
              <p>
                To make that check, the app reads calendar names on the device and
                events near the plan&apos;s dates, including title, time, location, and
                notes. If you have already allowed calendar access, the app can also
                read events from Google calendars on the phone to show them in its
                month view. Those events are displayed on the device. They are not
                sent to me.
              </p>
              <p>
                The Calendar tab loads a public family Google Calendar inside the app,
                the same calendar published on mikewilley.app. My Vibe does not sign
                you into Google and does not use a Google account login. Google
                receives the request to load that page under{" "}
                <a
                  href="https://policies.google.com/privacy"
                  className="font-semibold text-[var(--harbor)] underline decoration-[var(--harbor)]/30 underline-offset-2 hover:decoration-[var(--harbor)]"
                >
                  Google&apos;s privacy policy
                </a>
                . If you add a plan to a Google calendar already on your phone, the
                phone&apos;s calendar writes the event. Google receives it when that
                calendar syncs with Google.
              </p>
              <p>
                You can turn calendar access off in the system Settings app. Events
                already on a calendar stay there until you delete them in Calendar.
              </p>
            </Section>

            <Section title="Concerts">
              <p>
                The Shows tab requests upcoming concerts from ShowSignal at
                concert-finder-eta.vercel.app. The request names the region you pick —
                Hampton Roads, Richmond, or Washington, DC — as a fixed map point and
                search radius for that city, plus a page size. It does not include
                your name, an account, or your phone&apos;s GPS location. My Vibe does
                not request location permission.
              </p>
              <p>
                ShowSignal looks up public event listings from Ticketmaster. Ticketmaster
                credentials stay on ShowSignal&apos;s server. My Vibe does not send
                Ticketmaster your name or a device identifier.
              </p>
              <p>
                Saving a show stores the concert name, time, venue, and ticket link on
                your phone as a plan. Open in ShowSignal opens that concert in the
                ShowSignal app, or on the ShowSignal website if the app is not
                installed, and the link includes the concert&apos;s public id. Tickets
                and details opens the ticket page in your browser. Those sites handle
                that visit under their own policies.
              </p>
            </Section>

            <Section title="UVA schedules">
              <p>
                Football and men&apos;s basketball schedules are loaded from public
                feeds on mikewilley.app. That site requests the public schedule from
                ESPN and returns games to the app. The app&apos;s request does not
                include an account, a name, or a location. ESPN is not contacted
                directly by the app.
              </p>
              <p>
                You can save a game as a plan on your phone. That copy stays on the
                device, the same way other plans do.
              </p>
            </Section>

            <Section title="Other apps and links">
              <p>
                My Projects can open related apps that are installed on your phone,
                including ShowSignal and SweatShift, using their links. Opening
                SweatShift does not send workouts to me. No workout feed is configured,
                so My Vibe does not request, download, or upload workout history.
              </p>
              <p>
                Venue pages and other website links open in the browser. Whatever you
                do on those sites is covered by their policies, not this one.
              </p>
            </Section>

            <Section title="What the app does not collect">
              <p>My Vibe does not include:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>an account, sign-in, or email address collected in the app</li>
                <li>precise location, GPS, or a location permission</li>
                <li>push notifications</li>
                <li>advertising, cross-app tracking, or an advertising identifier</li>
                <li>an analytics or crash-reporting service</li>
                <li>a sale or share of personal information</li>
              </ul>
              <p>
                The mikewilley.app website uses its own server database to watch venue
                calendars. That database is not part of the app, and the app does not
                read or write it.
              </p>
            </Section>

            <Section title="Third parties">
              <p>Services the app contacts, and why:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>
                  <span className="font-semibold text-[var(--ink)]">Apple.</span> The
                  App Store distributes the app. The iOS calendar stores events you
                  choose to add.
                </li>
                <li>
                  <span className="font-semibold text-[var(--ink)]">Google.</span> The
                  family calendar page is loaded from Google. A Google calendar on
                  your phone receives an event only when you add a plan to it.
                </li>
                <li>
                  <span className="font-semibold text-[var(--ink)]">ShowSignal.</span>{" "}
                  Supplies the concert list for the region you select.
                </li>
                <li>
                  <span className="font-semibold text-[var(--ink)]">Ticketmaster.</span>{" "}
                  Public event listings, requested by ShowSignal. A ticket link opens
                  Ticketmaster, or another ticket site, in your browser.
                </li>
                <li>
                  <span className="font-semibold text-[var(--ink)]">mikewilley.app.</span>{" "}
                  Public UVA football and men&apos;s basketball schedules. The site is
                  hosted on Vercel.
                </li>
                <li>
                  <span className="font-semibold text-[var(--ink)]">ESPN.</span> Public
                  schedule data, requested by mikewilley.app and then shown in the app.
                </li>
              </ul>
              <p>
                Those requests use the internet, so the service that answers can see
                ordinary connection details such as an IP address and the time of the
                request. I do not use those requests to build a profile or an account
                for you.
              </p>
            </Section>

            <Section title="How long information is kept, and how to delete it">
              <p>
                Plans and display settings remain on the phone until you remove them
                or delete the app.
              </p>
              <p>
                To delete one plan, open it and choose Remove from My Vibe. That
                removes the copy stored in the app. An event already added to your
                calendar stays in that calendar until you delete it there.
              </p>
              <p>
                Deleting My Vibe removes the plans and settings stored by the app on
                that device. There is no online account to close.
              </p>
              <p>
                Hosts that answer concert and schedule requests may keep short-lived
                connection logs for security and operations. Those logs are not a
                record of your plans.
              </p>
            </Section>

            <Section title="Children">
              <p>
                My Vibe is not directed to children under 13, and I do not knowingly
                collect personal information from children under 13. If you believe a
                child under 13 has sent personal information through the app, email{" "}
                <a
                  href="mailto:mikewilley@gmail.com"
                  className="font-semibold text-[var(--harbor)] underline decoration-[var(--harbor)]/30 underline-offset-2 hover:decoration-[var(--harbor)]"
                >
                  mikewilley@gmail.com
                </a>{" "}
                and I will delete it.
              </p>
            </Section>

            <Section title="Changes">
              <p>
                If this policy changes, I will update this page and the effective date
                at the top. The date on this version is September 24, 2026.
              </p>
            </Section>

            <Section title="Contact">
              <p>
                Michael Willey
                <br />
                <a
                  href="mailto:mikewilley@gmail.com"
                  className="font-semibold text-[var(--harbor)] underline decoration-[var(--harbor)]/30 underline-offset-2 hover:decoration-[var(--harbor)]"
                >
                  mikewilley@gmail.com
                </a>
              </p>
              <p>
                Support and common questions are on the{" "}
                <Link
                  href="/support"
                  className="font-semibold text-[var(--harbor)] underline decoration-[var(--harbor)]/30 underline-offset-2 hover:decoration-[var(--harbor)]"
                >
                  support page
                </Link>
                .
              </p>
            </Section>
          </div>
        </FadeIn>
      </article>
    </div>
  );
}
