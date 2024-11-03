(function (w, d) {
    const canvas = d.createElement('canvas');
    canvas.id = 'bg-canvas';
    console.log('看看-bg-canvas', d.body);
    d.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let mouseX = 0, mouseY = 0;
    let prevMouseX = 0, prevMouseY = 0;

    function adjustCanvasSize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    adjustCanvasSize();
    window.addEventListener('resize', adjustCanvasSize);

    class EnergyBlade {
        constructor(startX, startY, endX, endY) {
            this.startX = startX;
            this.startY = startY;
            this.endX = endX;
            this.endY = endY;
            this.bladeLength = Math.hypot(endX - startX, endY - startY);
            this.bladeWidth = 4;
            this.duration = 60;
            this.energyParticles = [];
            this.luminosity = 1;
            this.hue = Math.random() * 60 + 200;
            this.angle = Math.atan2(endY - startY, endX - startX);
        }

        evolve() {
            this.duration--;
            this.luminosity = Math.max(0, this.duration / 60);

            if (this.duration > 0) {
                this.generateEnergyParticle();
            }

            this.updateEnergyParticles();
        }

        generateEnergyParticle() {
            const t = Math.random();
            const x = this.startX + (this.endX - this.startX) * t;
            const y = this.startY + (this.endY - this.startY) * t;
            this.energyParticles.push({
                x: x + (Math.random() - 0.5) * 10,
                y: y + (Math.random() - 0.5) * 10,
                radius: Math.random() * 3 + 1,
                lifespan: 30,
                hue: this.hue,
                drift: {
                    x: (Math.random() - 0.5) * 2,
                    y: (Math.random() - 0.5) * 2
                }
            });
        }

        updateEnergyParticles() {
            this.energyParticles.forEach((particle, index) => {
                particle.lifespan--;
                particle.radius *= 0.95;
                particle.x += particle.drift.x;
                particle.y += particle.drift.y;
                if (particle.lifespan <= 0 || particle.radius < 0.1) {
                    this.energyParticles.splice(index, 1);
                }
            });
        }

        render() {
            if (this.duration <= 0) return;

            ctx.save();
            ctx.translate(this.startX, this.startY);
            ctx.rotate(this.angle);

            const bladeGradient = ctx.createLinearGradient(0, 0, this.bladeLength, 0);
            bladeGradient.addColorStop(0, `hsla(${this.hue}, 100%, 50%, ${this.luminosity})`);
            bladeGradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);

            ctx.strokeStyle = bladeGradient;
            ctx.lineWidth = this.bladeWidth;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(this.bladeLength, 0);
            ctx.stroke();

            ctx.restore();

            this.renderEnergyParticles();
        }

        renderEnergyParticles() {
            this.energyParticles.forEach(particle => {
                ctx.fillStyle = `hsla(${particle.hue}, 100%, 50%, ${particle.lifespan / 30})`;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    }

    class OceanWave {
        constructor(baseY, waveHeight, waveFreq, waveSpeed, waveColor, waveDirection) {
            this.baseY = baseY;
            this.waveHeight = waveHeight;
            this.waveFreq = waveFreq;
            this.waveSpeed = waveSpeed;
            this.waveColor = waveColor;
            this.waveDirection = waveDirection;
            this.offset = 0;
        }

        progress() {
            this.offset += this.waveSpeed * this.waveDirection;
        }

        visualize() {
            ctx.beginPath();
            ctx.moveTo(0, this.baseY);
            for (let x = 0; x < canvas.width; x += 5) {
                const y = this.baseY + Math.sin((x + this.offset) * this.waveFreq) * this.waveHeight;
                ctx.lineTo(x, y);
            }
            ctx.lineTo(canvas.width, canvas.height);
            ctx.lineTo(0, canvas.height);
            ctx.fillStyle = this.waveColor;
            ctx.fill();
        }
    }

    const energyBlades = [];
    const oceanWaves = [];

    function initializeOceanWaves() {
        for (let i = 0; i < 5; i++) {
            const baseY = canvas.height - i * 50 - 50;
            const waveHeight = 20 - i * 3;
            const waveFreq = 0.01 + i * 0.002;
            const waveSpeed = 0.5 + i * 0.1;
            const waveColor = `rgba(0, ${100 + i * 30}, ${200 + i * 10}, ${0.5 - i * 0.1})`;
            const waveDirection = Math.random() < 0.5 ? -1 : 1;
            oceanWaves.push(new OceanWave(baseY, waveHeight, waveFreq, waveSpeed, waveColor, waveDirection));
        }
    }

    function animationLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (Math.hypot(mouseX - prevMouseX, mouseY - prevMouseY) > 5) {
            energyBlades.push(new EnergyBlade(prevMouseX, prevMouseY, mouseX, mouseY));
            prevMouseX = mouseX;
            prevMouseY = mouseY;
        }

        energyBlades.forEach((blade, index) => {
            blade.evolve();
            blade.render();
            if (blade.duration <= 0) {
                energyBlades.splice(index, 1);
            }
        });

        oceanWaves.forEach(wave => {
            wave.progress();
            wave.visualize();
        });

        requestAnimationFrame(animationLoop);
    }

    canvas.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    initializeOceanWaves();
    animationLoop();
})(window, document);
