import type {CSSProperties, ReactNode} from "react";
import "./apple-motion-preview.css";

type Item = string | {label: string; value?: string | number; detail?: string; color?: string};
type Props = {props: Record<string, any>};
type IconProps = {name?: string | null; className?: string};

const fallbackItems = ["Temukan", "Rancang", "Bangun", "Sempurnakan", "Kirim", "Kembangkan"];
const itemsOf = (items?: Item[]) => (items?.length ? items : fallbackItems).map((item) => typeof item === "string" ? {label: item} : item);
const variantIcon: Record<string, string> = {
  "dark-stage": "microchip", "light-stage": "panels-top-left", "glass-button": "mouse-pointer-click",
  toggle: "toggle-right", "segment-control": "settings", metric: "gauge", "line-chart": "chart-no-axes-combined",
  comparison: "activity", "data-flow": "route", table: "table-2", "screen-window": "monitor",
  "presenter-graphic": "presentation", "big-statement": "zap", "process-network": "network",
  "summary-steps": "list-checks", "icon-footage": "microchip",
};
const nodeIcons = ["workflow", "panels-top-left", "microchip", "monitor"];
const networkIcons = ["network", "workflow", "cpu", "microchip", "route", "monitor"];
const stepIcons = ["workflow", "gauge", "monitor"];

const Icon = ({name, className = ""}: IconProps) => name ? <i className={`ap-symbol ${className}`} style={{WebkitMaskImage: `url(/icons/lucide/${name}.svg)`, maskImage: `url(/icons/lucide/${name}.svg)`}} /> : null;
const Card = ({children, className = ""}: {children: ReactNode; className?: string}) => <div className={`ap-card ${className}`}>{children}</div>;
const Intro = ({title, subtitle, tag}: {title: string; subtitle: string; tag: string}) => <header className="ap-intro"><small>{tag}</small><h2>{title}</h2><p>{subtitle}</p></header>;

export default function AppleMotionPreview({props}: Props) {
  const variant = String(props.variant || "dark-stage");
  const title = String(props.title || "Dirancang untuk langkah berikutnya.");
  const subtitle = String(props.subtitle || "Ide kuat yang disampaikan dengan jelas.");
  const primary = String(props.primary || "#2997ff");
  const items = itemsOf(props.items);
  const labels: string[] = props.labels || [];
  const value = props.value ?? "Lanjutkan";
  const style = {"--ap-primary": primary, "--ap-bg": props.background || (variant === "light-stage" ? "#f5f5f7" : "#050506")} as CSSProperties;
  const resolvedIcon = props.icon === "none" ? null : String(props.icon || variantIcon[variant]);
  const semanticIcon = (fallback: string) => props.icon === "none" ? null : String(props.icon || fallback);
  let visual: ReactNode;

  if (variant === "icon-footage") visual = <div className="ap-icon-footage"><div className="ap-icon-rings"><Icon name={props.icon === "none" ? null : String(props.icon || "microchip")} /></div><h2>{title}</h2><p>{subtitle}</p></div>;
  else if (variant === "dark-stage") visual = <div className="ap-stage ap-dark-stage"><Intro title={title} subtitle={subtitle} tag="SISTEM · AKTIVASI"/><div className="ap-chip"><span className="ap-chip-scan"/><Icon name={resolvedIcon}/><i/><i/><i/><i/><b>INTI AKTIF</b></div></div>;
  else if (variant === "light-stage") visual = <div className="ap-stage ap-light-stage"><header className="ap-editorial"><small>EDISI PRODUK · 02</small><h2>{title.split(" ").slice(0, -2).join(" ") || title}</h2><em>{title.split(" ").slice(-2).join(" ")}</em><p>{subtitle}</p></header><div className="ap-panels"><i/><i/><i/><Icon name={resolvedIcon}/></div></div>;
  else if (variant === "glass-button") visual = <><Intro title={title} subtitle={subtitle} tag="INTERAKSI · KLIK"/><div className="ap-action"><button>{value}<span><Icon name="list-checks"/>Berhasil diterapkan</span></button><Icon name={resolvedIcon} className="ap-pointer"/><i className="ap-ripple"/></div></>;
  else if (variant === "toggle") visual = <><Intro title={title} subtitle={subtitle} tag="INTERAKSI · SAKELAR"/><div className="ap-toggle-wrap"><div className="ap-toggle"><i/><span/></div><Icon name={resolvedIcon} className="ap-toggle-pointer"/><b>PERFORMA AKTIF</b></div></>;
  else if (variant === "segment-control") { const choices = labels.length ? labels : ["Otomatis", "Hemat Daya", "Performa Tinggi"]; const selected = Math.min(choices.length - 1, Math.max(0, Number(value) || choices.length - 1)); visual = <><Intro title={title} subtitle={subtitle} tag="INTERAKSI · MODE"/><div className="ap-mode"><Icon name={resolvedIcon}/><div className="ap-segments">{choices.map((label, i) => <span className={i === selected ? "active" : ""} key={label}>{label}</span>)}</div><small>MODE TERPILIH · {choices[selected]}</small></div></>; }
  else if (variant === "metric") visual = <><Intro title={title} subtitle={subtitle} tag="TELEMETRI · LANGSUNG"/><Card className="ap-metric"><div className="ap-gauge"><svg viewBox="0 0 240 150"><path d="M25 130 A100 100 0 1 1 215 130"/><path className="active" d="M25 130 A100 100 0 1 1 215 130"/></svg><Icon name={resolvedIcon}/></div><section><small>NILAI SAAT INI</small><strong>{value}</strong><b>↗ {props.secondaryValue || "+18,4%"}</b></section></Card></>;
  else if (variant === "line-chart") visual = <><Intro title={title} subtitle={subtitle} tag="ANALISIS · TREN"/><Card className="ap-chart"><header><Icon name={resolvedIcon}/><b>{value}</b><span>PERTUMBUHAN +24,8%</span></header><svg viewBox="0 0 600 170"><path d="M5 145 C70 142 80 122 145 126 S210 78 275 94 S345 48 410 61 S505 22 595 30"/><circle cx="595" cy="30" r="5"/></svg><footer>{(labels.length ? labels : ["MULAI", "PROSES", "HASIL"]).map(x => <span key={x}>{x}</span>)}</footer></Card></>;
  else if (variant === "comparison") { const before = items[0], after = items[1]; visual = <><Intro title={title} subtitle={subtitle} tag="PERBANDINGAN · DAMPAK"/><Card className="ap-comparison"><section><small>SEBELUM</small><b>{before.label}</b><strong>{before.value || "92%"}</strong><i className="wave rough"/></section><section><small>SESUDAH</small><b>{after.label}</b><strong>{after.value || "37%"}</strong><div><Icon name={resolvedIcon}/><i className="wave calm"/></div></section><span className="ap-sweep"/></Card></>; }
  else if (variant === "data-flow") visual = <><Intro title={title} subtitle={subtitle} tag="ALUR · SISTEM"/><div className="ap-flow">{items.slice(0, 4).map((item, index) => <div className="ap-flow-part" key={item.label}><Card><Icon name={index === 2 ? resolvedIcon : nodeIcons[index]}/><b>{item.label}</b><small>AKTIF</small></Card>{index < 3 && <span><i/></span>}</div>)}</div><b className="ap-complete">ALUR SELESAI · HASIL SIAP</b></>;
  else if (variant === "table") visual = <><Intro title={title} subtitle={subtitle} tag="AUDIT · PERANGKAT"/><Card className="ap-table"><header><Icon name={resolvedIcon}/>TABEL KONFIGURASI</header><div className="ap-table-grid">{(labels.length ? labels : ["NAMA", "NILAI", "STATUS"]).slice(0, 3).map(x => <b key={x}>{x}</b>)}{items.slice(0, 4).flatMap((item, i) => [<strong key={`${item.label}-a`}>{item.label}</strong>, <span key={`${item.label}-b`}>{item.value || `${88 - i * 7}%`}</span>, <em key={`${item.label}-c`}>✓ {item.detail || "Aktif"}</em>])}<i className="ap-table-scan"/></div></Card></>;
  else if (variant === "screen-window") visual = <><div className="ap-screen-title"><small>TAMPILAN · PENGATURAN</small><h2>{title}</h2><p>{subtitle}</p></div><Card className="ap-window"><Icon name={resolvedIcon} className="ap-monitor-seed"/><header><i/><i/><i/><b>PENGATURAN GRAFIS</b></header><main><nav>{["Sistem", "Layar", "Grafis", "Tentang"].map(x => <span key={x}>{x}</span>)}</nav><section><small>APLIKASI AKTIF</small><h3>Preferensi performa grafis</h3><div>Hemat daya · Grafis bawaan</div><div className="selected">Performa tinggi · GPU dedicated <b>✓ Dipilih</b></div></section></main><Icon name={semanticIcon("mouse-pointer-click")} className="ap-window-pointer"/></Card></>;
  else if (variant === "presenter-graphic") visual = <div className="ap-presenter"><div className="ap-person"><span/><small>PRESENTER · UTAMA</small><em>Penjelasan yang meyakinkan</em></div><Card><small>INTI PEMBAHASAN</small><h2>{title}</h2><em>{subtitle}</em><i/><p>Informasi utama hadir berdampingan dengan presenter, tetap jelas dan personal.</p></Card><span className="ap-present-line"/><Icon name={resolvedIcon} className="ap-present-icon"/></div>;
  else if (variant === "big-statement") visual = <div className="ap-big"><div className="ap-charge"><i/><Icon name={resolvedIcon}/><i/></div><h2>{title.split(" ").map((word, i) => <span key={`${word}-${i}`}>{word}</span>)}</h2><p>{subtitle}</p></div>;
  else if (variant === "process-network") visual = <><Intro title={title} subtitle={subtitle} tag="ORKESTRASI · JARINGAN"/><div className="ap-network">{items.slice(0, 6).map((item, index) => <Card className={`node n${index}`} key={item.label}><Icon name={index === 0 ? resolvedIcon : networkIcons[index]}/><b>{item.label}</b></Card>)}{[1,2,3,4,5].map(i => <i className={`link l${i}`} key={i}><span/></i>)}</div><b className="ap-complete">SEMUA SISTEM TERHUBUNG</b></>;
  else visual = <><div className="ap-summary-head"><Intro title={title} subtitle={subtitle} tag="RINGKASAN · TIGA LANGKAH"/></div><div className="ap-steps">{items.slice(0, 3).map((item, index) => <Card key={item.label}><header><Icon name={stepIcons[index]}/><strong>0{index + 1}</strong></header><b>{item.label}</b><span>{item.detail || "Tahap utama untuk hasil yang konsisten."}</span><small>✓ SELESAI</small></Card>)}</div><div className="ap-step-done"><Icon name={resolvedIcon}/>SEMUA LANGKAH TUNTAS</div></>;

  return <div className={`apple-preview ap-${variant} ${variant === "light-stage" ? "light" : ""}`} style={style}>{visual}<div className="ap-glow"/></div>;
}
