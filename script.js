/* ====================================================
   Muhammad Haris Portfolio – Bioinformatics JS Engine
   ==================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ── Custom Cursor ──────────────────────────────────
    const dot  = document.querySelector('.cursor-dot');
    const ring = document.querySelector('.cursor-ring');
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (isTouchDevice) {
        if (dot) dot.style.display = 'none';
        if (ring) ring.style.display = 'none';
        document.body.style.cursor = 'auto';
    } else {
        let mx = window.innerWidth/2, my = window.innerHeight/2;
        let rx = mx, ry = my;

        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

        if (dot && ring) {
            (function animRing() {
                rx += (mx - rx) * 0.12;
                ry += (my - ry) * 0.12;
                dot.style.left  = mx + 'px';  dot.style.top  = my + 'px';
                ring.style.left = rx + 'px';  ring.style.top = ry + 'px';
                requestAnimationFrame(animRing);
            })();

            document.querySelectorAll('a, button, .service-card, .contribution-card, .gallery-item, .stack-tag, .sci-link').forEach(el => {
                el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
                el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
            });
        }
    }

    // ... (Loader code remains same) ...
    // [Keeping lines 31-100 as they are but wrapping in the context]
    
    // (Assuming lines 31-100 are present)
    const loader     = document.getElementById('loader');
    const loaderBar  = document.querySelector('.loader-bar');
    const loaderText = document.querySelector('.loader-text');
    const lcanvas    = document.getElementById('loaderCanvas');

    if (loader) {
        if (lcanvas) {
            const lctx = lcanvas.getContext('2d');
            lcanvas.width = 200; lcanvas.height = 200;
            let lt = 0, loaderRunning = true;
            function drawLoaderDNA() {
                if (!loaderRunning) return;
                lctx.clearRect(0, 0, 200, 200);
                for (let i = 0; i < 40; i++) {
                    const y   = (i / 40) * 200;
                    const ang = lt + (i / 40) * Math.PI * 3;
                    const x1  = 100 + Math.cos(ang) * 55;
                    const x2  = 100 - Math.cos(ang) * 55;
                    const alpha = 0.15 + 0.7 * Math.abs(Math.cos(ang));
                    lctx.beginPath(); lctx.arc(x1, y, 4, 0, Math.PI*2);
                    lctx.fillStyle = `rgba(0,245,255,${alpha})`; lctx.fill();
                    lctx.beginPath(); lctx.arc(x2, y, 4, 0, Math.PI*2);
                    lctx.fillStyle = `rgba(124,58,237,${alpha})`; lctx.fill();
                    if (i % 4 === 0) {
                        lctx.beginPath(); lctx.moveTo(x1, y); lctx.lineTo(x2, y);
                        lctx.strokeStyle = `rgba(57,255,20,${alpha*0.5})`;
                        lctx.lineWidth = 1; lctx.stroke();
                    }
                }
                lt += 0.04;
                requestAnimationFrame(drawLoaderDNA);
            }
            drawLoaderDNA();
        }
        const seqLabels = ['LOADING GENOMIC DATA...','ALIGNING SEQUENCES...','COMPUTING VARIANTS...','INITIALIZING TERMINAL...'];
        let pct = 0, step = 0;
        const interval = setInterval(() => {
            pct += 1.5;
            if (loaderBar) loaderBar.style.width = Math.min(pct, 100) + '%';
            if (loaderText && step < seqLabels.length && pct > step * 25) {
                loaderText.textContent = seqLabels[step++];
            }
            if (pct >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    loader.style.opacity = '0';
                    loader.style.transition = 'opacity 0.8s ease';
                    setTimeout(() => { loader.style.display = 'none'; loaderRunning = false; }, 800);
                    initAfterLoad();
                }, 300);
            }
        }, 20);
    } else {
        initAfterLoad();
    }

    function initAfterLoad() {
        initHeroDNA();
        initParticleNetwork();
        initTypewriter();
        initScrollReveal();
        initMetrics();
        initNavHighlight();
        initCardTilt();
        initRadarChart();
        initTextareaResize();
    }

    // ── Hero DNA Helix Canvas ───────────────────────────
    function initHeroDNA() {
        const canvas = document.getElementById('heroCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        function setSize() {
            const container = canvas.parentElement;
            canvas.width = 380; canvas.height = 480; 
            // We keep the internal coordinate system consistent but scale via CSS if needed
        }
        setSize();

        const bases  = ['A','T','G','C'];
        const colMap = { A:'0,245,255', T:'124,58,237', G:'57,255,20', C:'255,107,107' };
        let t = 0;

        const floaters = Array.from({length: 12}, () => ({
            x: Math.random()*380, y: Math.random()*480,
            base: bases[Math.floor(Math.random()*4)],
            size: Math.random()*8+7,
            vx: (Math.random()-0.5)*0.3,
            vy: -(Math.random()*0.4+0.1),
            alpha: Math.random()*0.3+0.1
        }));

        const ripples = [];
        canvas.addEventListener('click', e => {
            const r = canvas.getBoundingClientRect();
            ripples.push({ x: (e.clientX-r.left) * (380/r.width), y: (e.clientY-r.top) * (480/r.height), r: 0, alpha: 0.9 });
        });

        function draw() {
            ctx.clearRect(0, 0, 380, 480);
            const steps = 60; // Reduced for performance on mobile
            for (let i = 0; i < steps; i++) {
                const prog  = i/steps;
                const y     = 20 + prog*440;
                const ang   = t + prog*Math.PI*5;
                const amp   = 70 * Math.sin(prog*Math.PI);
                const x1    = 190 + Math.cos(ang)*amp;
                const x2    = 190 - Math.cos(ang)*amp;
                const depth = (Math.cos(ang)+1)/2;
                const alpha = 0.15 + depth*0.7;
                const sz    = 2 + depth*3.5;

                ctx.beginPath(); ctx.arc(x1, y, sz, 0, Math.PI*2);
                ctx.fillStyle = `rgba(0,245,255,${alpha})`; ctx.fill();
                ctx.beginPath(); ctx.arc(x2, y, sz*0.8, 0, Math.PI*2);
                ctx.fillStyle = `rgba(124,58,237,${alpha})`; ctx.fill();

                if (i%6===0) {
                    ctx.beginPath();
                    ctx.moveTo(x1,y); ctx.lineTo(x2,y);
                    ctx.strokeStyle=`rgba(57,255,20,${alpha*0.4})`;
                    ctx.lineWidth=1; ctx.stroke();
                    const label = bases[(i/6)%4];
                    ctx.font=`bold ${7+depth*5}px JetBrains Mono,monospace`;
                    ctx.fillStyle=`rgba(255,255,255,${alpha*0.5})`;
                    ctx.textAlign='center';
                    ctx.fillText(label,(x1+x2)/2,y-4);
                }
            }

            floaters.forEach(f => {
                const rgb = colMap[f.base];
                ctx.font = `bold ${f.size}px JetBrains Mono,monospace`;
                ctx.fillStyle = `rgba(${rgb},${f.alpha})`;
                ctx.textAlign = 'center';
                ctx.fillText(f.base, f.x, f.y);
                f.x += f.vx; f.y += f.vy;
                if (f.y < -20) { f.y = 500; f.x = Math.random()*380; }
                if (f.x<0||f.x>380) f.vx*=-1;
            });

            for (let i = ripples.length-1; i>=0; i--) {
                const rp = ripples[i];
                ctx.beginPath(); ctx.arc(rp.x, rp.y, rp.r, 0, Math.PI*2);
                ctx.strokeStyle = `rgba(0,245,255,${rp.alpha})`;
                ctx.lineWidth=2; ctx.stroke();
                rp.r+=2; rp.alpha-=0.025;
                if (rp.alpha<=0) ripples.splice(i,1);
            }
            t += 0.015;
            requestAnimationFrame(draw);
        }
        draw();
    }

    // ── Particle Network Background ─────────────────────
    function initParticleNetwork() {
        const canvas = document.getElementById('bgCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W, H, particles;
        let mouse = { x:-9999, y:-9999 };

        if (!isTouchDevice) {
            document.addEventListener('mousemove', e => { mouse.x=e.clientX; mouse.y=e.clientY; });
        }

        function init() {
            W = canvas.width  = window.innerWidth;
            H = canvas.height = window.innerHeight;
            const count = Math.min(60, Math.max(25, Math.floor(W*H/25000))); // Optimized count
            particles = Array.from({length:count}, () => ({
                x: Math.random()*W, y: Math.random()*H,
                vx: (Math.random()-0.5)*0.25, vy: (Math.random()-0.5)*0.25,
                r: Math.random()*1.5+0.5,
                cyan: Math.random()>0.5,
                pulse: Math.random()*Math.PI*2
            }));
        }

        function draw() {
            ctx.clearRect(0,0,W,H);
            particles.forEach(p => {
                p.pulse += 0.015;
                const pA = 0.2 + Math.sin(p.pulse)*0.1;

                if (!isTouchDevice) {
                    const dx=p.x-mouse.x, dy=p.y-mouse.y;
                    const dist=Math.sqrt(dx*dx+dy*dy);
                    if (dist<100 && dist>0) {
                        const force=(100-dist)/100*0.3;
                        p.vx+=(dx/dist)*force; p.vy+=(dy/dist)*force;
                    }
                }
                p.vx*=0.99; p.vy*=0.99;
                p.x+=p.vx; p.y+=p.vy;
                if(p.x<0)p.x=W; if(p.x>W)p.x=0;
                if(p.y<0)p.y=H; if(p.y>H)p.y=0;

                ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
                ctx.fillStyle = p.cyan ? `rgba(0,245,255,${pA})` : `rgba(124,58,237,${pA})`;
                ctx.fill();
            });

            for (let i=0; i<particles.length; i++) {
                for (let j=i+1; j<particles.length; j++) {
                    const a=particles[i], b=particles[j];
                    const dx=a.x-b.x, dy=a.y-b.y;
                    const d=Math.sqrt(dx*dx+dy*dy);
                    if (d<100) {
                        ctx.beginPath();
                        ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
                        ctx.strokeStyle=`rgba(0,245,255,${(1-d/100)*0.15})`;
                        ctx.lineWidth=0.5; ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(draw);
        }

        window.addEventListener('resize', init);
        init(); draw();
    }

    // ── Typewriter ──────────────────────────────────────
    function initTypewriter() {
        const el = document.querySelector('.typewriter-wrap');
        if (!el) return;
        const phrases = [
            'GENOMICS SPECIALIST',
            'TRANSCRIPTOMICS ANALYST',
            'BIOINFORMATICS COLLABORATOR',
            'MULTI-OMICS RESEARCHER',
            'RESEARCH SCIENTIST'
        ];
        let pi=0, ci=0, deleting=false;
        function tick() {
            const phrase=phrases[pi];
            if (!deleting) {
                el.textContent=phrase.slice(0,++ci);
                if (ci===phrase.length) { deleting=true; setTimeout(tick,2000); return; }
            } else {
                el.textContent=phrase.slice(0,--ci);
                if (ci===0) { deleting=false; pi=(pi+1)%phrases.length; setTimeout(tick,400); return; }
            }
            setTimeout(tick, deleting?40:70);
        }
        tick();
    }

    // ── Scroll Reveal ───────────────────────────────────
    function initScrollReveal() {
        const els = document.querySelectorAll('[data-reveal]');
        if (!els.length) return;
        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseInt(entry.target.dataset.delay||0);
                    setTimeout(()=>entry.target.classList.add('revealed'), delay);
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold:0.05, rootMargin:'0px 0px -20px 0px' });
        els.forEach(el=>obs.observe(el));
    }

    // ── Animated Metrics ────────────────────────────────
    function initMetrics() {
        const items = document.querySelectorAll('.metric-item');
        if (!items.length) return;
        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const item   = entry.target;
                const numEl  = item.querySelector('.metric-number-inner');
                const ring   = item.querySelector('.metric-ring-progress');
                const target = parseInt(item.dataset.target||0);
                if (!numEl || numEl.dataset.counted) return;
                numEl.dataset.counted = '1';
                const circ = 2*Math.PI*45;
                const start = Date.now();
                function update() {
                    const p    = Math.min((Date.now()-start)/1500, 1);
                    const ease = 1-Math.pow(1-p,3);
                    numEl.textContent = Math.floor(ease*target);
                    if (ring) {
                        const fill = Math.min(target/10, 1);
                        ring.style.strokeDashoffset = circ - circ*ease*fill;
                    }
                    if (p<1) requestAnimationFrame(update);
                    else numEl.textContent=target;
                }
                update();
                obs.unobserve(item);
            });
        }, {threshold:0.2});
        items.forEach(i=>obs.observe(i));
    }

    // ── Nav Active Link ─────────────────────────────────
    function initNavHighlight() {
        const sections = document.querySelectorAll('section[id], header[id]');
        const links    = document.querySelectorAll('.nav-pill a');
        if (!sections.length||!links.length) return;
        const obs = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    links.forEach(l=>l.classList.remove('active'));
                    const a = document.querySelector(`.nav-pill a[href="#${entry.target.id}"]`);
                    if (a) {
                        a.classList.add('active');
                        // Center active link in mobile nav
                        if (window.innerWidth <= 768) {
                            a.parentElement.scrollTo({
                                left: a.offsetLeft - a.parentElement.offsetWidth/2 + a.offsetWidth/2,
                                behavior: 'smooth'
                            });
                        }
                    }
                }
            });
        }, {threshold:0.3});
        sections.forEach(s=>obs.observe(s));
    }

    // ── 3D Card Tilt (Disabled on mobile) ───────────────
    function initCardTilt() {
        if (isTouchDevice) return;
        document.querySelectorAll('.service-card, .contribution-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const r  = card.getBoundingClientRect();
                const x  = e.clientX-r.left-r.width/2;
                const y  = e.clientY-r.top-r.height/2;
                const rx = (-y/r.height*2)*5;
                const ry = ( x/r.width *2)*5;
                card.style.transform=`perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
            });
            card.addEventListener('mouseleave', ()=>{ card.style.transform=''; });
        });
    }

    // ── Radar Chart ─────────────────────────────────────
    function initRadarChart() {
        const canvas = document.getElementById('radarCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let dpr, W, H, cx, cy, R;
        
        const skills = [
            {label:'Transcriptomics', value:0.92},
            {label:'Clinical WES',    value:0.85},
            {label:'Machine Learning',value:0.78},
            {label:'Data Viz',        value:0.90},
            {label:'Pipeline Dev',    value:0.82},
            {label:'Meta-Analysis',   value:0.80}
        ];
        const N=skills.length;
        let animated=false;

        function setRadarSize() {
            dpr = window.devicePixelRatio || 1;
            const containerWidth = canvas.parentElement.offsetWidth;
            W = Math.min(520, containerWidth);
            H = W;
            canvas.width = W * dpr;
            canvas.height = H * dpr;
            canvas.style.width = W + 'px';
            canvas.style.height = H + 'px';
            ctx.scale(dpr, dpr);
            cx=W/2; cy=H/2; R=W*0.3;
        }

        function pt(ang, r) {
            return { x: cx+Math.cos(ang-Math.PI/2)*r, y: cy+Math.sin(ang-Math.PI/2)*r };
        }

        function draw(p) {
            ctx.clearRect(0,0,W,H);
            for (let ring=1;ring<=5;ring++) {
                ctx.beginPath();
                for (let i=0;i<=N;i++) {
                    const a=(i/N)*Math.PI*2, rr=R*(ring/5);
                    const pp=pt(a,rr);
                    i===0?ctx.moveTo(pp.x,pp.y):ctx.lineTo(pp.x,pp.y);
                }
                ctx.closePath();
                ctx.strokeStyle='rgba(0,245,255,0.07)'; ctx.stroke();
            }
            for (let i=0;i<N;i++) {
                const a=(i/N)*Math.PI*2, pp=pt(a,R);
                ctx.beginPath(); ctx.moveTo(cx,cy); ctx.lineTo(pp.x,pp.y);
                ctx.strokeStyle='rgba(0,245,255,0.08)'; ctx.stroke();
            }
            ctx.beginPath();
            for (let i=0;i<=N;i++) {
                const si=i%N, a=(si/N)*Math.PI*2;
                const pp=pt(a, R*skills[si].value*p);
                i===0?ctx.moveTo(pp.x,pp.y):ctx.lineTo(pp.x,pp.y);
            }
            ctx.closePath();
            ctx.fillStyle='rgba(0,245,255,0.08)'; ctx.fill();
            ctx.strokeStyle='#00f5ff'; ctx.lineWidth=2; ctx.stroke();

            for (let i=0;i<N;i++) {
                const a=(i/N)*Math.PI*2;
                const pp=pt(a, R*skills[i].value*p);
                const lp=pt(a, R + (W > 400 ? 35 : 25));
                ctx.beginPath(); ctx.arc(pp.x,pp.y,4,0,Math.PI*2);
                ctx.fillStyle='#00f5ff'; ctx.fill();
                ctx.font=`bold ${W > 400 ? 11 : 9}px JetBrains Mono,monospace`;
                ctx.fillStyle='rgba(232,244,248,0.7)'; ctx.textAlign='center';
                ctx.fillText(skills[i].label,lp.x,lp.y+4);
            }
        }

        setRadarSize();
        draw(0);
        window.addEventListener('resize', () => { setRadarSize(); if(animated) draw(1); else draw(0); });

        const obs=new IntersectionObserver(entries=>{
            if (entries[0].isIntersecting&&!animated) {
                animated=true;
                const start=Date.now();
                function anim() {
                    const p=Math.min((Date.now()-start)/1200,1);
                    draw(1-Math.pow(1-p,3));
                    if(p<1) requestAnimationFrame(anim);
                }
                anim();
            }
        },{threshold:0.2});
        obs.observe(canvas);
    }

    function initTextareaResize() {
        const tx=document.querySelector('.form-textarea');
        if(tx) tx.addEventListener('input',function(){
            this.style.height='auto'; this.style.height=this.scrollHeight+'px';
        });
    }

});

window.openLightbox = (src, caption) => {
    const lb=document.getElementById('lightbox');
    const img=document.getElementById('lightboxImg');
    const cap=document.getElementById('lightboxCaption');
    if(lb&&img&&cap){
        img.src=src; cap.textContent=caption;
        lb.style.display='flex';
        document.body.style.overflow='hidden';
    }
};
window.closeLightbox = () => {
    const lb=document.getElementById('lightbox');
    if(lb){ lb.style.display='none'; document.body.style.overflow='auto'; }
};
document.addEventListener('keydown',e=>{ if(e.key==='Escape') window.closeLightbox(); });
