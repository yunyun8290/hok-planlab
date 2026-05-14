"use client";

import { useState, useEffect } from "react";
import {
  Stage,
  Layer,
  Image as KonvaImage,
  Line,
  Group,
  Text,
  Circle,
} from "react-konva";

import useImage from "use-image";

/* ================= MAP ================= */
function MapImage({ width, height }: { width: number; height: number }) {
  const [image] = useImage("/map.png");

  if (!image) return null;

  return (
    <KonvaImage
      image={image}
      x={0}
      y={0}
      width={width}
      height={height}
    />
  );
}

function HeroImage({ hero, team }: { hero: string; team: string }) {
  const [image] = useImage(`/heroes/${hero}.png`);

  return (
    <Group>
      {/* 外枠 */}
      <Circle
        radius={24}
        stroke={team === "red" ? "#ef4444" : "#3b82f6"}
        strokeWidth={3}
        fill="transparent"
      />

      {/* マスク用の丸（ここが重要） */}
      <Group
        clipFunc={(ctx: any) => {
          ctx.beginPath();
          ctx.arc(0, 0, 24, 0, Math.PI * 2);
          ctx.closePath();
        }}
      >
        <KonvaImage
          image={image}
          width={48}
          height={48}
          offsetX={24}
          offsetY={24}
        />
      </Group>
    </Group>
  );
}

export default function Home() {
  /* ================= STATE ================= */
  const BASE_WIDTH = 1700;
const BASE_HEIGHT = 1100;

const [zoom, setZoom] = useState(0.8);

  const [lines, setLines] = useState<any[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);

  const [tool, setTool] = useState<
    "map" | "move" | "pen" | "eraser"
  >("pen");

  const [color, setColor] = useState("red");
  const [showColors, setShowColors] = useState(false);

  const [selectedHero, setSelectedHero] = useState("");
  const [selectedLane, setSelectedLane] = useState("ALL");

  const [stamps, setStamps] = useState([
    { id: 1, role: "T", team: "red", hero: "none", x: 200, y: 200 },
    { id: 2, role: "J", team: "red", hero: "none", x: 300, y: 200 },
    { id: 3, role: "M", team: "red", hero: "none", x: 400, y: 200 },
    { id: 4, role: "S", team: "red", hero: "none", x: 500, y: 200 },
    { id: 5, role: "B", team: "red", hero: "none", x: 600, y: 200 },

    { id: 6, role: "T", team: "blue", hero: "none", x: 200, y: 700 },
    { id: 7, role: "J", team: "blue", hero: "none", x: 300, y: 700 },
    { id: 8, role: "M", team: "blue", hero: "none", x: 400, y: 700 },
    { id: 9, role: "S", team: "blue", hero: "none", x: 500, y: 700 },
    { id: 10, role: "B", team: "blue", hero: "none", x: 600, y: 700 },
  ]);

  const handleStampClick = (id: number) => {
  setStamps((prev) =>
    prev.map((s) =>
      s.id === id
        ? {
            ...s,
            hero: selectedHero === "none" ? "none" : selectedHero,
          }
        : s
    )
  );
};
  
  const allHeroes = Array.from(
  new Set([
    // TOP
    "Arthur","Ata","Augran","Bai-Qi","Biron","Charlotte","Chicha",
    "Dharma","Donghuang","Dun","Fatihp","Flowborn-Tank","Fuzi",
    "Guan-Yu","Heino","Kaizer","Lapulapu","Lian-Po","Liu-Bang",
    "Li-Xin","Lu-Bu","Mayene","Mi-Yue","Mulan","Nezha","Sun-Ce",
    "Ukyo-Tachibana","Umbrosa","Wuyan","Xiang-Yu","Yang-Jian",
    "Yango","Yao","Allain",

    // JG
    "Arke","Athena","Butterfly","Chano","Cirrus","Dian-Wei","Fang",
    "Han-Xin","Jing","Kongming","Lam","Lanling","Li-Bai","Liu-Bei",
    "Luna","Menki","Musashi","Nakoruru","Pei","Sima-Yi","Wukong",
    "Xuance","Ying","Zilong","Agudo",

    // MID
    "Daji","Da-Qiao","Diaochan","Dr-Bian","Flowborn-Mage",
    "Gan-and-Mo","Gao-Changgong","Garuda-Khageswara","Haya",
    "Heino","Kongming","Lady-Zhen","Liang","Mai-Shiranui",
    "Milady","Mozi","Nuwa","Shangguan","Shi","Sima-Yi",
    "Wang-Zhaojun","Xiao-Qiao","Yixing","Yuhuan","Zhou-Yu","Ziya",
    "Angela",

    // SUP
    "Cai-Yan","Dolia","Donghuang","Dyadia","Guiguzi","Kui",
    "Lapulapu","Lian-Po","Liu-Bang","Liu-Shan","Mozi","Sakeer",
    "Sun-Bin","Zhang-Fei","Zhuangzi","Yaria","Alessio",

    // BOT
    "Arli","Consort-Yu","Di-Renjie","Erin","Garo","Hou-Yi",
    "Huang-Zhong","Lady-Sun","Luara","Luban-No.7","Marco-Polo",
    "Meng-Ya","Ming","Shouyue","Aoyin"
  ])
);

  const lanes: Record<string, string[]> = {
  ALL: allHeroes,
  TOP: ["Arthur","Ata","Augran","Bai-Qi","Biron","Charlotte","Chicha","Dharma","Donghuang","Dun","Fatihp","Flowborn-Tank","Fuzi","Guan-Yu","Heino","Kaizer","Lapulapu","Lian-Po","Liu-Bang","Li-Xin","Lu-Bu","Mayene","Mi-Yue","Mulan","Nezha","Sun-Ce","Ukyo-Tachibana","Umbrosa","Wuyan","Xiang-Yu","Yang-Jian","Yango","Yao","Allain"],
  JG: ["Arke","Athena","Butterfly","Chano","Cirrus","Dian-Wei","Fang","Han-Xin","Jing","Kongming","Lam","Lanling","Li-Bai","Liu-Bei","Luna","Menki","Musashi","Nakoruru","Pei","Sima-Yi","Wukong","Xuance","Ying","Zilong","Agudo"],
  MID: ["Daji","Da-Qiao","Diaochan","Dr-Bian","Flowborn-Mage","Gan-and-Mo","Gao-Changgong","Garuda-Khageswara","Haya","Heino","Kongming","Lady-Zhen","Liang","Mai-Shiranui","Milady","Mozi","Nuwa","Shangguan","Shi","Sima-Yi","Wang-Zhaojun","Xiao-Qiao","Yixing","Yuhuan","Zhou-Yu","Ziya","Angela"],
  SUP: ["Cai-Yan","Dolia","Donghuang","Dyadia","Guiguzi","Kui","Lapulapu","Lian-Po","Liu-Bang","Liu-Shan","Mozi","Sakeer","Sun-Bin","Zhang-Fei","Zhuangzi","Yaria","Alessio"],
  BOT: ["Arli","Consort-Yu","Di-Renjie","Erin","Garo","Hou-Yi","Huang-Zhong","Lady-Sun","Luara","Luban-No.7","Marco-Polo","Meng-Ya","Ming","Shouyue","Aoyin"],
};

  const [showLanePanel, setShowLanePanel] = useState(true);
  const [showHeroPanel, setShowHeroPanel] = useState(true);

  const colors = [
  "red",
  "blue",
  "yellow",
  "green",
  "white",
  "black",
];

  /* ================= POINTER ================= */
  const getPos = (e: any) => {
  const stage = e.target.getStage();
  if (!stage) return null;

  const point = stage.getPointerPosition();
  if (!point) return null;

  const layer = stage.findOne("Layer");
  const transform = layer?.getAbsoluteTransform().copy();

  if (!transform) return point;

  transform.invert();
  return transform.point(point);
};

  /* ================= DRAW ================= */
  const handleDown = (e: any) => {
    if (tool !== "pen" && tool !== "eraser") return;

    const pos = getPos(e);
    if (!pos) return;

    setIsDrawing(true);

    if (tool === "eraser") return;

    setLines((prev) => [
      ...prev,
      { color, points: [pos.x, pos.y] },
    ]);
  };

  const handleMove = (e: any) => {
    if (!isDrawing) return;

    const pos = getPos(e);
    if (!pos) return;

    if (tool === "eraser") {
      setLines((prev) =>
        prev.filter((line) => {
          for (let i = 0; i < line.points.length; i += 2) {
            const dx = line.points[i] - pos.x;
            const dy = line.points[i + 1] - pos.y;

            if (Math.sqrt(dx * dx + dy * dy) < 18) {
              return false;
            }
          }
          return true;
        })
      );
      return;
    }

    setLines((prev) => {
      const last = prev[prev.length - 1];
      if (!last) return prev;

      last.points = [...last.points, pos.x, pos.y];
      return [...prev.slice(0, -1), last];
    });
  };

  const lanesData: Record<string, string[]> = lanes;

  /* ================= UI ================= */
  return (
  <div
    style={{
      width: "100vw",
      height: "100vh",
      background: "#1e293b",
      position: "relative",
      overflow: "hidden",
    }}
  >
<div
  style={{
    position: "absolute",
    top: 12,
    right: 16,
    zIndex: 1000,
    fontSize: 30,
    color: "#fff",
    opacity: 0.75,
    fontWeight: 600,
    letterSpacing: "0.5px",
    padding: "4px 8px",
    borderRadius: 6,
    background: "rgba(0,0,0,0.25)",
    backdropFilter: "blur(4px)",
    pointerEvents: "none",
  }}
>
  HOK PlanLab
</div>

  {/* 🔲 マップ枠 */}
<div
  style={{
    width: BASE_WIDTH,
    height: BASE_HEIGHT,
    border: "2px solid #333",
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    left: 470,
    top: 50,
    background: "#6b7280",
  }}
>

    <Stage
  width={BASE_WIDTH}
  height={BASE_HEIGHT}
  scaleX={zoom}
  scaleY={zoom}
  draggable={tool === "map"}
  onWheel={(e) => {
  e.evt.preventDefault();

  const scaleBy = 1.1;

  setZoom((prev) => {
  const next =
    e.evt.deltaY > 0
      ? prev / scaleBy
      : prev * scaleBy;

  return Math.min(Math.max(next, 0.5), 2);
});
}}
>
      <Layer>
  <MapImage width={BASE_WIDTH} height={BASE_HEIGHT} />


  {lines.map((l, i) => (
    <Line
      key={i}
      points={l.points}
      stroke={l.color}
      strokeWidth={5}
      lineCap="round"
    />
  ))}

  {stamps.map((s) => (
    <Group
      key={s.id}
      x={s.x}
      y={s.y}
      draggable={tool === "move"}
      onClick={() => handleStampClick(s.id)}
      onDragEnd={(e) =>
        setStamps((prev) =>
          prev.map((st) =>
            st.id === s.id
              ? {
                  ...st,
                  x: e.target.x(),
                  y: e.target.y(),
                }
              : st
          )
        )
      }
    >
      <Circle
        radius={24}
        fill={s.team === "red" ? "#ef4444" : "#3b82f6"}
      />

      {s.hero === "none" ? (
        <Text
          text={s.role}
          fontSize={20}
          fill="white"
          stroke="black"
          strokeWidth={2}
          width={48}
          height={48}
          align="center"
          verticalAlign="middle"
          offsetX={24}
          offsetY={24}
        />
      ) : (
        <HeroImage hero={s.hero} team={s.team} />
      )}
    </Group>
  ))}
</Layer>
    </Stage>

  </div>

{/* ================= LEFT PANEL ================= */}

<button
  onClick={() => setShowHeroPanel((p) => !p)}
  style={{
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 30,
    padding: "8px 12px",
    background: "#333",
    color: "white",
    border: "1px solid #555",
    borderRadius: 8,
  }}
>
  {showHeroPanel ? "Hide Heroes" : "Show Heroes"}
</button>

{/* レーンUI（左サイドに縦表示） */}
{showLanePanel && (
  <div
    style={{
      position: "absolute",
      left: 20,
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 20,
      display: "flex",
      flexDirection: "column",
      gap: 6,
      background: "#222",
      padding: 12,
      borderRadius: 12,
    }}
  >
    {Object.keys(lanesData).map((lane) => (
      <button
        key={lane}
        onClick={() => setSelectedLane(lane)}
        style={{
          display: "block",
          marginBottom: 6,
          padding: 10,
          borderRadius: 8,
          background: selectedLane === lane ? "#ffd54f" : "#333",
          color: "white",
          border: "1px solid #555",
        }}
      >
        {lane}
      </button>
    ))}
  </div>
)}

{showHeroPanel && (
  <div
    style={{
      position: "absolute",
      left: 100,
      top: "51.5%",
      transform: "translateY(-50%)",
      display: "grid",
      gridTemplateColumns: "repeat(6, 1fr)",
      gap: 6,
      background: "#222",
      padding: 12,
      borderRadius: 12,
      zIndex: 50, // ★重要
    }}
  >
    <button
      onClick={() => setSelectedHero("none")}
      style={{
        width: 50,
        height: 50,
        border:
          selectedHero === "none"
            ? "2px solid yellow"
            : "1px solid #666",
        background: "#222",
        color: "white",
      }}
    >
      NONE
    </button>

    {lanesData[selectedLane].map((hero) => (
      <div
        key={hero}
        onClick={() => {
          console.log("clicked:", hero); // ★デバッグ用
          setSelectedHero(hero);
        }}
        style={{
          width: 50,
          height: 50,
          borderRadius: 8,
          border:
            selectedHero === hero
              ? "2px solid yellow"
              : "1px solid #666",
          cursor: "pointer",
          overflow: "hidden",
        }}
      >
        <img
          src={`/heroes/${hero}.png`}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    ))}
  </div>
)}

      {/* ================= RIGHT TOOL ================= */}
      <div
        style={{
          position: "absolute",
          right: 20,
          top: "50%",
          transform: "translateY(-50%)",
          background: "#222",
          padding: 12,
          borderRadius: 12,
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}
      >
        <button
          onClick={() => setTool("map")}
          style={{
            background: tool === "map" ? "#ffd54f" : "#333",
            color: "white",
            padding: 10,
            borderRadius: 8,
            border: "1px solid #555",
          }}
        >
          map
        </button>

        <button
          onClick={() => setTool("move")}
          style={{
            background: tool === "move" ? "#ffd54f" : "#333",
            color: "white",
            padding: 10,
            borderRadius: 8,
            border: "1px solid #555",
          }}
        >
          move
        </button>

        <button
          onClick={() => setTool("pen")}
          style={{
            background: tool === "pen" ? "#ffd54f" : "#333",
            color: "white",
            padding: 10,
            borderRadius: 8,
            border: "1px solid #555",
          }}
        >
          pen
        </button>

        {/* color */}
<button
  onClick={() => setShowColors(!showColors)}
  style={{
    width: "100%",
    padding: 10,
    borderRadius: 8,
    border:
      tool === "pen" ? "2px solid #ffd54f" : "1px solid #555",
    background: "#333",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  }}
>
  <div
    style={{
      width: 16,
      height: 16,
      borderRadius: "50%",
      background: color,
      border: "1px solid white",
      flexShrink: 0,
    }}
  />
  color
</button>

{showColors && (
  <div
    style={{
      display: "flex",
      gap: 6,
      marginTop: 6,
      justifyContent: "center",
      flexWrap: "wrap",
    }}
  >
    {colors.map((c) => (
      <button
        key={c}
        onClick={() => {
          setColor(c);
          setTool("pen");
          setShowColors(false);
        }}
        style={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          background: c,
          border:
            color === c
              ? "2px solid white"
              : "1px solid #444",
        }}
      />
    ))}
  </div>
)}

        <button
          onClick={() => setTool("eraser")}
          style={{
            background: tool === "eraser" ? "#ffd54f" : "#333",
            color: "white",
            padding: 10,
            borderRadius: 8,
            border: "1px solid #555",
          }}
        >
          eraser
        </button>
      </div>

      {/* ================= STAGE ================= */}


  
    </div>
);
}