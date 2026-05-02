// ===== KATEGORILER (TÜRKÇE) =====
const CATEGORIES = {
    'Aksiyon': 'Aksiyon',
    'RPG': 'RPG',
    'Strateji': 'Strateji',
    'Simulasyon': 'Simulasyon',
    'Macera': 'Macera',
    'Spor': 'Spor',
    'Bulmaca': 'Bulmaca',
    'Şarkı': 'Şarkı'
};

// ===== KOD GÖMÜLÜ HEŞ VE ŞIFRE =====
const adminCreds = {
    user: 'agaoglumustafa',
    pass: '230312'
};

// Oyun Veri Bankası
let games = JSON.parse(localStorage.getItem('pureplay_games')) || [
    {
        id: 'omsi2',
        title: 'OMSI 2: Steam Edition',
        category: 'Simulasyon',
        img: 'https://steamrip.com/wp-content/uploads/2021/08/omsi-2-free-download-preinstalled-steamrip.jpg',
        desc: 'Dünya çapında ünlü otobüs simülatörü OMSI 2, gerçekçi şehir safarileri ve yönetim görevleri sunar. Yüzlerce mod desteğiyle sonsuz oynanış.',
        link: 'https://steamrip.com/omsi-2-steam-edition-free-download-k1/',
        downloads: '1,248',
        size: '2.5 GB'
    },
    {
        id: 'cyberpunk2077',
        title: 'Cyberpunk 2077',
        category: 'Aksiyon',
        img: 'https://steamrip.com/wp-content/uploads/2020/12/cyberpunk-2077-free-download-steamrip.jpg',
        desc: 'CD Projekt Red tarafından geliştirilen Cyberpunk 2077, distopik Night City\'de gerçekleşen epik bir RPG. V\'nin hikayesini yaşayın, işler kötüye gittiğinde.',
        link: 'https://steamrip.com/',
        downloads: '5,842',
        size: '150 GB'
    },
    {
        id: 'rimworld',
        title: 'RimWorld',
        category: 'Strateji',
        img: 'https://steamrip.com/wp-content/uploads/2018/10/rimworld-free-download-steamrip.jpg',
        desc: 'Hayalperest kolonistlerin bir grup uzak gezegene indiğini hayal edin. RimWorld ile kurmaca etkinliklerin ve gelişen hikayelerin ortasında kalacaksınız.',
        link: 'https://steamrip.com/',
        downloads: '3,456',
        size: '500 MB'
    },
    {
        id: 'elden',
        title: 'ELDEN RING',
        category: 'Aksiyon',
        img: 'https://steamrip.com/wp-content/uploads/2022/02/elden-ring-free-download-steamrip.jpg',
        desc: 'FromSoftware ve George R. R. Martin işbirliği. Açık dünya action RPG oyunun yeni standardını belirliyor. Düşmanları mağlup edin, sanatı keşfedin.',
        link: 'https://steamrip.com/',
        downloads: '8,234',
        size: '60 GB'
    },
    {
        id: 'baldurs3',
        title: "Baldur's Gate 3",
        category: 'RPG',
        img: 'https://steamrip.com/wp-content/uploads/2023/08/baldurs-gate-3-free-download-steamrip.jpg',
        desc: 'Larian Studios\'un başyapıtı. D&D 5e kurallarına sadık kalarak, sonsuz oylanış olanaklarıyla tatmin edici bir RPG.',
        link: 'https://steamrip.com/',
        downloads: '7,123',
        size: '150 GB'
    }
];

// ===== PAGE COMPONENTS =====
const createHeader = () => {
    return `
        <header>
            <div class="header-content">
                <a href="#" class="logo" onclick="navigateTo('home'); return false;">PUREPLAY</a>
                <div class="nav-menu">
                    <a href="#" onclick="navigateTo('home'); return false;" class="active">Anasayfa</a>
                    <a href="#" onclick="filterGames('Tümü'); return false;">Tüm Oyunlar</a>
                    <input type="text" class="search-box" id="searchBox" placeholder="Oyun ara..." onkeyup="searchGames()">
                </div>
            </div>
        </header>
    `;
};

const createBanner = () => {
    const total = games.length;
    const totalSize = games.reduce((sum, game) => {
        const size = parseInt(game.size);
        return sum + (isNaN(size) ? 0 : size);
    }, 0);

    return `
        <div class="banner">
            <h1>🎮 PUREPLAY - Crackli Oyun Kütüphanesi</h1>
            <p>En popüler ve güncel oyunlara tek tıkla erişin. Saf performans, kesintisiz eğlence!</p>
            <div class="banner-stats">
                <div class="stat">
                    <div class="stat-number">${total}</div>
                    <div class="stat-label">Oyun</div>
                </div>
                <div class="stat">
                    <div class="stat-number">${Object.keys(CATEGORIES).length}</div>
                    <div class="stat-label">Kategori</div>
                </div>
                <div class="stat">
                    <div class="stat-number">∞</div>
                    <div class="stat-label">Mod Desteği</div>
                </div>
            </div>
        </div>
    `;
};

const createFilters = () => {
    const categories = ['Tümü', ...Object.keys(CATEGORIES)];
    return `
        <div class="filters">
            <div class="filter-buttons">
                ${categories.map(cat => `
                    <button class="filter-btn ${cat === 'Tümü' ? 'active' : ''}" onclick="filterGames('${cat}')">${cat}</button>
                `).join('')}
            </div>
        </div>
    `;
};

const createGamesList = (filter = 'Tümü', searchTerm = '') => {
    let filtered = games;
    
    if (filter !== 'Tümü') {
        filtered = filtered.filter(g => g.category === filter);
    }
    
    if (searchTerm) {
        filtered = filtered.filter(g => 
            g.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    if (filtered.length === 0) {
        return `
            <div class="container">
                <div class="no-results">
                    <p>😔 Oyun bulunamadı. Lütfen başka bir arama yapın.</p>
                </div>
            </div>
        `;
    }
    
    return `
        <div class="container">
            ${filtered.map(game => `
                <div class="game-card" onclick="showDetails('${game.id}')">
                    <div class="game-img-container">
                        <img src="${game.img}" class="game-img" alt="${game.title}">
                        <div class="game-badge">${game.category}</div>
                    </div>
                    <div class="game-info">
                        <div class="game-category">${game.category}</div>
                        <h3>${game.title}</h3>
                        <div class="game-download-count">⬇️ ${game.downloads} İndirme</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
};

const createDetailsPage = (gameId) => {
    const game = games.find(g => g.id === gameId);
    if (!game) return '';

    return `
        <div id="details-page">
            <a href="#" class="back-btn" onclick="navigateTo('home'); return false;">← Geri Dön</a>
            <div class="details-container">
                <div>
                    <img src="${game.img}" class="details-img" alt="${game.title}">
                </div>
                <div class="details-content">
                    <h1>${game.title}</h1>
                    <div class="details-category">${game.category}</div>
                    <p class="details-desc">${game.desc}</p>
                    
                    <div class="download-box">
                        <h3>📥 İndirme Bilgileri</h3>
                        <div class="download-stat">
                            <span>Toplam İndirme:</span>
                            <span>${game.downloads}</span>
                        </div>
                        <div class="download-stat">
                            <span>Dosya Boyutu:</span>
                            <span>${game.size}</span>
                        </div>
                        <a href="${game.link}" target="_blank" class="main-dl-btn">🎮 OYUNU İNDİR</a>
                    </div>
                </div>
            </div>
        </div>
    `;
};

const createAdminPanel = () => {
    return `
        <div id="admin-page">
            <h2 class="admin-header">⚙️ Admin Paneli - Oyun Yönetimi</h2>
            
            <div class="admin-container">
                <div class="admin-list">
                    <h3>Mevcut Oyunlar</h3>
                    <div class="admin-list-scroll">
                        ${games.map(game => `
                            <div class="game-item">
                                <div class="game-item-info">
                                    <h4>${game.title}</h4>
                                    <p>📂 ${game.category} | 📥 ${game.downloads} | 💾 ${game.size}</p>
                                </div>
                                <div class="game-item-actions">
                                    <button class="btn-edit" onclick="editGame('${game.id}')">Düzenle</button>
                                    <button class="btn-delete" onclick="deleteGame('${game.id}')">Sil</button>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="admin-form">
                    <h3 id="form-title">Yeni Oyun Ekle</h3>
                    <form id="gameForm" onsubmit="handleFormSubmit(event)">
                        <input type="hidden" id="editingId">
                        
                        <div class="form-group">
                            <label>Oyun Adı *</label>
                            <input type="text" id="gameTitle" required>
                        </div>

                        <div class="form-group">
                            <label>Kategori *</label>
                            <select id="gameCategory" required>
                                <option value="">Seç...</option>
                                ${Object.keys(CATEGORIES).map(cat => `
                                    <option value="${cat}">${cat}</option>
                                `).join('')}
                            </select>
                        </div>

                        <div class="form-group">
                            <label>Resim URL'si (steamgriddb.com) *</label>
                            <input type="url" id="gameImg" required placeholder="https://...">
                        </div>

                        <div class="form-group">
                            <label>Açıklama *</label>
                            <textarea id="gameDesc" required></textarea>
                        </div>

                        <div class="form-group">
                            <label>İndirme Bağlantısı *</label>
                            <input type="url" id="gameLink" required placeholder="https://...">
                        </div>

                        <div class="form-group">
                            <label>İndirme Sayısı (örn: 1,248) *</label>
                            <input type="text" id="gameDownloads" required>
                        </div>

                        <div class="form-group">
                            <label>Dosya Boyutu (örn: 2.5 GB) *</label>
                            <input type="text" id="gameSize" required>
                        </div>

                        <button type="submit" class="btn-submit" id="submitBtn">Oyun Ekle</button>
                        <button type="button" class="btn-submit" id="cancelBtn" style="background: #666; display: none; margin-top: 10px;" onclick="resetForm()">İptal Et</button>
                    </form>

                    <button class="btn-logout" onclick="handleLogout()">Çıkış Yap</button>
                </div>
            </div>
        </div>
    `;
};

const createLoginPage = () => {
    return `
        <div id="login-page">
            <div class="login-box">
                <h2>⚙️ Admin Paneli</h2>
                <form class="login-form" onsubmit="handleLogin(event)">
                    <input type="text" id="adminUser" placeholder="Kullanıcı Adı" required>
                    <input type="password" id="adminPass" placeholder="Şifre" required>
                    <button type="submit">Giriş Yap</button>
                </form>
                <div class="login-error" id="loginError">❌ Kullanıcı adı veya şifre hatalı!</div>
            </div>
        </div>
    `;
};

const createFooter = () => {
    return `
        <footer>
            <p>&copy; 2026 PurePlay - Oyun Kütüphanesi. Tüm hakları saklıdır.</p>
            <p>Sorumlu: <strong>agaoglumustafa</strong> | Crackli Oyunlar İçin Güvenilir Kaynak</p>
        </footer>
    `;
};

// ===== NAVIGATION =====
function navigateTo(page, gameId = null) {
    const app = document.getElementById('app');
    
    if (page === 'home') {
        app.innerHTML = `
            ${createHeader()}
            ${createBanner()}
            ${createFilters()}
            ${createGamesList()}
            ${createFooter()}
        `;
        document.getElementById('searchBox').focus();
    } else if (page === 'details' && gameId) {
        app.innerHTML = `
            ${createHeader()}
            ${createDetailsPage(gameId)}
            ${createFooter()}
        `;
        window.scrollTo(0, 0);
    } else if (page === 'login') {
        app.innerHTML = `
            ${createHeader()}
            ${createLoginPage()}
            ${createFooter()}
        `;
    } else if (page === 'admin') {
        app.innerHTML = `
            ${createHeader()}
            ${createAdminPanel()}
            ${createFooter()}
        `;
    }
}

// ===== ADMIN FUNCTIONS =====
function handleLogin(event) {
    event.preventDefault();
    const user = document.getElementById('adminUser').value;
    const pass = document.getElementById('adminPass').value;

    if (user === adminCreds.user && pass === adminCreds.pass) {
        localStorage.setItem('pureplay_admin_logged', 'true');
        document.getElementById('loginError').style.display = 'none';
        navigateTo('admin');
    } else {
        document.getElementById('loginError').style.display = 'block';
    }
}

function editGame(id) {
    const game = games.find(g => g.id === id);
    if (!game) return;

    document.getElementById('editingId').value = id;
    document.getElementById('gameTitle').value = game.title;
    document.getElementById('gameCategory').value = game.category;
    document.getElementById('gameImg').value = game.img;
    document.getElementById('gameDesc').value = game.desc;
    document.getElementById('gameLink').value = game.link;
    document.getElementById('gameDownloads').value = game.downloads;
    document.getElementById('gameSize').value = game.size;

    document.getElementById('form-title').textContent = 'Oyun Düzenle';
    document.getElementById('submitBtn').textContent = 'Değişiklikleri Kaydet';
    document.getElementById('cancelBtn').style.display = 'block';
    
    document.querySelector('.admin-form').scrollIntoView({ behavior: 'smooth' });
}

function resetForm() {
    document.getElementById('gameForm').reset();
    document.getElementById('editingId').value = '';
    document.getElementById('form-title').textContent = 'Yeni Oyun Ekle';
    document.getElementById('submitBtn').textContent = 'Oyun Ekle';
    document.getElementById('cancelBtn').style.display = 'none';
}

function handleFormSubmit(event) {
    event.preventDefault();

    const editingId = document.getElementById('editingId').value;
    const newGame = {
        id: editingId || 'game_' + Date.now(),
        title: document.getElementById('gameTitle').value,
        category: document.getElementById('gameCategory').value,
        img: document.getElementById('gameImg').value,
        desc: document.getElementById('gameDesc').value,
        link: document.getElementById('gameLink').value,
        downloads: document.getElementById('gameDownloads').value,
        size: document.getElementById('gameSize').value
    };

    if (editingId) {
        const index = games.findIndex(g => g.id === editingId);
        games[index] = newGame;
        alert('✅ Oyun başarıyla güncellendi!');
    } else {
        games.push(newGame);
        alert('✅ Yeni oyun başarıyla eklendi!');
    }

    localStorage.setItem('pureplay_games', JSON.stringify(games));
    resetForm();
    navigateTo('admin');
}

function deleteGame(id) {
    if (confirm(`Bu oyunu silmek istediğinizden emin misiniz?`)) {
        games = games.filter(g => g.id !== id);
        localStorage.setItem('pureplay_games', JSON.stringify(games));
        alert('✅ Oyun başarıyla silindi!');
        navigateTo('admin');
    }
}

function handleLogout() {
    localStorage.removeItem('pureplay_admin_logged');
    window.location.hash = '';
    navigateTo('home');
}

// ===== GAME FUNCTIONS =====
function showDetails(id) {
    navigateTo('details', id);
}

function filterGames(cat) {
    const searchTerm = document.getElementById('searchBox')?.value || '';
    const container = document.querySelector('.container');
    container.innerHTML = createGamesList(cat, searchTerm).match(/<div class="container">([\s\S]*?)<\/div>/)[1];
    
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
}

function searchGames() {
    const searchTerm = document.getElementById('searchBox')?.value || '';
    filterGames('Tümü');
}

// ===== HASH LISTENER =====
window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    
    if (hash === 'agaogluadmin') {
        if (localStorage.getItem('pureplay_admin_logged')) {
            navigateTo('admin');
        } else {
            navigateTo('login');
        }
    } else {
        navigateTo('home');
    }
});

// ===== INITIAL LOAD =====
window.addEventListener('load', function() {
    const hash = window.location.hash.substring(1);
    
    if (hash === 'agaogluadmin') {
        if (localStorage.getItem('pureplay_admin_logged')) {
            navigateTo('admin');
        } else {
            navigateTo('login');
        }
    } else {
        navigateTo('home');
    }
});