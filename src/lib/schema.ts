import { z } from "zod";
import { siteConfig } from "./site";

const MIN_TEAM = siteConfig.teamSize.min; // 2 (Capo + 1)
const MAX_MEMBERS = siteConfig.teamSize.max - 1; // 3 additional members

export const TshirtSizeSchema = z.enum(
  siteConfig.tshirtSizes as unknown as [string, ...string[]],
);
export const TrackIdsSchema = z.enum(
  siteConfig.tracks.map((t) => t.id) as unknown as [string, ...string[]],
);

export const MemberSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Enter the full name.")
    .regex(/^[A-Za-z][A-Za-z .'-]*$/, "Use letters, spaces, dots and hyphens only."),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address.")
    .refine((e) => /@/.test(e), "Enter a valid email address."),
  department: z
    .string()
    .trim()
    .min(2, "Enter the department / branch.")
    .max(80, "Keep the department name under 80 characters."),
  year: z.enum(["I", "II", "III", "IV"], {
    error: () => ({ message: "Select the year of study." }),
  }),
});

export const LeaderSchema = MemberSchema.extend({
  phone: z
    .string()
    .trim()
    .regex(
      /^(\+91[\s-]?)?[0]?[6-9]\d{9}$/,
      "Enter a valid 10-digit Indian mobile number, e.g. 98765 43210.",
    ),
  registerNumber: z
    .string()
    .trim()
    .min(5, "Enter a valid register number.")
    .max(20, "Register number looks too long.")
    .regex(/^[A-Za-z0-9/._-]+$/, "Use letters, numbers, dots or slashes only."),
  confirmEmail: z.string().trim().toLowerCase(),
});

export const RegistrationSchema = z
  .object({
    teamName: z
      .string()
      .trim()
      .min(2, "Give the team a name — at least 2 characters.")
      .max(60, "Keep the team name under 60 characters.")
      .regex(/^[A-Za-z0-9][A-Za-z0-9 .'&\-]*$/, "Letters, numbers, spaces and basic punctuation only."),
    leader: LeaderSchema,
    members: z
      .array(MemberSchema)
      .min(MIN_TEAM - 1, `A team needs at least ${MIN_TEAM} members — add one more.`)
      .max(MAX_MEMBERS, `A team can have at most ${siteConfig.teamSize.max} members.`),
    track: TrackIdsSchema,
    heardAbout: z
      .string()
      .trim()
      .min(2, "Tell us how you heard about the event.")
      .max(60, "Keep this brief."),
    tshirtSize: TshirtSizeSchema.or(z.literal("")).optional(),
    agreeToCode: z.literal(true, {
      error: () => ({ message: "You must agree to The Family Code before registering." }),
    }),
  })
  .superRefine((data, ctx) => {
    if (data.leader.confirmEmail !== data.leader.email) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["leader", "confirmEmail"],
        message: "The emails do not match.",
      });
    }
  });

export type RegistrationInput = z.infer<typeof RegistrationSchema>;
export type LeaderInput = z.infer<typeof LeaderSchema>;
export type MemberInput = z.infer<typeof MemberSchema>;

export interface APIErrorBody {
  error: string;
  fieldErrors?: Record<string, string[]>;
}

export interface APISuccessBody {
  registrationId: string;
  emailDelivered: boolean;
}