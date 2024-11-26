const canvas = document.getElementById('bubblesCanvas');
const ctx = canvas.getContext('2d');
const resetBtn = document.getElementById('resetBtn');

const circles = [
    { x: 50, y: 80, radius: 30, color: '#FFD700', originalColor: '#FFD700' },  // Yellow
    { x: 50, y: 160, radius: 30, color: '#4169E1', originalColor: '#4169E1' }, // Blue
    { x: 50, y: 240, radius: 30, color: '#DC143C', originalColor: '#DC143C' }, // Red
    { x: 50, y: 320, radius: 30, color: '#32CD32', originalColor: '#32CD32' }  // Green
];

const arrows = circles.map((circle, index) => ({
    x: 500,
    y: circle.y,
    moving: false,
    hit: false
}));

function drawCircle(circle) {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fillStyle = circle.color;
    ctx.fill();
    ctx.closePath();
}

function drawArrow(x, y) {
    ctx.beginPath();
    // Arrow line
    ctx.moveTo(x + 30, y);
    ctx.lineTo(x, y);
    
    // Arrow head
    ctx.lineTo(x + 10, y - 8);
    ctx.moveTo(x, y);
    ctx.lineTo(x + 10, y + 8);
    
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw circles
    circles.forEach(drawCircle);
    
    // Draw and update arrows
    arrows.forEach((arrow, index) => {
        if (arrow.moving && !arrow.hit) {
            arrow.x -= 5;
            
            // Check collision
            const circle = circles[index];
            const dx = arrow.x - circle.x;
            const dy = arrow.y - circle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < circle.radius) {
                arrow.hit = true;
                circle.color = '#808080'; // Change to gray when hit
            }
        }
        if (!arrow.hit) {
            drawArrow(arrow.x, arrow.y);
        }
    });
    
    requestAnimationFrame(animate);
}

function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    circles.forEach((circle, index) => {
        const dx = mouseX - circle.x;
        const dy = mouseY - circle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < circle.radius && !arrows[index].hit) {
            arrows[index].moving = true;
        }
    });
}

function reset() {
    circles.forEach((circle, index) => {
        circle.color = circle.originalColor;
        arrows[index].x = 500;
        arrows[index].moving = false;
        arrows[index].hit = false;
    });
}

canvas.addEventListener('click', handleClick);
resetBtn.addEventListener('click', reset);

animate();