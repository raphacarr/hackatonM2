// Create textures programmatically
function createAppleTexture() {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 512;
    canvas.height = 512;
    
    // Base red color
    context.fillStyle = '#e74c3c';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add some subtle variations
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = 5 + Math.random() * 15;
        
        // Lighter or darker spots
        if (Math.random() > 0.5) {
            context.fillStyle = 'rgba(231, 76, 60, 0.7)'; // Lighter red
        } else {
            context.fillStyle = 'rgba(192, 57, 43, 0.7)'; // Darker red
        }
        
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
    }
    
    return canvas;
}

// Export textures
window.TextureGenerator = {
    createAppleTexture
};
