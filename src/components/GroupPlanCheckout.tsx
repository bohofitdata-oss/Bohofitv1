import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { GeneralFitnessTerms, allGeneralTermsAccepted, scrollToFirstUncheckedTerm } from "@/components/GeneralFitnessTerms";
import { PaymentScreen } from "@/components/PaymentScreen";
import { prepareGroupCheckout } from "@/lib/group-checkout.functions";
import { type GroupPlan, JOINING_RULES } from "@/lib/group-plans";

export function GroupPlanCheckout({ plan, levelName, onClose }: { plan: GroupPlan; levelName: string; onClose: () => void }) {
  const prepare = useServerFn(prepareGroupCheckout);
  const [terms, setTerms] = useState<Record<string, boolean>>({});
  const [joiningAccepted, setJoiningAccepted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [payment, setPayment] = useState<{ bookingId: string; customer: { name: string; email: string; phone: string } } | null>(null);
  const [paid, setPaid] = useState(false);
  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!allGeneralTermsAccepted(terms)) { scrollToFirstUncheckedTerm(terms); toast.error("Please accept every membership term."); return; }
    if (!joiningAccepted) { toast.error("Please accept the joining rules."); return; }
    const values = new FormData(event.currentTarget);
    const customer = { name: String(values.get("name")), phone: String(values.get("phone")), email: String(values.get("email")) };
    setBusy(true);
    try {
      const result = await prepare({ data: { planId: plan.id, ...customer, age: Number(values.get("age")), city: String(values.get("city")), terms: Object.keys(terms).filter(key => terms[key]), joiningRulesAccepted: true } });
      setPayment({ bookingId: result.bookingId, customer });
    } catch (error) { toast.error(error instanceof Error ? error.message : "We couldn't start checkout."); }
    finally { setBusy(false); }
  };
  return <Dialog open onOpenChange={open => { if (!open) onClose(); }}><DialogContent className="max-w-2xl max-h-[90dvh] overflow-y-auto w-[calc(100%-32px)] rounded-lg">
    <DialogTitle className="text-xl leading-snug">{paid ? "Payment confirmed." : `${levelName} | ${plan.months} months`}</DialogTitle>
    <DialogDescription>{paid ? "Your membership request is confirmed. The team will help you get started." : `₹${plan.price.toLocaleString("en-IN")}/- | All inclusive`}</DialogDescription>
    {paid ? <Button onClick={onClose}>Back to classes</Button> : payment ? <PaymentScreen bookingId={payment.bookingId} amountInr={plan.price} groupPlanId={plan.id} programLabel={`REBÉL Group Classes | ${levelName}`} planLabel={`${plan.months} months`} customer={payment.customer} onPaid={() => setPaid(true)} /> : <form onSubmit={submit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">{[{name:"name",label:"Your name",type:"text"},{name:"phone",label:"Phone",type:"tel"},{name:"email",label:"Email",type:"email"},{name:"age",label:"Age",type:"number"},{name:"city",label:"City",type:"text"}].map(field => <div key={field.name}><Label htmlFor={`group_${field.name}`}>{field.label}</Label><Input className="mt-2" id={`group_${field.name}`} name={field.name} type={field.type} required min={field.name === "age" ? 10 : undefined} max={field.name === "age" ? 100 : undefined} maxLength={field.name === "email" ? 255 : 120} /></div>)}</div>
      <GeneralFitnessTerms checked={terms} onChange={setTerms} />
      <div className="border border-border rounded-lg p-5"><p className="font-mono text-xs text-storefront">BEFORE YOU JOIN — PLEASE READ</p><ol className="mt-4 list-decimal pl-4 space-y-3 text-sm text-muted-foreground">{JOINING_RULES.map(rule => <li key={rule}>{rule}</li>)}</ol><Label className="flex items-start gap-3 mt-5 leading-relaxed"><Checkbox checked={joiningAccepted} onCheckedChange={value => setJoiningAccepted(value === true)} aria-label="I accept the three joining rules" />I accept the three joining rules.</Label></div>
      <Button className="w-full rounded-full h-12" disabled={busy} type="submit">{busy ? "Preparing checkout…" : `Pay ₹${plan.price.toLocaleString("en-IN")}/-`}</Button>
    </form>}
  </DialogContent></Dialog>;
}