export function detectCollision(character1, character2) {
  // Implement simple collision detection
  const distance = Math.sqrt(
    Math.pow(character1.x - character2.x, 2) + Math.pow(character1.y - character2.y, 2)
  );
  return distance < 2; // Assuming characters are 1 unit wide
}

export function resolveCollision(character1, character2) {
  // Implement collision resolution
  const midpoint = (character1.x + character2.x) / 2;
  character1.x = midpoint - 1;
  character2.x = midpoint + 1;
}