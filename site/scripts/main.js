/**
 * DevOps Lessons — Основной JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Плавная прокрутка к якорям
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // Анимация прогресс-круга при загрузке
    animateProgressCircles();

    // Подсветка активных ссылок в навигации
    highlightActiveNav();

    // Анимация появления элементов при скролле
    initScrollAnimations();

    // Поиск по урокам (если есть на странице)
    initLessonSearch();

    // Тултипы Bootstrap
    initTooltips();
});

/**
 * Анимация прогресс-кругов
 */
function animateProgressCircles() {
    const progressCircles = document.querySelectorAll('.progress-circle');
    
    progressCircles.forEach(circle => {
        const progressBar = circle.querySelector('.progress-bar');
        const progressValue = circle.querySelector('.progress-value');
        
        if (progressBar && progressValue) {
            const percentage = parseInt(progressValue.textContent);
            const circumference = 2 * Math.PI * 45; // радиус 45
            const offset = circumference - (percentage / 100) * circumference;
            
            // Небольшая задержка для анимации
            setTimeout(() => {
                progressBar.style.strokeDashoffset = offset;
            }, 300);
        }
    });
}

/**
 * Подсветка активной ссылки в навигации
 */
function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || 
            (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

/**
 * Инициализация анимаций при скролле
 */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                entry.target.style.opacity = '1';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Наблюдаем за карточками уроков - НЕ трогаем кнопки в hero
    const cards = document.querySelectorAll('.lesson-card, .feature-card, .level-card');
    cards.forEach(card => {
        // Проверяем, что это не кнопка и не внутри hero-секции
        if (!card.closest('.hero-section')) {
            card.style.opacity = '0';
            observer.observe(card);
        }
    });
}

/**
 * Инициализация поиска по урокам
 */
function initLessonSearch() {
    const searchInput = document.getElementById('lessonSearch');
    if (!searchInput) return;

    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase();
        const lessonCards = document.querySelectorAll('.lesson-card');

        lessonCards.forEach(card => {
            const title = card.querySelector('.card-title');
            const text = card.querySelector('.card-text');
            
            if (title && text) {
                const titleText = title.textContent.toLowerCase();
                const textContent = text.textContent.toLowerCase();
                
                if (titleText.includes(searchTerm) || textContent.includes(searchTerm)) {
                    card.style.display = '';
                } else {
                    card.style.display = 'none';
                }
            }
        });
    });
}

/**
 * Инициализация тултипов Bootstrap
 */
function initTooltips() {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach(tooltipTriggerEl => {
        new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

/**
 * Функция для подсветки зависимых уроков
 */
function highlightDependencies(lessonNumber) {
    // Удаляем предыдущие подсветки
    document.querySelectorAll('.lesson-card.highlighted').forEach(card => {
        card.classList.remove('highlighted');
    });

    // Подсвечиваем выбранный урок
    const lessonCard = document.getElementById(`lesson${String(lessonNumber).padStart(2, '0')}`);
    if (lessonCard) {
        lessonCard.classList.add('highlighted');
        lessonCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

/**
 * Экспорт функции для использования из HTML
 */
window.highlightDependencies = highlightDependencies;

/**
 * Функция для отображения модального окна с информацией об уроке
 */
function showLessonInfo(lessonNumber, title, description, prerequisites) {
    const modalHtml = `
        <div class="modal fade" id="lessonInfoModal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Урок ${lessonNumber}: ${title}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p>${description}</p>
                        <h6>Пререквизиты:</h6>
                        <ul>${prerequisites.map(prereq => `<li>${prereq}</li>`).join('')}</ul>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                        <a href="lessons/level1/lesson${String(lessonNumber).padStart(2, '0')}/ARTICLE.md" class="btn btn-primary">Открыть урок</a>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Удаляем старое модальное окно если есть
    document.querySelectorAll('#lessonInfoModal').forEach(modal => modal.remove());

    // Добавляем новое модальное окно
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    // Показываем модальное окно
    const modal = new bootstrap.Modal(document.getElementById('lessonInfoModal'));
    modal.show();

    // Удаляем модальное окно после закрытия
    document.getElementById('lessonInfoModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

window.showLessonInfo = showLessonInfo;

/**
 * Сохранение прогресса пользователя в localStorage
 */
const UserProgress = {
    key: 'devops_lessons_progress',
    
    get() {
        const data = localStorage.getItem(this.key);
        return data ? JSON.parse(data) : { completedLessons: [], currentLesson: 1 };
    },
    
    save(data) {
        localStorage.setItem(this.key, JSON.stringify(data));
    },
    
    completeLesson(lessonNumber) {
        const progress = this.get();
        if (!progress.completedLessons.includes(lessonNumber)) {
            progress.completedLessons.push(lessonNumber);
            this.save(progress);
        }
    },
    
    isCompleted(lessonNumber) {
        const progress = this.get();
        return progress.completedLessons.includes(lessonNumber);
    }
};

window.UserProgress = UserProgress;

/**
 * Консольное приветствие для разработчиков
 */
console.log('%c🚀 DevOps Lessons', 'font-size: 24px; font-weight: bold; color: #0d6efd;');
console.log('%cДобро пожаловать в мир DevOps!', 'font-size: 14px; color: #6c757d;');
console.log('%cИзучай Linux, Git, Docker, CI/CD и стань профессионалом!', 'font-size: 12px; color: #198754;');
