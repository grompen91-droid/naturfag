// OKLCH approximations matched to tokens.css
const C = {
  surface:   "#f7f9fc",
  surfaceMid:"#eef2f9",
  blue:      "#4f87d0",
  blueDark:  "#1e3a5c",
  blueLight: "#e4edf8",
  text:      "#1c2636",
  muted:     "#5a6272",
  correct:   "#2a8654",
  incorrect: "#c44b1b",
  white:     "#ffffff",
} as const;

const W = 1200;
const H = 630;

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function scoreEmoji(ratio: number): string {
  if (ratio === 1) return "🏆";
  if (ratio >= 0.8) return "🌟";
  if (ratio >= 0.6) return "⚡";
  if (ratio >= 0.4) return "💡";
  return "📚";
}

function scoreLabel(ratio: number): string {
  if (ratio === 1) return "Perfekt!";
  if (ratio >= 0.8) return "Veldig bra!";
  if (ratio >= 0.6) return "Bra jobba!";
  if (ratio >= 0.4) return "Godkjent!";
  return "Fortsett å øve!";
}

export async function drawResultCard(opts: {
  correctCount: number;
  totalQuestions: number;
  bestStreak: number;
}): Promise<Blob> {
  const { correctCount, totalQuestions, bestStreak } = opts;
  const ratio = totalQuestions > 0 ? correctCount / totalQuestions : 0;
  const pct = Math.round(ratio * 100);

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;

  // Background gradient
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, C.surface);
  bg.addColorStop(1, C.surfaceMid);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Left accent bar
  ctx.fillStyle = C.blue;
  ctx.fillRect(0, 0, 8, H);

  // Top-right decorative circle
  ctx.beginPath();
  ctx.arc(W + 60, -60, 260, 0, Math.PI * 2);
  ctx.fillStyle = C.blueLight;
  ctx.fill();

  // Bottom-left decorative circle
  ctx.beginPath();
  ctx.arc(-40, H + 40, 200, 0, Math.PI * 2);
  ctx.fillStyle = C.blueLight;
  ctx.fill();

  // Quiz title
  ctx.font = "bold 28px Inter, system-ui, sans-serif";
  ctx.fillStyle = C.blue;
  ctx.fillText("NATURFAG QUIZ", 80, 88);

  // Emoji
  ctx.font = "96px serif";
  ctx.fillText(scoreEmoji(ratio), 72, 230);

  // Score label
  ctx.font = "bold 52px Inter, system-ui, sans-serif";
  ctx.fillStyle = C.text;
  ctx.fillText(scoreLabel(ratio), 80, 318);

  // Big score fraction
  ctx.font = "bold 108px Inter, system-ui, sans-serif";
  ctx.fillStyle = ratio >= 0.6 ? C.correct : C.incorrect;
  ctx.fillText(`${correctCount}/${totalQuestions}`, 80, 448);

  // "riktige svar" sub-label
  ctx.font = "26px Inter, system-ui, sans-serif";
  ctx.fillStyle = C.muted;
  ctx.fillText("riktige svar", 80, 492);

  // Right column card
  const cardX = 680;
  const cardY = 90;
  const cardW = 450;
  const cardH = 440;

  roundRect(ctx, cardX, cardY, cardW, cardH, 18);
  ctx.fillStyle = C.white;
  ctx.shadowColor = "rgba(30,58,92,0.10)";
  ctx.shadowBlur = 32;
  ctx.fill();
  ctx.shadowBlur = 0;

  // Percentage display inside card
  ctx.font = "bold 100px Inter, system-ui, sans-serif";
  ctx.fillStyle = ratio >= 0.6 ? C.correct : C.incorrect;
  ctx.textAlign = "center";
  ctx.fillText(`${pct}%`, cardX + cardW / 2, cardY + 148);

  ctx.font = "24px Inter, system-ui, sans-serif";
  ctx.fillStyle = C.muted;
  ctx.fillText("prosent riktig", cardX + cardW / 2, cardY + 192);

  // Progress bar bg
  const barX = cardX + 40;
  const barY = cardY + 225;
  const barW = cardW - 80;
  const barH = 18;
  roundRect(ctx, barX, barY, barW, barH, 9);
  ctx.fillStyle = C.blueLight;
  ctx.fill();

  // Progress bar fill
  const fillW = Math.max(barH, barW * ratio);
  roundRect(ctx, barX, barY, fillW, barH, 9);
  ctx.fillStyle = ratio >= 0.6 ? C.correct : C.incorrect;
  ctx.fill();

  // Stats row
  const statY = cardY + 300;
  const stats = [
    { label: "Riktig", value: String(correctCount), color: C.correct },
    { label: "Feil", value: String(totalQuestions - correctCount), color: C.incorrect },
    ...(bestStreak >= 3
      ? [{ label: "Beste streak", value: `${bestStreak}🔥`, color: C.blue }]
      : []),
  ];
  const statGap = cardW / (stats.length + 1);
  stats.forEach((s, i) => {
    const sx = cardX + statGap * (i + 1);
    ctx.font = "bold 36px Inter, system-ui, sans-serif";
    ctx.fillStyle = s.color;
    ctx.fillText(s.value, sx, statY);
    ctx.font = "20px Inter, system-ui, sans-serif";
    ctx.fillStyle = C.muted;
    ctx.fillText(s.label, sx, statY + 34);
  });

  // Bottom branding strip
  ctx.fillStyle = C.blueDark;
  ctx.fillRect(0, H - 58, W, 58);
  ctx.font = "22px Inter, system-ui, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.textAlign = "left";
  ctx.fillText("Prøv quizen selv!", 80, H - 22);

  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillText("naturfag quiz", W - 80, H - 22);

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("canvas toBlob failed"))),
      "image/png",
    );
  });
}
