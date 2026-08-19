import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Mail, Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { SocialIcons } from "@/components/layout/SocialIcons";
import { Button, LinkButton, Reveal, Section, SectionHeading } from "@/components/ui/primitives";
import { ApiError, contactFormEnabled, sendContact } from "@/lib/api";
import { cn } from "@/lib/cn";
import type { Profile } from "@/lib/types";

/**
 * Mirrors the server-side constraints in `ContactRequest` exactly. If these drift, the user
 * gets a confusing round trip where the client accepts input the server then rejects.
 */
const schema = z.object({
  name: z.string().min(2, "Please enter your name.").max(80, "That name is too long."),
  email: z.email("Please enter a valid email address."),
  subject: z.string().min(2, "Please add a subject.").max(120, "That subject is too long."),
  message: z
    .string()
    .min(20, "Please write at least 20 characters.")
    .max(4000, "That message is too long."),
  website: z.string().max(0).optional(),
});

type FormValues = z.infer<typeof schema>;

type Status = { kind: "idle" } | { kind: "sent" } | { kind: "error"; message: string };

function fieldClasses(hasError: boolean): string {
  return cn(
    "w-full rounded-xl border bg-surface px-4 py-3 text-[0.9375rem] text-ink",
    "placeholder:text-fade transition-colors duration-200",
    "focus:outline-none focus-visible:border-accent",
    hasError ? "border-red-500/60" : "border-hairline hover:border-hairline-strong",
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-[0.8125rem] text-red-500">
      <AlertCircle size={13} aria-hidden />
      {message}
    </p>
  );
}

/**
 * Shown instead of the form on a static build. A form that posts nowhere is worse than an
 * honest mail link, so the CTA changes rather than the form silently failing on submit.
 */
function EmailPanel({ profile }: { profile: Profile }) {
  return (
    <div className="rounded-3xl border border-hairline bg-surface p-7 md:p-9">
      <Mail size={20} aria-hidden className="text-accent" />
      <h3 className="mt-5 text-[1.25rem] font-semibold tracking-tight text-ink">
        Send me an email
      </h3>
      <p className="mt-3 max-w-[46ch] text-[0.9375rem] leading-[1.7] text-muted">
        The quickest way to reach me. I read everything and reply to anything that is not a
        cold sales pitch.
      </p>
      <div className="mt-7">
        <LinkButton href={`mailto:${profile.email}`}>
          {profile.email}
          <Mail size={15} aria-hidden />
        </LinkButton>
      </div>
    </div>
  );
}

export function Contact({ profile }: { profile: Profile }) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", subject: "", message: "", website: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setStatus({ kind: "idle" });
    try {
      await sendContact({ ...values, website: values.website ?? "" });
      setStatus({ kind: "sent" });
      reset();
    } catch (error) {
      if (error instanceof ApiError) {
        // Map server-side validation back onto the offending inputs.
        if (error.fieldErrors.length > 0) {
          for (const fieldError of error.fieldErrors) {
            if (fieldError.field in values) {
              setError(fieldError.field as keyof FormValues, {
                message: fieldError.message,
              });
            }
          }
          setStatus({ kind: "error", message: "Please check the highlighted fields." });
          return;
        }
        if (error.status === 429) {
          setStatus({
            kind: "error",
            message: "You have sent several messages already. Please try again later.",
          });
          return;
        }
      }
      setStatus({
        kind: "error",
        message: `Message could not be sent. You can email me directly at ${profile.email}.`,
      });
    }
  });

  return (
    <Section id="contact" labelledBy="contact-heading">
      <div className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            id="contact-heading"
            eyebrow="Contact"
            title="Let us build something"
            description="Whether it is research, an internship, or a system that needs to be provably correct — I would like to hear about it."
          />

          <Reveal delay={120}>
            <div className="mt-10">
              <a
                href={`mailto:${profile.email}`}
                className="text-[1.0625rem] font-medium text-ink underline decoration-hairline-strong underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
              >
                {profile.email}
              </a>
              <p className="mt-2 text-[0.9375rem] text-fade">{profile.location}</p>
              <div className="mt-6">
                <SocialIcons socials={profile.socials} />
              </div>
            </div>
          </Reveal>
        </div>

        <div className="lg:col-span-7">
          <Reveal delay={80}>
            {!contactFormEnabled ? <EmailPanel profile={profile} /> : null}
            {contactFormEnabled ? (
            <form
              onSubmit={onSubmit}
              noValidate
              className="relative rounded-3xl border border-hairline bg-surface p-7 md:p-9"
            >
              {/*
                Honeypot. Hidden from sight and from assistive tech, and excluded from the tab
                order, so only an automated filler will ever populate it.
              */}
              <div aria-hidden className="absolute h-0 w-0 overflow-hidden opacity-0">
                <label htmlFor="website">Leave this field empty</label>
                <input id="website" tabIndex={-1} autoComplete="off" {...register("website")} />
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="text-caption text-fade">
                    Name
                  </label>
                  <input
                    id="name"
                    autoComplete="name"
                    placeholder="Ada Lovelace"
                    aria-invalid={Boolean(errors.name)}
                    className={cn("mt-2", fieldClasses(Boolean(errors.name)))}
                    {...register("name")}
                  />
                  <FieldError message={errors.name?.message} />
                </div>

                <div>
                  <label htmlFor="email" className="text-caption text-fade">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                    className={cn("mt-2", fieldClasses(Boolean(errors.email)))}
                    {...register("email")}
                  />
                  <FieldError message={errors.email?.message} />
                </div>
              </div>

              <div className="mt-5">
                <label htmlFor="subject" className="text-caption text-fade">
                  Subject
                </label>
                <input
                  id="subject"
                  placeholder="What is this about?"
                  aria-invalid={Boolean(errors.subject)}
                  className={cn("mt-2", fieldClasses(Boolean(errors.subject)))}
                  {...register("subject")}
                />
                <FieldError message={errors.subject?.message} />
              </div>

              <div className="mt-5">
                <label htmlFor="message" className="text-caption text-fade">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={6}
                  placeholder="Tell me a little about what you have in mind."
                  aria-invalid={Boolean(errors.message)}
                  className={cn("mt-2 resize-y", fieldClasses(Boolean(errors.message)))}
                  {...register("message")}
                />
                <FieldError message={errors.message?.message} />
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Sending…" : "Send message"}
                  {!isSubmitting ? <Send size={15} aria-hidden /> : null}
                </Button>

                <div aria-live="polite" className="text-[0.875rem]">
                  {status.kind === "sent" ? (
                    <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <CheckCircle2 size={15} aria-hidden />
                      Thanks — your message has been received.
                    </span>
                  ) : null}
                  {status.kind === "error" ? (
                    <span className="flex items-center gap-2 text-red-500">
                      <AlertCircle size={15} aria-hidden />
                      {status.message}
                    </span>
                  ) : null}
                </div>
              </div>
            </form>
            ) : null}
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
