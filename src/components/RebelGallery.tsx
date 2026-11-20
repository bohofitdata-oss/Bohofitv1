import { Reveal } from "@/components/Reveal";
import group from "@/assets/rebel-group-members.jpg.asset.json";
import start from "@/assets/rebel-start-members.jpg.asset.json";
import strength from "@/assets/rebel-strength-members.jpg.asset.json";
import unlimited from "@/assets/rebel-unlimited-members.jpg.asset.json";
import studio from "@/assets/rebel-studio-community.jpg.asset.json";
import spin from "@/assets/rebel-spin-members.jpg.asset.json";
const PHOTOS = [{src:studio.url,caption:"Your studio. Your people."},{src:strength.url,caption:"A little stronger together."},{src:spin.url,caption:"The energy is real."},{src:start.url,caption:"Everyone starts somewhere."},{src:unlimited.url,caption:"Show up. Find your people."},{src:group.url,caption:"More than a workout."}];
export function RebelGallery(){return <section className="creative-section gallery-remix"><div className="container mx-auto px-5 md:px-8"><Reveal><p className="rebel-label mb-4">Bangalore. Together.</p><h2 className="editorial-title">Your studio.<br/>Your people.</h2></Reveal></div><div className="community-filmstrip">{PHOTOS.map(({src,caption},i)=><figure key={src} className={`community-frame frame-${i%3}`}><img src={src} alt={caption} loading="lazy"/><figcaption className="font-mono text-xs">{caption}</figcaption></figure>)}</div></section>}
