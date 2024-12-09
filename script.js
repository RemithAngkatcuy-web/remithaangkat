// Mendapatkan elemen canvas dan konteks 2D
const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');

// Tombol reset simulasi
const resetButton = document.getElementById('resetButton');

// Elemen untuk menampilkan koordinat
const positionDisplay = document.getElementById('positionDisplay');

// Skala untuk memperbesar jarak planet ke dalam canvas
const scale = 2.5e-10; // Skala disesuaikan untuk visibilitas

// Konstanta Gravitasi (m^3 kg^-1 s^-2)
const G = 6.67430e-11;

// Massa Matahari (kg)
const massSun = 1.9885e30;

// Massa Jupiter (kg)
const massJupiter = 1.8982e27;

// Waktu (detik)
const dtInitial = 86400 * 10; // 10 hari
let dt = dtInitial;

// Inisialisasi posisi (meter) dan kecepatan (meter per detik) Jupiter
const initialPosition = { x: 7.78e11, y: 0 }; // Jarak rata-rata Jupiter dari Matahari
const initialVelocity = { x: 0, y: 13070 }; // Kecepatan orbit rata-rata Jupiter

let position = { ...initialPosition };
let velocity = { ...initialVelocity };

// Posisi Matahari di tengah canvas
const sunPosition = { x: canvas.width / 2, y: canvas.height / 2 };

// Array untuk menyimpan jejak orbit Jupiter
let trail = [];

// Fungsi untuk menghitung gaya gravitasi
function calculateGravitationalForce(pos) {
    // Jarak antara Matahari dan Jupiter
    let dx = pos.x;
    let dy = pos.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    // Menghindari pembagian dengan nol
    if (distance === 0) return { fx: 0, fy: 0 };

    // Menghitung gaya gravitasi
    let force = (G * massSun * massJupiter) / (distance * distance);

    // Komponen gaya (arah ke Matahari)
    let fx = -force * (dx / distance);
    let fy = -force * (dy / distance);

    return { fx, fy };
}

// Fungsi untuk menggambar garis orbit
function drawOrbit() {
    ctx.beginPath();
    ctx.arc(sunPosition.x, sunPosition.y, initialPosition.x * scale, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(52, 152, 219, 0.5)'; // Warna biru dengan transparansi
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.closePath();
}

// Fungsi untuk menggambar Matahari
function drawSun() {
    ctx.beginPath();
    ctx.arc(sunPosition.x, sunPosition.y, 20, 0, Math.PI * 2);
    ctx.fillStyle = 'yellow';
    ctx.fill();
    ctx.closePath();
}

// Fungsi untuk menggambar Jupiter
function drawJupiter(pos) {
    // Mengonversi posisi ke koordinat canvas
    let x = sunPosition.x + pos.x * scale;
    let y = sunPosition.y + pos.y * scale;

    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'orange';
    ctx.fill();
    ctx.closePath();

    // Menambahkan posisi ke jejak
    trail.push({ x, y });

    // Menggambar jejak
    if (trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(trail[trail.length - 2].x, trail[trail.length - 2].y);
        ctx.lineTo(x, y);
        ctx.strokeStyle = 'rgba(255,165,0,0.5)';
        ctx.stroke();
        ctx.closePath();
    }

    // Batasi panjang jejak
    if (trail.length > 1000) {
        trail.shift();
    }

    // Menampilkan koordinat posisi Jupiter
    displayPosition(pos);
}

// Fungsi untuk menampilkan koordinat posisi Jupiter
function displayPosition(pos) {
    // Menampilkan koordinat dalam meter dengan notasi eksponensial
    const xPos = pos.x.toExponential(3);
    const yPos = pos.y.toExponential(3);
    positionDisplay.textContent = `X: ${xPos} m, Y: ${yPos} m`;
}

// Fungsi utama untuk memperbarui dan menggambar simulasi
function update() {
    // Menghitung gaya gravitasi
    let force = calculateGravitationalForce(position);

    // Menghitung percepatan
    let ax = force.fx / massJupiter;
    let ay = force.fy / massJupiter;

    // Mengupdate kecepatan
    velocity.x += ax * dt;
    velocity.y += ay * dt;

    // Mengupdate posisi
    position.x += velocity.x * dt;
    position.y += velocity.y * dt;
}

// Fungsi untuk menggambar semua elemen
function draw() {
    // Membersihkan canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Menggambar garis orbit
    drawOrbit();

    // Menggambar Matahari dan Jupiter
    drawSun();
    drawJupiter(position);
}

// Fungsi animasi
function animate() {
    update();
    draw();
    requestAnimationFrame(animate);
}

// Fungsi untuk reset simulasi
function resetSimulation() {
    // Reset posisi dan kecepatan
    position = { ...initialPosition };
    velocity = { ...initialVelocity };

    // Reset jejak
    trail = [];

    // Membersihkan canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Menggambar ulang garis orbit, Matahari, dan Jupiter di posisi awal
    drawOrbit();
    drawSun();
    drawJupiter(position);
}

// Menambahkan event listener untuk tombol reset
resetButton.addEventListener('click', resetSimulation);

// Memulai animasi
animate();
