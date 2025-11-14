/* ======================================================
   KONFIGURASI KATEGORI & DAFTAR MAPEL
====================================================== */

const CATS = ["IPA", "IPS", "BAHASA", "SENI", "TEKNOLOGI", "KESEHATAN", "UMUM"];

const CAT_LABEL = {
  IPA: "Ilmu Pengetahuan Alam",
  IPS: "Ilmu Pengetahuan Sosial",
  BAHASA: "Bahasa & Sastra",
  SENI: "Seni/Desain",
  TEKNOLOGI: "Teknologi & Komputer",
  KESEHATAN: "Kesehatan",
  UMUM: "Umum"
};

// Mapel default
const DEFAULT_SUBJECTS = [
  ["Pendidikan Agama", "UMUM"],
  ["PPKn", "UMUM"],
  ["Sejarah Indonesia", "UMUM"],
  ["PJOK", "UMUM"],
  ["Prakarya/Kewirausahaan", "UMUM"],
  
  ["Bahasa Indonesia", "BAHASA"],
  ["Bahasa Indonesia Tingkat Lanjut", "BAHASA"],
  ["Bahasa Inggris", "BAHASA"],
  ["Bahasa Inggris Tingkat Lanjut", "BAHASA"],
  ["Bahasa Daerah", "BAHASA"],
  
  ["Bahasa Jepang", "BAHASA"],
  ["Bahasa Korea", "BAHASA"],
  ["Bahasa Mandarin", "BAHASA"],
  ["Bahasa Arab", "BAHASA"],
  ["Bahasa Jerman", "BAHASA"],
  ["Bahasa Prancis", "BAHASA"],
  
  ["Seni Budaya", "SENI"],
  
  ["Informatika/TIK", "TEKNOLOGI"],
  
  ["Matematika Wajib", "IPA"],
  ["Matematika Lanjutan (Peminatan)", "IPA"],
  ["Fisika", "IPA"],
  ["Kimia", "IPA"],
  ["Biologi", "IPA"],
  
  ["Ekonomi", "IPS"],
  ["Sosiologi", "IPS"],
  ["Geografi", "IPS"],
  ["Antropologi", "IPS"],
  ["Sejarah Tingkat Lanjut", "IPS"]
];

const tbody = document.getElementById("tbody");
const kpiGrid = document.getElementById("kpiGrid");
const recList = document.getElementById("recList");


/* ======================================================
   FUNGSI BUAT ROW
====================================================== */

function createRow(name, cat) {
  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td data-label="Mapel">${name}</td>
    <td data-label="Kategori">${cat}</td>
    ${[1,2,3,4,5].map(i => `
      <td data-label="S${i}">
        <input type="number" min="0" max="100" />
      </td>
    `).join("")}
    <td data-label="Rata-rata"><input type="number" readonly /></td>
    <td data-label="Aksi"><button class="del">🗑️</button></td>
  `;
  tbody.appendChild(tr);
}

DEFAULT_SUBJECTS.forEach(([n, c]) => createRow(n, c));


/* ======================================================
   HITUNG RATA-RATA TIAP MAPEL
====================================================== */

tbody.addEventListener("input", e => {
  if (e.target.type === "number" && !e.target.readOnly) {
    
    const row = e.target.closest("tr");
    const nums = [...row.querySelectorAll("input:not([readonly])")]
      .map(x => parseFloat(x.value) || 0);
    
    const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
    row.querySelector("input[readonly]").value =
      avg ? avg.toFixed(1) : "";
  }
});


/* ======================================================
   DELETE ROW
====================================================== */

tbody.addEventListener("click", e => {
  if (e.target.classList.contains("del")) {
    e.target.closest("tr").remove();
  }
});


/* ======================================================
   TOMBOL FITUR
====================================================== */

document.getElementById("btnReset").onclick = () => location.reload();

document.getElementById("btnAddRow").onclick = () =>
  createRow("Mapel Baru", "UMUM");

document.getElementById("btnFill").onclick = () => {
  document.querySelectorAll("#tbody tr").forEach(tr => {
    const inputs = tr.querySelectorAll("input:not([readonly])");
    inputs.forEach(i => i.value = Math.floor(60 + Math.random() * 40));
    
    const avg = [...inputs].reduce((a, b) => a + Number(b.value), 0) / 5;
    tr.querySelector("input[readonly]").value = avg.toFixed(1);
  });
};


/* ======================================================
   CETAK KLASTER & REKOMENDASI
====================================================== */

document.getElementById("btnRun").onclick = () => {
  
  /* ---------------------------
       1. Hitung klaster
  ---------------------------- */
  
  const cats = {};
  document.querySelectorAll("#tbody tr").forEach(tr => {
    const cat = tr.children[1].textContent;
    const avg = parseFloat(tr.querySelector("input[readonly]").value || 0);
    if (!cats[cat]) cats[cat] = [];
    cats[cat].push(avg);
  });
  
  // jadikan nilai akhir per kategori
  const clusterScore = {};
  CATS.forEach(c => {
    const arr = cats[c] || [];
    if (arr.length === 0) clusterScore[c] = 0;
    else clusterScore[c] = arr.reduce((a, b) => a + b, 0) / arr.length;
  });
  
  // Kesehatan ikut memakai nilai IPA
  clusterScore["KESEHATAN"] = clusterScore["IPA"];
  
  
  /* ---------------------------
       2. Tampilkan klaster bar
  ---------------------------- */
  
  kpiGrid.innerHTML = Object.entries(clusterScore).map(([cat, val]) => `
    <div class="kpi-item">
      <b>${CAT_LABEL[cat]}</b>
      <p>${val.toFixed(1)} / 100</p>
      <div class="kpi-bar">
        <div class="kpi-fill" style="width:${val}%;"></div>
      </div>
    </div>
  `).join("");
  
  
  /* ---------------------------
       3. Daftar Jurusan + bobot
  ---------------------------- */
  
  const MAJOR_DB = [
    ["Teknik Informatika", "TEKNOLOGI"],
    ["Sistem Informasi", "TEKNOLOGI"],
    ["Teknik Elektro", "TEKNOLOGI"],
    ["Teknik Industri", "TEKNOLOGI"],
    ["Teknik Mesin", "TEKNOLOGI"],
    ["Statistika", "IPA"],
    ["Matematika", "IPA"],
    ["Fisika", "IPA"],
    ["Kimia", "IPA"],
    ["Biologi", "IPA"],
    ["Kedokteran", "KESEHATAN"],
    ["Kedokteran Gigi", "KESEHATAN"],
    ["Farmasi", "KESEHATAN"],
    ["Keperawatan", "KESEHATAN"],
    ["Ilmu Komunikasi", "IPS"],
    ["Hubungan Internasional", "IPS"],
    ["Manajemen", "IPS"],
    ["Akuntansi", "IPS"],
    ["Desain Komunikasi Visual", "SENI"],
    ["Arsitektur", "SENI"],
    ["Sastra Inggris", "BAHASA"],
    ["Sastra Jepang", "BAHASA"]
  ];
  
  const scoredMajors = MAJOR_DB.map(([name, cat]) => {
    const score = clusterScore[cat] || 0;
    return { name, cat, score };
  }).sort((a, b) => b.score - a.score);
  
  
  /* ---------------------------
       4. Tampilkan TOP 20
  ---------------------------- */
  
  const top = scoredMajors.slice(0, 20);
  
  recList.innerHTML =
    top.map((m, i) => `
      <div class="rec-item">
        <div class="top">
          <span class="rec-rank">${i+1}</span>
          <span class="rec-name">${m.name}</span>
          <span class="rec-score">${m.score.toFixed(1)}</span>
        </div>

        <div class="rec-bar">
          <div class="rec-fill" style="width:${m.score}%;"></div>
        </div>
      </div>
    `).join("");
};
