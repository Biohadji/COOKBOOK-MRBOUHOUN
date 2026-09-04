// ===== app.js =====
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentCategory = 'all';
let currentChapter = 0;

// ===== Menu Functions =====
function openMenu() {
  document.getElementById('sideMenu').classList.add('active');
  document.getElementById('overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  document.getElementById('sideMenu').classList.remove('active');
  document.getElementById('overlay').classList.remove('active');
  document.body.style.overflow = '';
}

function menuNavigate(section) {
  closeMenu();
  setTimeout(() => {
    if (section === 'home') {
      currentCategory = 'all';
      currentChapter = 0;
      document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
      document.querySelector('.category-btn').classList.add('active');
      renderRecipes(recipes);
    } else if (section === 'favorites') {
      const favRecipes = recipes.filter(r => favorites.includes(r.id));
      renderRecipes(favRecipes);
    } else if (section === 'about') {
      renderAbout();
    }
  }, 300);
}

function menuChapter(chapter) {
  closeMenu();
  setTimeout(() => {
    currentChapter = chapter;
    currentCategory = 'all';
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    const filtered = recipes.filter(r => r.chapter === chapter);
    renderRecipes(filtered);
  }, 300);
}

function menuShare() {
  closeMenu();
  setTimeout(() => shareApp(), 300);
}

function menuInstall() {
  closeMenu();
  setTimeout(() => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then(result => {
        if (result.outcome === 'accepted') showToast('تم تثبيت التطبيق');
        deferredPrompt = null;
      });
    } else {
      showToast('استخدم خيار إضافة إلى الشاشة الرئيسية في المتصفح');
    }
  }, 300);
}

// ===== Navigation =====
function navSection(section) {
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  event.currentTarget.classList.add('active');
  if (section === 'home') {
    currentCategory = 'all';
    currentChapter = 0;
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    document.querySelector('.category-btn').classList.add('active');
    renderRecipes(recipes);
  } else if (section === 'chapters') {
    openMenu();
  } else if (section === 'favorites') {
    const favRecipes = recipes.filter(r => favorites.includes(r.id));
    renderRecipes(favRecipes);
  } else if (section === 'about') {
    renderAbout();
  }
}

// ===== Render Functions =====
function renderRecipes(recipesToRender) {
  const content = document.getElementById('mainContent');
  if (recipesToRender.length === 0) {
    content.innerHTML = '<div style="text-align:center;padding:40px;color:#999;"><div style="font-size:48px;margin-bottom:15px;">🔍</div>لا توجد نتائج</div>';
    return;
  }
  let lastChapter = 0;
  let html = '';
  recipesToRender.forEach(recipe => {
    if (recipe.chapter !== lastChapter) {
      lastChapter = recipe.chapter;
      html += `<div class="chapter-header"><span class="chapter-num">${recipe.chapter}</span><h2>${recipe.chapterTitle}</h2></div>`;
    }
    html += `
    <div class="recipe-card">
      <img src="${recipe.image}" class="recipe-image" alt="${recipe.title}" onclick="openModal('${recipe.image}')">
      <div class="recipe-content">
        <div class="recipe-header">
          <h3 class="recipe-title">${recipe.title}</h3>
          <span class="recipe-badge">${recipe.region}</span>
        </div>
        <div class="recipe-meta">
          <span class="meta-item">⏱ ${recipe.time}</span>
          <span class="meta-item">📊 ${recipe.difficulty}</span>
          <span class="meta-item">👥 ${recipe.persons}</span>
        </div>
        <p class="recipe-description">${recipe.description}</p>
        <div class="ingredients-section">
          <div class="section-title">المقادير</div>
          ${recipe.ingredients.map(ing => `
            <div class="ingredient-item">
              <span class="ingredient-name">${ing.name}</span>
              <span class="ingredient-amount">${ing.amount}</span>
            </div>
          `).join('')}
        </div>
        <div class="steps-section">
          <div class="section-title">طريقة التحضير</div>
          ${recipe.steps.map((step, i) => `
            <div class="step-item">
              <div class="step-number">${i + 1}</div>
              <div class="step-text">${step}</div>
            </div>
          `).join('')}
        </div>
        ${recipe.tip ? `<div class="tip-box"><strong>💡 نصيحة:</strong> ${recipe.tip}</div>` : ''}
        <div class="action-buttons">
          <button class="action-btn btn-favorite ${favorites.includes(recipe.id) ? 'active' : ''}" onclick="toggleFavorite(${recipe.id})">
            ${favorites.includes(recipe.id) ? '❤️ محفوظ' : '🤍 حفظ'}
          </button>
          <button class="action-btn btn-share" onclick="shareRecipe('${recipe.title}')">📤 مشاركة</button>
        </div>
      </div>
    </div>`;
  });
  content.innerHTML = html;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderAbout() {
  document.getElementById('mainContent').innerHTML = `
    <div class="recipe-card">
      <div class="recipe-content">
        <h3 class="recipe-title" style="text-align:center;margin-bottom:20px;">عن الكتاب</h3>
        <div style="text-align:center;margin:20px 0;">
          <div style="font-size:60px;">🍽</div>
          <h2 style="font-family:'Amiri',serif;color:var(--primary);margin:15px 0;">أطباق الولائم بلمسة أيام زمان</h2>
        </div>
        <div style="line-height:2.2;font-size:15px;">
          <p><strong>المؤلف:</strong> السيد بهون بن ح محمد أسماوي</p>
          <p><strong>الوصف:</strong> دليل شامل لأطباق الولائم الجزائرية التقليدية من جميع الولايات</p>
          <p><strong>المقادير:</strong> جميع المقادير محسوبة لـ 5 أشخاص (تقيميت)</p>
          <p><strong>الفصول:</strong> 8 فصول تشمل التوابل والكسكسي والطاجين واللحوم والشوربات والسلط والحلويات والمشروبات</p>
          <p><strong>عدد الأطباق:</strong> 21 وصفة تقليدية</p>
        </div>
      </div>
    </div>
  `;
}

function filterRecipes() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();
  let filtered = recipes;
  if (currentCategory !== 'all') {
    filtered = filtered.filter(r => r.category === currentCategory);
  }
  if (searchTerm) {
    filtered = filtered.filter(r =>
      r.title.includes(searchTerm) ||
      r.description.includes(searchTerm) ||
      r.ingredients.some(i => i.name.includes(searchTerm))
    );
  }
  renderRecipes(filtered);
}

function filterByCategory(category) {
  currentCategory = category;
  currentChapter = 0;
  document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
  event.currentTarget.classList.add('active');
  filterRecipes();
}

// ===== Favorites =====
function toggleFavorite(id) {
  if (favorites.includes(id)) {
    favorites = favorites.filter(f => f !== id);
    showToast('تم الإزالة من المفضلة');
  } else {
    favorites.push(id);
    showToast('تمت الإضافة إلى المفضلة');
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  filterRecipes();
}

// ===== Share =====
function shareRecipe(title) {
  if (navigator.share) {
    navigator.share({
      title: title,
      text: `وصفة ${title} - أطباق الولائم بلمسة أيام زمان`,
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(`وصفة ${title} - أطباق الولائم بلمسة أيام زمان`);
    showToast('تم نسخ الرابط');
  }
}

function shareApp() {
  if (navigator.share) {
    navigator.share({
      title: 'أطباق الولائم بلمسة أيام زمان',
      text: 'تطبيق شامل لأطباق الولائم الجزائرية التقليدية - 21 وصفة تقليدية',
      url: window.location.href
    });
  } else {
    navigator.clipboard.writeText(window.location.href);
    showToast('تم نسخ رابط التطبيق');
  }
}

// ===== Modal =====
function openModal(src) {
  document.getElementById('modalImage').src = src;
  document.getElementById('imageModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('imageModal').classList.remove('active');
  document.body.style.overflow = '';
}

// ===== Toast =====
function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// ===== Install Banner =====
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  document.getElementById('installBanner').classList.add('active');
});

function closeInstallBanner() {
  document.getElementById('installBanner').classList.remove('active');
}

// ===== Service Worker =====
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

// ===== Initialize =====
renderRecipes(recipes);