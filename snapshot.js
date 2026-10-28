// snapshot.js
window.KLionHangar = window.KLionHangar || {};

KLionHangar.generateSnapshot = async (items) => {
    const btn = document.getElementById('sc-snapshot-btn');
    const originalText = btn.textContent;
    btn.textContent = "⏳...";
    btn.disabled = true;

    try {
        const cols = 6;
        const rows = Math.ceil(items.length / cols) || 1;
        const cardWidth = 160; 
        const cardHeight = 220; 
        const padding = 20;
        const headerHeight = 120; 

        const canvasWidth = cols * (cardWidth + padding) + padding;
        const canvasHeight = headerHeight + rows * (cardHeight + padding) + padding;

        const canvas = document.createElement('canvas');
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = KLionHangar.isLightTheme ? '#f6f8fa' : '#0d1117';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        ctx.strokeStyle = KLionHangar.isLightTheme ? '#e1e4e8' : '#21262d';
        ctx.lineWidth = 1;
        for(let i = 0; i < canvasWidth; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvasHeight); ctx.stroke(); }
        for(let i = 0; i < canvasHeight; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvasWidth, i); ctx.stroke(); }

        ctx.fillStyle = KLionHangar.isLightTheme ? '#0969da' : '#58a6ff';
        ctx.font = 'bold 32px sans-serif';
        ctx.fillText('Hangar Overview', padding, 55);

        ctx.fillStyle = KLionHangar.isLightTheme ? '#57606a' : '#8b949e';
        ctx.font = '16px sans-serif';
        const totalVal = items.reduce((sum, item) => sum + item.price.amount, 0).toFixed(2);
        ctx.fillText(`Total: ${items.length} items   |   Value: $${totalVal} USD`, padding, 95);

        const loadImg = (url) => {
            return new Promise((resolve) => {
                if (!url) return resolve(null);
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => resolve(img);
                img.onerror = () => resolve(null);
                img.src = url;
            });
        };

        const drawWrapText = (text, x, y, maxWidth, lineHeight) => {
            let cleanText = text.replace(/\s*Attributed$/i, ''); 
            let words = cleanText.split(' ');
            let line = '';
            let lines = [];
            
            for(let n = 0; n < words.length; n++) {
                let testLine = line + words[n] + ' ';
                let metrics = ctx.measureText(testLine);
                if (metrics.width > maxWidth && n > 0) {
                    lines.push(line);
                    line = words[n] + ' ';
                } else {
                    line = testLine;
                }
            }
            lines.push(line);

            for(let i = 0; i < lines.length && i < 3; i++) {
                if (i === 2 && lines.length > 3) {
                    let lastLine = lines[i];
                    while(ctx.measureText(lastLine + '...').width > maxWidth && lastLine.length > 0) {
                        lastLine = lastLine.slice(0, -1);
                    }
                    ctx.fillText(lastLine + '...', x, y + (i * lineHeight));
                } else {
                    ctx.fillText(lines[i], x, y + (i * lineHeight));
                }
            }
        };

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = padding + col * (cardWidth + padding);
            const y = headerHeight + row * (cardHeight + padding);

            ctx.fillStyle = KLionHangar.isLightTheme ? '#ffffff' : '#161b22';
            ctx.strokeStyle = KLionHangar.isLightTheme ? '#d0d7de' : '#30363d';
            ctx.beginPath();
            ctx.roundRect(x, y, cardWidth, cardHeight, 8);
            ctx.fill();
            ctx.stroke();

            const img = await loadImg(item.imgUrl);
            if (img) {
                ctx.save();
                ctx.beginPath();
                ctx.roundRect(x + 10, y + 10, cardWidth - 20, cardWidth - 20, 4);
                ctx.clip();
                ctx.drawImage(img, x + 10, y + 10, cardWidth - 20, cardWidth - 20);
                ctx.restore();
            } else {
                ctx.fillStyle = '#8b949e';
                ctx.font = '14px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText('No Image', x + cardWidth / 2, y + cardWidth / 2);
                ctx.textAlign = 'left';
            }

            ctx.fillStyle = KLionHangar.isLightTheme ? '#24292f' : '#c9d1d9';
            ctx.font = 'bold 12px sans-serif';
            drawWrapText(item.name, x + 10, y + cardWidth + 15, cardWidth - 20, 16);
        }

        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = `K-Lion-Hangar-${KLionHangar.formatTime(Date.now())}.png`;
        a.click();
    } catch(err) {
        console.error("生成图片失败", err);
        alert("Failed to generate image.");
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
};