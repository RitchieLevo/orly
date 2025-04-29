/**
 * Fondo de circuitos dinámicos animados con Canvas
 * Autor: AI Assistant
 * Uso: Incluye este archivo en tu index.html antes del cierre de </body>
 */

(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'circuit-bg-canvas';
  canvas.style.position = 'fixed';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.zIndex = 0;
  canvas.style.pointerEvents = 'none';
  canvas.style.opacity = 0.22; // Ajusta opacidad aquí
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resize);
  resize();

  // Configuración de nodos y líneas
  const NODES = 22;
  const LINES_PER_NODE = 2;
  const nodes = [];
  const lines = [];

  // Inicializa nodos en posiciones aleatorias
  for (let i = 0; i < NODES; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 7 + Math.random() * 4,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 0.7,
      color: `rgba(0,212,255,0.7)`
    });
  }

  // Conecta nodos aleatoriamente
  for (let i = 0; i < NODES; i++) {
    for (let j = 0; j < LINES_PER_NODE; j++) {
      let target = Math.floor(Math.random() * NODES);
      if (target !== i) {
        lines.push({ from: i, to: target, offset: Math.random() * 1000 });
      }
    }
  }

  function animate(time) {
    ctx.clearRect(0, 0, width, height);

    // Actualiza nodos (ligero movimiento sinusoidal)
    nodes.forEach((node, idx) => {
      node.x += Math.sin(time * 0.0003 + node.phase) * 0.15;
      node.y += Math.cos(time * 0.0002 + node.phase) * 0.12;
    });

    // Dibuja líneas con efecto de corriente
    lines.forEach(line => {
      const n1 = nodes[line.from];
      const n2 = nodes[line.to];
      // Efecto de corriente: animación de gradiente
      const grad = ctx.createLinearGradient(n1.x, n1.y, n2.x, n2.y);
      const t = (Math.sin(time * 0.001 + line.offset) + 1) / 2;
      grad.addColorStop(0, 'rgba(0,212,255,0.13)');
      grad.addColorStop(t * 0.7, 'rgba(0,212,255,0.7)');
      grad.addColorStop(1, 'rgba(0,212,255,0.13)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(n1.x, n1.y);
      ctx.lineTo(n2.x, n2.y);
      ctx.stroke();
    });

    // Dibuja nodos con efecto glow
    nodes.forEach(node => {
      ctx.save();
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.fill();
      ctx.restore();

      // Efecto de pulso
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.r + Math.sin(time * 0.002 + node.phase) * 2.5, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0,212,255,0.18)';
      ctx.lineWidth = 3;
      ctx.stroke();
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();