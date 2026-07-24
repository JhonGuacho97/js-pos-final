export const createGradient = (ctx, chartArea, r, g, b) => {
    const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
    gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.85)`);
    gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.15)`);
    return gradient;
};

export const gradients = {
    blue: (ctx, chartArea) => createGradient(ctx, chartArea, 47, 111, 237), // acento (azul)
    green: (ctx, chartArea) => createGradient(ctx, chartArea, 148, 163, 184),  // gris pizarra claro
    orange: (ctx, chartArea) => createGradient(ctx, chartArea, 100, 116, 139),  // gris pizarra medio
    pink: (ctx, chartArea) => createGradient(ctx, chartArea, 203, 213, 225),   // gris pizarra más claro
};