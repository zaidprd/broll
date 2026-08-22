import React from "react";
import {AbsoluteFill, Audio, Easing, Sequence, interpolate, useCurrentFrame, useVideoConfig} from "remotion";
import {fonts} from "../../fonts";
import {getSfxUrl} from "../../sfx/synth";
import {LucideIcon, type LucideIconName} from "./LucideIcon";

export type IconMotion = "reveal" | "pulse" | "orbit" | "float" | "rotate" | "scan" | "pop";

export type LucideIconFootageProps = {
  icon?: LucideIconName;
  motion?: IconMotion;
  title?: string;
  subtitle?: string;
  primary?: string;
  background?: string;
  iconSize?: number;
  audioEnabled?: boolean;
};

const clamp = {extrapolateLeft: "clamp" as const, extrapolateRight: "clamp" as const};
const ease = Easing.bezier(.22, 1, .36, 1);

export const LucideIconFootage: React.FC<LucideIconFootageProps> = ({
  icon = "microchip",
  motion = "orbit",
  title = "Teknologi yang bekerja.",
  subtitle = "Ikon motion siap digunakan sebagai footage.",
  primary = "#10B981",
  background = "#050506",
  iconSize = 150,
  audioEnabled = true,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames, width, height} = useVideoConfig();
  const duration = Math.max(1, durationInFrames);
  const enter = interpolate(frame, [0, duration * .24], [0, 1], {...clamp, easing: ease});
  const text = interpolate(frame, [duration * .18, duration * .42], [0, 1], {...clamp, easing: ease});
  const payoff = interpolate(frame, [duration * .58, duration * .76], [0, 1], {...clamp, easing: ease});
  const loop = frame / Math.max(1, duration);
  const pulse = 1 + Math.sin(frame / 11) * .055;
  const float = Math.sin(frame / 18) * 13;
  const rotation = motion === "rotate" ? frame * 1.5 : motion === "orbit" ? Math.sin(frame / 28) * 6 : 0;
  const iconScale = motion === "pop" ? .7 + enter * .3 + Math.sin(Math.min(1, enter) * Math.PI) * .12 : enter * (motion === "pulse" ? pulse : 1);
  const iconY = motion === "float" || motion === "orbit" ? float : (1 - enter) * 55;
  const scanX = interpolate(frame, [duration * .25, duration * .78], [-240, 240], clamp);
  const scale = Math.min(width / 1280, height / 720);

  return <AbsoluteFill style={{background, color: "white", overflow: "hidden", fontFamily: fonts.display}}>
    {audioEnabled && <>
      <Sequence from={2} durationInFrames={Math.max(1, Math.round(duration * .24))}><Audio src={getSfxUrl("whoosh")} volume={.24}/></Sequence>
      <Sequence from={Math.round(duration * .6)} durationInFrames={Math.max(1, Math.round(duration * .18))}><Audio src={getSfxUrl("impact")} volume={.22}/></Sequence>
    </>}
    <div style={{position:"absolute",left:"50%",top:"46%",width:620*scale,height:620*scale,transform:`translate(-50%,-50%) scale(${.88+payoff*.12})`,borderRadius:"50%",background:`radial-gradient(circle,${primary}44 0%,${primary}15 38%,transparent 70%)`,filter:"blur(12px)"}}/>
    <div style={{position:"absolute",left:"50%",top:"43%",width:340,height:340,transform:`translate(-50%,-50%) rotate(${rotation}deg)`,display:"grid",placeItems:"center"}}>
      {[0,1,2].map((ring) => <div key={ring} style={{position:"absolute",inset:22+ring*35,borderRadius:ring===1?72:"50%",border:`1px solid ${primary}${ring===0?"66":"35"}`,transform:`rotate(${frame*(ring%2?-.18:.13)}deg) scale(${1+Math.sin(frame/24+ring)*.025})`,opacity:enter}}/>) }
      {motion === "orbit" && [0,1,2].map((dot) => {const angle=frame/17+dot*Math.PI*2/3; return <i key={dot} style={{position:"absolute",left:170+Math.cos(angle)*145,top:170+Math.sin(angle)*145,width:9,height:9,borderRadius:"50%",background:dot===0?"white":primary,boxShadow:`0 0 18px ${primary}`}}/>})}
      <div style={{position:"relative",width:230,height:230,borderRadius:62,display:"grid",placeItems:"center",background:"linear-gradient(145deg,rgba(255,255,255,.18),rgba(255,255,255,.055))",border:"1px solid rgba(255,255,255,.24)",boxShadow:`0 35px 90px rgba(0,0,0,.38),0 0 ${35+payoff*45}px ${primary}55,inset 0 1px rgba(255,255,255,.32)`,opacity:enter,transform:`translateY(${iconY}px) scale(${iconScale})`}}>
        <LucideIcon name={icon} size={iconSize} color={primary}/>
        {motion === "scan" && <span style={{position:"absolute",left:scanX,top:0,bottom:0,width:90,background:"linear-gradient(90deg,transparent,rgba(255,255,255,.36),transparent)",filter:"blur(7px)",transform:"skewX(-18deg)"}}/>}
      </div>
    </div>
    <div style={{position:"absolute",left:0,right:0,bottom:65,textAlign:"center",opacity:text,transform:`translateY(${(1-text)*28}px)`}}>
      <div style={{fontSize:56,fontWeight:700,letterSpacing:"-.055em"}}>{title}</div>
      <div style={{fontFamily:fonts.sans,fontSize:19,color:"rgba(255,255,255,.55)",marginTop:12}}>{subtitle}</div>
    </div>
    <div style={{position:"absolute",inset:0,opacity:.035,backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"}}/>
  </AbsoluteFill>;
};
