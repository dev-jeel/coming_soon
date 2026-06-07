document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. Countdown Timer Logic
    // ==========================================================================
    // Set launch date: October 15, 2026 (based on current date of May 20, 2026)
    const launchDate = new Date('October 15, 2026 00:00:00').getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const difference = launchDate - now;

        if (difference < 0) {
            // If target is reached, set everything to zero
            document.getElementById('days').innerText = '00';
            document.getElementById('hours').innerText = '00';
            document.getElementById('minutes').innerText = '00';
            document.getElementById('seconds').innerText = '00';
            clearInterval(countdownInterval);
            return;
        }

        // Time calculations
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Update elements with leading zero format
        document.getElementById('days').innerText = String(days).padStart(2, '0');
        document.getElementById('hours').innerText = String(hours).padStart(2, '0');
        document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
        document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
    };

    // Run countdown immediately and then update every second
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);


    // ==========================================================================
    // 2. Interactive Canvas Particles
    // ==========================================================================
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    let particles = [];
    let mouse = { x: null, y: null, radius: 120 };

    // Set canvas sizes
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    };

    window.addEventListener('resize', resizeCanvas);

    // Track mouse coordinates
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Particle Object Definition
    class Particle {
        constructor(x, y, dx, dy, size, color) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.size = size;
            this.color = color;
            this.baseSize = size;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // Bounce on borders
            if (this.x + this.size > canvas.width || this.x - this.size < 0) {
                this.dx = -this.dx;
            }
            if (this.y + this.size > canvas.height || this.y - this.size < 0) {
                this.dy = -this.dy;
            }

            // Move particle
            this.x += this.dx;
            this.y += this.dy;

            // Interactive effect with mouse
            if (mouse.x !== null && mouse.y !== null) {
                let diffX = mouse.x - this.x;
                let diffY = mouse.y - this.y;
                let distance = Math.sqrt(diffX * diffX + diffY * diffY);

                if (distance < mouse.radius) {
                    // Slightly attract particles to cursor
                    const force = (mouse.radius - distance) / mouse.radius;
                    this.x -= (diffX / distance) * force * 1.5;
                    this.y -= (diffY / distance) * force * 1.5;
                    
                    // Increase size near cursor
                    if (this.size < this.baseSize * 1.5) {
                        this.size += 0.1;
                    }
                } else if (this.size > this.baseSize) {
                    this.size -= 0.1;
                }
            } else if (this.size > this.baseSize) {
                this.size -= 0.1;
            }

            this.draw();
        }
    }

    // Initialize Particle Grid
    const initParticles = () => {
        particles = [];
        // Adjust particle density based on screen width (mobile vs desktop)
        const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 75);
        
        for (let i = 0; i < particleCount; i++) {
            const size = Math.random() * 2 + 1.5;
            const x = Math.random() * (canvas.width - size * 2) + size;
            const y = Math.random() * (canvas.height - size * 2) + size;
            const dx = (Math.random() - 0.5) * 0.4;
            const dy = (Math.random() - 0.5) * 0.4;
            
            // Subtle indigo/purple/teal shades for particles
            const colors = ['rgba(99, 102, 241, 0.45)', 'rgba(168, 85, 247, 0.4)', 'rgba(20, 184, 166, 0.4)'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            particles.push(new Particle(x, y, dx, dy, size, color));
        }
    };

    // Draw connecting lines between close particles
    const drawConnections = () => {
        let maxDistance = 110;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                let distSq = Math.pow(particles[i].x - particles[j].x, 2) + Math.pow(particles[i].y - particles[j].y, 2);
                let distance = Math.sqrt(distSq);

                if (distance < maxDistance) {
                    // Line opacity depends on distance
                    let opacity = 1 - (distance / maxDistance);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${opacity * 0.15})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    };

    // Animation Loop
    const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
        }
        
        drawConnections();
        requestAnimationFrame(animate);
    };

    // Initial setup
    resizeCanvas();
    animate();


    // ==========================================================================
    // 3. Email Subscription Handling
    // ==========================================================================
    const subscribeForm = document.getElementById('subscribeForm');
    const emailInput = document.getElementById('emailInput');
    const formFeedback = document.getElementById('formFeedback');
    const submitBtn = document.getElementById('submitBtn');
    const submitBtnText = submitBtn.querySelector('span');
    const submitBtnIcon = submitBtn.querySelector('.button-icon');

    // Validation helper
    const isValidEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email.trim());
    };

    // Feedback message display
    const showFeedback = (message, type) => {
        formFeedback.innerText = message;
        formFeedback.className = `form-feedback show ${type}`;
    };

    // Form submit listener
    subscribeForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailValue = emailInput.value;

        // Reset feedback
        formFeedback.className = 'form-feedback';
        
        if (!emailValue) {
            showFeedback('Please enter your email address.', 'error');
            return;
        }

        if (!isValidEmail(emailValue)) {
            showFeedback('Please enter a valid email address.', 'error');
            emailInput.focus();
            return;
        }

        // Show subscribing loader state
        submitBtn.disabled = true;
        submitBtnText.innerText = 'Subscribing...';
        submitBtnIcon.className = 'fa-solid fa-circle-notch fa-spin button-icon';

        // Simulate API call (1.2 seconds latency)
        setTimeout(() => {
            // Save to localStorage as a demonstration of storage
            let subscribers = JSON.parse(localStorage.getItem('novalabs_subscribers')) || [];
            if (!subscribers.includes(emailValue.trim())) {
                subscribers.push(emailValue.trim());
                localStorage.setItem('novalabs_subscribers', JSON.stringify(subscribers));
            }

            // Restore button state
            submitBtn.disabled = false;
            submitBtnText.innerText = 'Notify Me';
            submitBtnIcon.className = 'fa-solid fa-arrow-right-long button-icon';

            // Show success confirmation
            showFeedback('🎉 Thank you! You have been added to our early access list.', 'success');
            emailInput.value = ''; // Clear input

            // Fade out success notification after 5 seconds
            setTimeout(() => {
                formFeedback.className = 'form-feedback';
            }, 5000);

        }, 1200);
    });
});
