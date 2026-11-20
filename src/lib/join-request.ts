import { z } from "zod";
import { waLink, BOHOFIT_WHATSAPP } from "./whatsapp";

export const trialRequestSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(6).max(20),
  email: z.string().trim().email().max(255),
  age: z.number().int().min(10).max(100),
  city: z.string().trim().min(1).max(80),
  goal: z.string().trim().min(3).max(500),
});

export function joinWhatsAppLink(input: z.infer<typeof trialRequestSchema>, plan?: string) {
  const data = trialRequestSchema.parse(input);
  return waLink(BOHOFIT_WHATSAPP, ["Hello REBÉL, I'd like to join Group Classes.",
    `Name: ${data.name}`, `Phone: ${data.phone}`, `Email: ${data.email}`,
    `Age: ${data.age}`, `City: ${data.city}`, `Goal: ${data.goal}`,
    plan ? `Plan: ${plan.slice(0, 120)}` : "Free trial enquiry",
  ].join("\n"));
}