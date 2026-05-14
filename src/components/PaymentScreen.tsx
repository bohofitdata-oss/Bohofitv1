import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CreditCard, Loader2, ShieldCheck } from "lucide-react";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/lib/razorpay.functions";

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => { open: () => void };
  }
}

type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
};

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export interface PaymentScreenProps {
  bookingId: string;
  amountInr: number;
  programLabel: string;
  planLabel?: string | null;
  slotLabel?: string | null;
  customer: { name: string; email: string; phone: string };
  onPaid: () => void;
}

export function PaymentScreen({ bookingId, amountInr, programLabel, planLabel, slotLabel, customer, onPaid }: PaymentScreenProps) {
  const createOrder = useServerFn(createRazorpayOrder);
  const verifyPayment = useServerFn(verifyRazorpayPayment);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const startCheckout = async () => {
    setBusy(true);
    setFailed(false);
    try {
      const ok = await loadRazorpay();
      if (!ok) throw new Error("Could not load Razorpay");
      const order = await createOrder({ data: { bookingId, amountPaise: amountInr * 100 } });
      const rzp = new window.Razorpay!({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Bohofit",
        description: programLabel,
        order_id: order.orderId,
        prefill: { name: customer.name, email: customer.email, contact: customer.phone },
        theme: { color: "#D4AF37" },
        handler: async (response) => {
          try {
            await verifyPayment({
              data: {
                bookingId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
            });
            toast.success("Payment confirmed");
            onPaid();
          } catch (err) {
            const msg = err instanceof Error ? err.message : "Verification failed";
            setFailed(true);
            toast.error(msg);
          } finally {
            setBusy(false);
          }
        },
        modal: {
          ondismiss: () => {
            setBusy(false);
            setFailed(true);
          },
        },
      });
      rzp.open();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Could not start payment";
      toast.error(msg);
      setBusy(false);
      setFailed(true);
    }
  };

  // Auto-open checkout once on mount.
  useEffect(() => {
    startCheckout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="container mx-auto max-w-xl px-5 py-20 text-center">
      <div className="mx-auto w-14 h-14 rounded-full bg-gradient-gold flex items-center justify-center">
        <CreditCard className="w-7 h-7 text-primary-foreground" />
      </div>
      <h1 className="mt-6 text-3xl font-black">Complete your payment</h1>
      <div className="mt-4 rounded-2xl border border-border bg-card p-5 text-left">
        <p className="text-sm text-muted-foreground">{programLabel}{planLabel ? ` · ${planLabel}` : ""}{slotLabel ? ` · ${slotLabel}` : ""}</p>
        <p className="mt-2 text-3xl font-black">₹{amountInr.toLocaleString("en-IN")}</p>
        <p className="mt-1 text-xs text-muted-foreground inline-flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Secured by Razorpay</p>
      </div>
      <div className="mt-6">
        <Button size="lg" disabled={busy} onClick={startCheckout} className="bg-gradient-gold text-primary-foreground border-0 hover:opacity-90 w-full">
          {busy ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Opening payment…</>) : (failed ? "Retry payment" : "Pay now")}
        </Button>
        {failed && (
          <p className="mt-3 text-xs text-muted-foreground">Payment didn&rsquo;t go through. Your booking is saved — try again to confirm.</p>
        )}
      </div>
    </section>
  );
}
