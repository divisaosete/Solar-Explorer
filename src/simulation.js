// Modelo ilustrativo: restaura o movimento perceptível da primeira versão.
// O tempo orbital é independente do giro visual, como informa a interface.
export const DEFAULT_SPEED = 1;
export const DAYS_PER_SECOND = 2;
export const advanceDays = (days, seconds, speed) => days + seconds * speed * DAYS_PER_SECOND;
// Giro suave (~126 s por volta em 1×). A inclinação do eixo define o sentido.
export const visualSpinAngle = seconds => (seconds * .05) % (Math.PI * 2);
