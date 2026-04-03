import jsPDF from 'jspdf';

export interface ExportTransaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
}

export interface ExportOptions {
  transactions: ExportTransaction[];
  month: string;
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  savingsRate: number;
}

/**
 * Generate PDF report using jsPDF
 */
export async function exportToPDF(options: ExportOptions): Promise<Blob> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  // Helper functions
  const addText = (text: string, x: number, yPos: number, size: number, color: [number, number, number], bold = false) => {
    doc.setFontSize(size);
    doc.setTextColor(...color);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.text(text, x, yPos);
    return yPos + size * 0.5;
  };

  const addLine = (yPos: number, color: [number, number, number] = [200, 200, 200]) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);
    return yPos + 5;
  };

  const addRect = (x: number, yPos: number, width: number, height: number, fillColor: [number, number, number], textColor: [number, number, number] = [255, 255, 255]) => {
    doc.setFillColor(...fillColor);
    doc.roundedRect(x, yPos, width, height, 3, 3, 'F');
    return { x, y: yPos, width, height };
  };

  // Header
  y = addText('LifeOS — Финансовый отчёт', margin, y, 22, [30, 30, 30], true);
  y = addText(`Период: ${options.month}`, margin, y, 11, [120, 120, 120]);
  y = addText(`Дата формирования: ${new Date().toLocaleDateString('ru-RU')}`, margin, y, 10, [150, 150, 150]);
  y = addLine(y + 3);

  // Summary cards
  const cardWidth = (pageWidth - margin * 2 - 10) / 3;
  const cardHeight = 25;
  const cardY = y + 5;

  // Income card
  addRect(margin, cardY, cardWidth, cardHeight, [34, 197, 94]);
  addText('Доходы', margin + 3, cardY + 9, 9, [255, 255, 255]);
  addText(`${options.totalIncome.toLocaleString('ru-RU')} руб`, margin + 3, cardY + 19, 12, [255, 255, 255], true);

  // Expenses card
  addRect(margin + cardWidth + 5, cardY, cardWidth, cardHeight, [239, 68, 68]);
  addText('Расходы', margin + cardWidth + 8, cardY + 9, 9, [255, 255, 255]);
  addText(`${options.totalExpenses.toLocaleString('ru-RU')} руб`, margin + cardWidth + 8, cardY + 19, 12, [255, 255, 255], true);

  // Savings card
  const savingsColor = options.savings >= 0 ? [77, 163, 255] : [239, 68, 68];
  addRect(margin + (cardWidth + 5) * 2, cardY, cardWidth, cardHeight, savingsColor);
  addText('Баланс', margin + (cardWidth + 5) * 2 + 3, cardY + 9, 9, [255, 255, 255]);
  addText(`${options.savings.toLocaleString('ru-RU')} руб`, margin + (cardWidth + 5) * 2 + 3, cardY + 19, 12, [255, 255, 255], true);

  y = cardY + cardHeight + 10;

  // Savings rate
  y = addText(`Норма сбережений: ${options.savingsRate}%`, margin, y, 12, [30, 30, 30], true);
  y = addLine(y + 3);

  // Transactions table
  y = addText('Транзакции', margin, y, 16, [30, 30, 30], true);
  y += 3;

  // Table header
  const colWidths = { date: 25, category: 35, description: 55, amount: 30 };
  const headerY = y;

  doc.setFillColor(240, 240, 240);
  doc.rect(margin, y, pageWidth - margin * 2, 8, 'F');

  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.setFont('helvetica', 'bold');
  doc.text('Дата', margin + 2, y + 5.5);
  doc.text('Категория', margin + colWidths.date + 2, y + 5.5);
  doc.text('Описание', margin + colWidths.date + colWidths.category + 2, y + 5.5);
  doc.text('Сумма', margin + colWidths.date + colWidths.category + colWidths.description + 2, y + 5.5);

  y += 10;

  // Table rows
  doc.setFont('helvetica', 'normal');
  options.transactions.forEach((t, index) => {
    // Check if we need a new page
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    const rowColor = index % 2 === 0 ? [250, 250, 250] : [255, 255, 255];
    doc.setFillColor(...rowColor);
    doc.rect(margin, y - 4, pageWidth - margin * 2, 8, 'F');

    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);

    const dateStr = new Date(t.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    doc.text(dateStr, margin + 2, y + 1.5);

    doc.text(t.category, margin + colWidths.date + 2, y + 1.5);

    const desc = t.description.length > 30 ? t.description.substring(0, 30) + '...' : t.description;
    doc.text(desc, margin + colWidths.date + colWidths.category + 2, y + 1.5);

    const amountStr = `${t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString('ru-RU')} руб`;
    doc.setTextColor(t.type === 'income' ? [34, 197, 94] : [239, 68, 68]);
    doc.text(amountStr, margin + colWidths.date + colWidths.category + colWidths.description + 2, y + 1.5);

    y += 9;
  });

  // Footer
  const footerY = 280;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('Сформировано в LifeOS • life-os-seven-khaki.vercel.app', pageWidth / 2, footerY, { align: 'center' });

  return doc.output('blob');
}

/**
 * Generate screenshot-style image report using canvas
 */
export async function exportToImage(options: ExportOptions): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Cannot create canvas context');

  const width = 800;
  const rowHeight = 50;
  const headerHeight = 280;
  const summaryHeight = 120;
  const tableHeaderHeight = 40;
  const footerHeight = 50;
  const totalHeight = headerHeight + summaryHeight + tableHeaderHeight + options.transactions.length * rowHeight + footerHeight;

  canvas.width = width;
  canvas.height = totalHeight;

  // Background
  const bgGradient = ctx.createLinearGradient(0, 0, 0, totalHeight);
  bgGradient.addColorStop(0, '#0B0B0F');
  bgGradient.addColorStop(1, '#111118');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, totalHeight);

  let y = 40;
  const margin = 30;

  // Header
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 32px Arial, sans-serif';
  ctx.fillText('LifeOS — Финансовый отчёт', margin, y);
  y += 35;

  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '16px Arial, sans-serif';
  ctx.fillText(`Период: ${options.month}`, margin, y);
  y += 25;
  ctx.fillText(`Дата: ${new Date().toLocaleDateString('ru-RU')}`, margin, y);
  y = headerHeight - 20;

  // Summary cards
  const cardW = (width - margin * 2 - 20) / 3;
  const cardH = 80;
  const cardY = y;

  // Income card
  drawCard(ctx, margin, cardY, cardW, cardH, '#22C55E', 'Доходы', `${options.totalIncome.toLocaleString('ru-RU')} руб`);

  // Expenses card
  drawCard(ctx, margin + cardW + 10, cardY, cardW, cardH, '#EF4444', 'Расходы', `${options.totalExpenses.toLocaleString('ru-RU')} руб`);

  // Savings card
  const savingsColor = options.savings >= 0 ? '#4DA3FF' : '#EF4444';
  drawCard(ctx, margin + (cardW + 10) * 2, cardY, cardW, cardH, savingsColor, 'Баланс', `${options.savings.toLocaleString('ru-RU')} руб`);

  y = cardY + cardH + 30;

  // Transactions table header
  ctx.fillStyle = 'rgba(255,255,255,0.1)';
  ctx.fillRect(margin, y, width - margin * 2, 35);

  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  ctx.font = 'bold 14px Arial, sans-serif';
  const colWidths = { date: 80, category: 120, description: 300, amount: 100 };
  ctx.fillText('Дата', margin + 10, y + 22);
  ctx.fillText('Категория', margin + colWidths.date + 10, y + 22);
  ctx.fillText('Описание', margin + colWidths.date + colWidths.category + 10, y + 22);
  ctx.fillText('Сумма', margin + colWidths.date + colWidths.category + colWidths.description + 10, y + 22);

  y += 45;

  // Transactions rows
  options.transactions.forEach((t, index) => {
    if (index % 2 === 0) {
      ctx.fillStyle = 'rgba(255,255,255,0.03)';
      ctx.fillRect(margin, y - 15, width - margin * 2, rowHeight);
    }

    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '14px Arial, sans-serif';

    const dateStr = new Date(t.date).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' });
    ctx.fillText(dateStr, margin + 10, y + 5);

    ctx.fillText(t.category, margin + colWidths.date + 10, y + 5);

    const desc = t.description.length > 35 ? t.description.substring(0, 35) + '...' : t.description;
    ctx.fillText(desc, margin + colWidths.date + colWidths.category + 10, y + 5);

    ctx.fillStyle = t.type === 'income' ? '#22C55E' : '#EF4444';
    ctx.font = 'bold 14px Arial, sans-serif';
    const amountStr = `${t.type === 'income' ? '+' : '-'}${t.amount.toLocaleString('ru-RU')} руб`;
    ctx.fillText(amountStr, margin + colWidths.date + colWidths.category + colWidths.description + 10, y + 5);

    y += rowHeight;
  });

  // Footer
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.font = '12px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Сформировано в LifeOS • life-os-seven-khaki.vercel.app', width / 2, totalHeight - 20);
  ctx.textAlign = 'left';

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob!);
    }, 'image/png');
  });
}

function drawCard(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, label: string, value: string) {
  // Card background
  ctx.fillStyle = color + '20';
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 12);
  ctx.fill();

  // Border
  ctx.strokeStyle = color + '40';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, 12);
  ctx.stroke();

  // Label
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '14px Arial, sans-serif';
  ctx.fillText(label, x + 15, y + 30);

  // Value
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 22px Arial, sans-serif';
  ctx.fillText(value, x + 15, y + 60);
}

/**
 * Download blob as file
 */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
