import { useEffect, useState } from "react";
import { Download, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AssetDownloadButton({ url, filename, label = "Download routine" }: { url: string; filename: string; label?: string }) {
  const [blob, setBlob] = useState<Blob | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    setBlob(null); setFailed(false);
    void fetch(url, { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error("Download unavailable");
      const file = await response.blob();
      if (!file.size || !file.type.startsWith("image/")) throw new Error("Invalid file");
      if (!controller.signal.aborted) setBlob(file);
    }).catch(() => { if (!controller.signal.aborted) setFailed(true); });
    return () => controller.abort();
  }, [url]);
  const download = () => {
    if (!blob) return;
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = objectUrl; anchor.download = filename;
    document.body.appendChild(anchor); anchor.click(); anchor.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 30_000);
  };
  if (failed) return <Button asChild variant="outline" className="rounded-full h-11"><a href={url} target="_blank" rel="noopener noreferrer"><Download className="size-4"/>Open {label.toLowerCase().replace("download ", "")}</a></Button>;
  return <Button variant="outline" className="rounded-full h-11" disabled={!blob} onClick={download}>{blob ? <Download className="size-4"/> : <LoaderCircle className="size-4 animate-spin"/>}{label}</Button>;
}
