import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="container mx-auto px-5 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-block w-6 h-6 rounded-md bg-gradient-gold" />
            <span className="font-black tracking-tight">Bohofit</span>
          </div>
          <p className="text-sm text-muted-foreground">India&rsquo;s first machine-free fitness system.</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Programs</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/bohofit" className="hover:text-foreground">Bohofit Classes</Link></li>
            <li><Link to="/bootcamp" className="hover:text-foreground">8-Week Bootcamp</Link></li>
            <li><Link to="/longevity" className="hover:text-foreground">Longevity 1:1</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/diet" className="hover:text-foreground">Go Boho Diet</Link></li>
            <li><Link to="/booking" className="hover:text-foreground">Book a call</Link></li>
            <li><Link to="/auth" className="hover:text-foreground">Member login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-3">Promise</h4>
          <p className="text-sm text-muted-foreground">Visible transformation in 8 weeks with compliance, or your next month free.</p>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} Bohofit. Machine-free fitness for life.
      </div>
    </footer>
  );
}
