document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('container');
    const mouse = { x: 0, y: 0, active: false };
    const cubes = [];
    const cubeCount = 20;
    const repulsionRadius = 250;
    const repulsionStrength = 0.3;
    
    // إنشاء المكعبات
    function createCubes() {
        container.innerHTML = '';
        
        for (let i = 0; i < cubeCount; i++) {
            const cube = document.createElement('div');
            cube.className = 'cube';
            
            for (let j = 0; j < 6; j++) {
                const face = document.createElement('div');
                face.className = `cube-face cube-face--${['front', 'back', 'right', 'left', 'top', 'bottom'][j]}`;
                cube.appendChild(face);
            }
            
            container.appendChild(cube);
            cubes.push({
                element: cube,
                x: (Math.random() - 0.5) * (window.innerWidth * 1.5),
                y: (Math.random() - 0.5) * (window.innerHeight * 1.5),
                z: (Math.random() - 0.5) * 1000,
                baseX: 0,
                baseY: 0,
                speed: Math.random() * 0.5 + 0.2,
                angle: Math.random() * Math.PI * 2
            });
        }
    }
    
    // تحديث موقع المكعبات
    function updateCubes() {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        cubes.forEach(cube => {
            // الحركة الأساسية الدائرية
            cube.angle += cube.speed * 0.005;
            cube.baseX = Math.cos(cube.angle) * (window.innerWidth * 0.4);
            cube.baseY = Math.sin(cube.angle) * (window.innerHeight * 0.4);
            
            // حساب تأثير الماوس
            const dx = mouse.x - (cube.x + centerX);
            const dy = mouse.y - (cube.y + centerY);
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (mouse.active && distance < repulsionRadius) {
                const angle = Math.atan2(dy, dx);
                const force = (repulsionRadius - distance) / repulsionRadius * repulsionStrength;
                
                cube.x = cube.baseX - Math.cos(angle) * force * repulsionRadius;
                cube.y = cube.baseY - Math.sin(angle) * force * repulsionRadius;
            } else {
                // العودة بسلاسة إلى الموضع الأساسي
                cube.x += (cube.baseX - cube.x) * 0.05;
                cube.y += (cube.baseY - cube.y) * 0.05;
            }
            
            // تطبيق التحويلات
            cube.element.style.transform = 
                `translate3d(${cube.x}px, ${cube.y}px, ${cube.z}px)
                 rotateX(${cube.y * 0.1}deg)
                 rotateY(${cube.x * 0.1}deg)
                 scale(${1 + (distance < repulsionRadius ? (1 - distance/repulsionRadius) * 0.5 : 0)})`;
        });
        
        requestAnimationFrame(updateCubes);
    }
    
    // تتبع حركة الماوس
    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX - window.innerWidth / 2;
        mouse.y = e.clientY - window.innerHeight / 2;
        mouse.active = true;
    });
    
    document.addEventListener('mouseleave', () => {
        mouse.active = false;
    });
    
    // تكييف مع حجم الشاشة
    window.addEventListener('resize', () => {
        createCubes();
    });
    
    // بدء الحركة
    createCubes();
    updateCubes();
});