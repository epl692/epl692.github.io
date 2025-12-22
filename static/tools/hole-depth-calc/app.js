document.getElementById('holeForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const volume = parseFloat(document.getElementById('volume').value);
  const diameterInches = parseFloat(document.getElementById('diameter').value);
  const resultDiv = document.getElementById('result');

  if (isNaN(volume) || isNaN(diameterInches) || volume <= 0 || diameterInches <= 0) {
    resultDiv.textContent = 'Please enter valid positive numbers.';
    resultDiv.style.color = 'var(--error)';
    return;
  }

  // Follow the C++ logic: convert volume to cubic inches, use radius in inches
  const radiusInches = diameterInches / 2.0;
  const volumeCubicInches = volume * 1728.0; // 12^3
  const areaSquareInches = Math.PI * Math.pow(radiusInches, 2);
  const depthInches = volumeCubicInches / areaSquareInches;
  const depthFeet = depthInches / 12.0;
  // Debug log for tracing values (visible in browser console)
  console.log('hole-calc', {
    volume, diameterInches, radiusInches, volumeCubicInches, areaSquareInches, depthInches, depthFeet
  });

  resultDiv.textContent = `Depth: ${depthInches.toFixed(1)} inches (${depthFeet.toFixed(2)} ft)`;
  resultDiv.style.color = 'var(--accent)';
});

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js');
  });
}
