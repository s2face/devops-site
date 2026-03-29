/**
 * Скрипт для страницы урока
 */

document.addEventListener('DOMContentLoaded', function() {
    // Генерация оглавления
    generateTableOfContents();

    // Отслеживание прогресса чтения
    trackReadingProgress();

    // Подсветка активного раздела в оглавлении
    highlightActiveSection();

    // Обработка кнопки "Отметить как пройденный"
    initCompleteButton();

    // Переключение боковой панели на мобильных
    initSidebarToggle();

    // Инициализация подсветки кода
    initCodeHighlighting();
});

/**
 * Генерация оглавления из заголовков статьи
 */
function generateTableOfContents() {
    const toc = document.getElementById('tableOfContents');
    const headings = document.querySelectorAll('#lessonContent h2, #lessonContent h3, #lessonContent h4');
    
    if (!toc || headings.length === 0) return;

    let html = '';
    headings.forEach((heading, index) => {
        // Добавляем id если нет
        if (!heading.id) {
            heading.id = `heading-${index}`;
        }
        
        const level = heading.tagName.toLowerCase();
        const indent = level === 'h3' ? 'ms-3' : level === 'h4' ? 'ms-4' : '';
        
        html += `
            <li class="${indent}">
                <a href="#${heading.id}" data-target="${heading.id}">${heading.textContent}</a>
            </li>
        `;
    });

    toc.innerHTML = html;

    // Плавная прокрутка к якорям
    toc.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Обновляем URL без прокрутки
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });
}

/**
 * Отслеживание прогресса чтения
 */
function trackReadingProgress() {
    const progressBar = document.getElementById('readingProgress');
    if (!progressBar) return;

    const updateProgress = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        
        progressBar.style.width = `${Math.min(progress, 100)}%`;
    };

    window.addEventListener('scroll', updateProgress);
    updateProgress();
}

/**
 * Подсветка активного раздела в оглавлении
 */
function highlightActiveSection() {
    const headings = document.querySelectorAll('#lessonContent h2, #lessonContent h3, #lessonContent h4');
    const tocLinks = document.querySelectorAll('#tableOfContents a');
    
    if (headings.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                tocLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-target') === id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-100px 0px -60% 0px',
        threshold: 0
    });

    headings.forEach(heading => observer.observe(heading));
}

/**
 * Инициализация кнопки "Отметить как пройденный"
 */
function initCompleteButton() {
    const button = document.getElementById('markComplete');
    if (!button) return;

    // Проверяем, был ли урок уже пройден
    const lessonPath = window.location.pathname;
    const lessonId = extractLessonId(lessonPath);
    
    if (UserProgress.isCompleted(lessonId)) {
        button.classList.add('completed');
        button.innerHTML = '<i class="bi bi-check-circle-fill"></i> Пройдено';
    }

    button.addEventListener('click', function() {
        const isCompleted = this.classList.toggle('completed');
        
        if (isCompleted) {
            this.innerHTML = '<i class="bi bi-check-circle-fill"></i> Пройдено';
            UserProgress.completeLesson(lessonId);
            
            // Показываем уведомление
            showNotification('Урок отмечен как пройденный! 🎉', 'success');
        } else {
            this.innerHTML = '<i class="bi bi-check-circle"></i> Отметить как пройденный';
        }
    });
}

/**
 * Извлечение ID урока из пути
 */
function extractLessonId(path) {
    const match = path.match(/lesson(\d+)/);
    return match ? parseInt(match[1]) : 0;
}

/**
 * Переключение боковой панели на мобильных
 */
function initSidebarToggle() {
    const toggleButton = document.getElementById('toggleSidebar');
    const sidebar = document.querySelector('.lesson-sidebar');
    
    if (!toggleButton || !sidebar) return;

    toggleButton.addEventListener('click', function() {
        sidebar.classList.toggle('show');
    });

    // Закрытие при клике вне панели
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            !sidebar.contains(e.target) && 
            !toggleButton.contains(e.target)) {
            sidebar.classList.remove('show');
        }
    });
}

/**
 * Инициализация подсветки кода
 */
function initCodeHighlighting() {
    if (typeof hljs !== 'undefined') {
        hljs.registerLanguage('bash', hljs.languages.bash);
        hljs.initHighlightingOnLoad();
    }
}

/**
 * Показ уведомления
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Автозакрытие через 3 секунды
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 150);
    }, 3000);
}

/**
 * Управление прогрессом пользователя
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
