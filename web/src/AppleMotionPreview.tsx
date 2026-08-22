import type {CSSProperties, ReactNode} from "react";
import "./apple-motion-preview.css";

type Item = string | {label: string; value?: string | number; detail?: string; color?: string};
type Props = {props: Record<string, any>};

const itemsOf = (items?: Item[]) => (items || []).map((item) => typeof item === "string" ? {label: item} : item);
const variantIcon: Record<string, string> = {
  "dark-stage": "microchip", "light-stage": "panels-top-left", "glass-button": "mouse-pointer-click",
  toggle: "toggle-right", "segment-control": "settings", metric: "gauge", "line-chart": "chart-no-axes-combined",
  comparison: "activity", "data-flow": "route", table: "table-2", "screen-window": "monitor",
  "presenter-graphic": "presentation", "big-statement": "zap", "process-network": "network", "summary-steps": "list-checks", "icon-footage": "microchip",
};

const Card = ({children, className = ""}: {children: ReactNode; className?: string}) => <div className={`ap-card ${className}`}>{children}</div>;

export default function AppleMotionPreview({props}: Props) {
  const variant = String(props.variant || "dark-stage");
  const title = String(props.title || "Pratinjau Motion");
  const subtitle = String(props.subtitle || "Pratinjau instan tanpa render.");
  const primary = String(props.primary || "#10B981");
  const items = itemsOf(props.items);
  const labels: string[] = props.labels || [];
  const style = {"--ap-primary": primary, "--ap-bg": props.background || (variant === "light-stage" ? "#f5f5f7" : "#050506")} as CSSProperties;

  let visual: ReactNode;
  if (variant === "icon-footage") visual = <div className="ap-center ap-icon-footage"><div className="ap-icon-rings"><span style={{WebkitMaskImage:`url(/icons/lucide/${props.icon || "microchip"}.svg)`,maskImage:`url(/icons/lucide/${props.icon || "microchip"}.svg)`}} /></div><h2>{title}</h2><p>{subtitle}</p></div>;
    else if (variant === "dark-stage" || variant === "light-stage") visual = <div className="ap-stage-layout"><div><h2>{title}</h2><p>{subtitle}</p></div><div className="ap-orb" /></div>;
  else if (variant === "glass-button") visual = <div className="ap-center"><h2>{title}</h2><p>{subtitle}</p><button className="ap-pill">{props.value || "Lanjutkan"}</button><span className="ap-cursor">➤</span></div>;
  else if (variant === "toggle") visual = <div className="ap-center"><h2>{title}</h2><p>{subtitle}</p><div className="ap-toggle"><i /></div><small>Aktif</small></div>;
  else if (variant === "segment-control") visual = <div className="ap-center"><h2>{title}</h2><p>{subtitle}</p><div className="ap-segments">{(labels.length ? labels : ["Otomatis", "Hemat Daya", "Performa Tinggi"]).map((label, index) => <span className={index === Number(props.value || 0) ? "active" : ""} key={label}>{label}</span>)}</div></div>;
  else if (variant === "metric") visual = <div className="ap-center"><h2>{title}</h2><p>{subtitle}</p><Card className="ap-metric"><small>NILAI SAAT INI</small><strong>{props.value || "0%"}</strong><b>↗ {props.secondaryValue || "Aktif"}</b></Card></div>;
  else if (variant === "line-chart") visual = <div className="ap-center"><h2>{title}</h2><p>{subtitle}</p><Card className="ap-chart"><b>{props.value || "GRAFIK"}</b><svg viewBox="0 0 600 160"><path d="M5 140 C70 140 80 118 145 122 S210 75 275 92 S345 45 410 58 S505 20 595 28" /></svg><div>{(labels.length ? labels : ["MULAI", "PROSES", "HASIL"]).map(x => <span key={x}>{x}</span>)}</div></Card></div>;
  else if (variant === "comparison") visual = <div className="ap-center"><h2>{title}</h2><p>{subtitle}</p><div className="ap-row">{items.slice(0, 3).map((item, index) => <Card key={item.label}><small>{item.label}</small><strong>{item.value || `${42 + index * 20}%`}</strong><i style={{width: `${45 + index * 25}%`, background: item.color || primary}} /></Card>)}</div></div>;
  else if (variant === "data-flow") visual = <div className="ap-center"><h2>{title}</h2><p>{subtitle}</p><div className="ap-flow">{items.slice(0, 4).map((item, index) => <div className="ap-flow-part" key={item.label}><Card><i /><b>{item.label}</b></Card>{index < Math.min(items.length, 4) - 1 && <span><i /></span>}</div>)}</div></div>;
  else if (variant === "table") visual = <div className="ap-center"><h2>{title}</h2><p>{subtitle}</p><Card className="ap-table"><div>{(labels.length ? labels : ["NAMA", "NILAI", "STATUS"]).slice(0, 3).map(x => <b key={x}>{x}</b>)}</div>{items.slice(0, 4).map(item => <div key={item.label}><strong>{item.label}</strong><span>{item.value}</span><em>{item.detail || "Aktif"}</em></div>)}</Card></div>;
  else if (variant === "screen-window") visual = <div className="ap-center"><h2>{title}</h2><p>{subtitle}</p><Card className="ap-window"><header><i/><i/><i/></header><main><section/><aside><i/><i/><i/></aside></main></Card></div>;
  else if (variant === "presenter-graphic") visual = <div className="ap-center"><h2>{title}</h2><p>{subtitle}</p><div className="ap-presenter"><div className="ap-person"/><Card><strong>Dirancang agar tetap fokus.</strong><i/><span>Presenter dan informasi tetap terlihat jelas.</span></Card></div></div>;
  else if (variant === "big-statement") visual = <div className="ap-big"><h2>{title}</h2><p>{subtitle}</p></div>;
  else if (variant === "process-network") visual = <div className="ap-center"><h2>{title}</h2><p>{subtitle}</p><div className="ap-network">{items.slice(0, 6).map((item, index) => <Card className={`node n${index}`} key={item.label}>{item.label}</Card>)}</div></div>;
  else visual = <div className="ap-center"><h2>{title}</h2><p>{subtitle}</p><div className="ap-steps">{items.slice(0, 5).map((item, index) => <div key={item.label}><strong>0{index + 1}</strong><i/><b>{item.label}</b><span>{item.detail}</span></div>)}</div></div>;

  return <div className={`apple-preview ${variant === "light-stage" ? "light" : ""}`} style={style}><span className="ap-icon" style={{WebkitMaskImage:`url(/icons/lucide/${(variant === "icon-footage" ? props.icon : variantIcon[variant]) || "zap"}.svg)`,maskImage:`url(/icons/lucide/${(variant === "icon-footage" ? props.icon : variantIcon[variant]) || "zap"}.svg)`}} />{visual}<div className="ap-glow" /></div>;
}
