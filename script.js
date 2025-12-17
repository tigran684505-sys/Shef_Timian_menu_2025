document.addEventListener('DOMContentLoaded', function() {
    // ==================== СОЗДАНИЕ КАРТОЧЕК ДЛЯ МОБИЛЬНОЙ ВЕРСИИ ====================
    createMobileCards();
    
    // ==================== КНОПКИ СОСТАВА В ТАБЛИЦЕ (ПК ВЕРСИЯ) ====================
    initTableButtons();
    
    // ==================== КНОПКИ СОСТАВА В КАРТОЧКАХ (МОБИЛЬНАЯ ВЕРСИЯ) ====================
    initCardButtons();
    
    // ==================== АДАПТАЦИЯ ПРИ ИЗМЕНЕНИИ РАЗМЕРА ОКНА ====================
    initResponsiveBehavior();
    
    // ==================== ПЛАВНЫЕ АНИМАЦИИ ====================
    initAnimations();
});

function createMobileCards() {
    const menuTables = document.querySelectorAll('.menu-table');
    
    menuTables.forEach(table => {
        const tableId = table.id || 'table-' + Math.random().toString(36).substr(2, 9);
        const container = table.parentElement;
        
        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'menu-cards-container';
        cardsContainer.id = 'cards-' + tableId;
        
        // Находим все строки внутри таблицы (и заголовки, и обычные строки)
        const rows = table.querySelectorAll('.table-row, .group-header-tab');
        let currentGroup = '';
        let cardIndex = 0;
        
        rows.forEach((row, index) => {
            // Проверяем, является ли строка групповым заголовком
            if (row.classList.contains('group-header-tab')) {
                currentGroup = row.querySelector('.col-name strong')?.textContent || 
                              row.querySelector('.col-name')?.textContent || '';
                
                // Создаем заголовок группы для карточек
                if (currentGroup) {
                    const groupCardHeader = document.createElement('div');
                    groupCardHeader.className = 'group-header-card fade-in';
                    groupCardHeader.innerHTML = `
                        <div class="group-title">
                            <i class="fas fa-drumstick-bite"></i>
                            ${currentGroup}
                        </div>
                    `;
                    cardsContainer.appendChild(groupCardHeader);
                }
                
                return; // Пропускаем создание карточки для заголовка
            }
            
            // Если это обычная строка с блюдом
            if (row.classList.contains('table-row')) {
                const name = row.querySelector('.col-name')?.textContent || '';
                const weightText = row.querySelector('.col-weight')?.textContent || '';
                const priceText = row.querySelector('.col-price')?.textContent || '';
                const descBtn = row.querySelector('.desc-btn');
                const descriptionRow = descBtn ? document.getElementById(descBtn.getAttribute('data-target')) : null;
                const description = descriptionRow ? descriptionRow.querySelector('.description-content p')?.innerHTML : '';
                
                // Извлекаем только числа для веса и цены
                const weightMatch = weightText.match(/[\d,.]+/);
                const priceMatch = priceText.match(/[\d,.]+/);
                
                const weight = weightMatch ? weightMatch[0] : '';
                const price = priceMatch ? priceMatch[0] : '';
                
                const card = document.createElement('div');
                card.className = 'menu-card fade-in';
                card.style.animationDelay = (cardIndex * 0.1) + 's';
                card.dataset.tableRow = index;
                card.dataset.group = currentGroup; // Добавляем информацию о группе
                
                card.innerHTML = `
                    ${currentGroup ? `<div class="card-group-badge">${currentGroup}</div>` : ''}
                    <div class="card-header">
                        <div class="card-name">${name}</div>
                        <div class="card-details">
                            <div class="card-weight">
                                <span class="card-label">Выход:</span>
                                <span class="card-value">${weight} г</span>
                            </div>
                            <div class="card-price">
                                <span class="card-label">Цена:</span>
                                <span class="card-value">${price} ₽</span>
                            </div>
                        </div>
                    </div>
                    <div class="card-content">
                        <button class="card-desc-btn" data-card-index="${cardIndex}">
                            <i class="fas fa-info-circle"></i>
                            <span>Состав</span>
                        </button>
                        <div class="card-description" id="card-desc-${tableId}-${cardIndex}">
                            <div class="card-description-content">
                                ${description || '<p>Состав не указан</p>'}
                            </div>
                        </div>
                    </div>
                `;
                
                cardsContainer.appendChild(card);
                cardIndex++;
            }
        });
        
        table.insertAdjacentElement('afterend', cardsContainer);
        cardsContainer.style.display = 'none';
    });
}

function initTableButtons() {
    const descButtons = document.querySelectorAll('.desc-btn');
    
    descButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const descriptionRow = document.getElementById(targetId);
            
            document.querySelectorAll('.description-row.active').forEach(row => {
                if (row.id !== targetId) {
                    row.classList.remove('active');
                    const btn = row.previousElementSibling.querySelector('.desc-btn');
                    if (btn) {
                        btn.classList.remove('active');
                        btn.innerHTML = '<i class="fas fa-info"></i>';
                    }
                }
            });
            
            if (descriptionRow) {
                descriptionRow.classList.toggle('active');
                this.classList.toggle('active');
                
                if (this.classList.contains('active')) {
                    this.innerHTML = '<i class="fas fa-times"></i>';
                } else {
                    this.innerHTML = '<i class="fas fa-info"></i>';
                }
            }
        });
    });
}

function initCardButtons() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.card-desc-btn')) {
            const button = e.target.closest('.card-desc-btn');
            const card = button.closest('.menu-card');
            const description = card.querySelector('.card-description');
            
            const allCards = document.querySelectorAll('.menu-card');
            allCards.forEach(otherCard => {
                if (otherCard !== card) {
                    const otherDesc = otherCard.querySelector('.card-description');
                    const otherBtn = otherCard.querySelector('.card-desc-btn');
                    if (otherDesc && otherDesc.classList.contains('active')) {
                        otherDesc.classList.remove('active');
                        if (otherBtn) {
                            otherBtn.classList.remove('active');
                            otherBtn.innerHTML = '<i class="fas fa-info-circle"></i><span>Состав</span>';
                        }
                    }
                }
            });
            
            description.classList.toggle('active');
            button.classList.toggle('active');
            
            if (button.classList.contains('active')) {
                button.innerHTML = '<i class="fas fa-times"></i><span>Скрыть состав</span>';
            } else {
                button.innerHTML = '<i class="fas fa-info-circle"></i><span>Состав</span>';
            }
        }
    });
}

function initResponsiveBehavior() {
    function toggleView() {
        const isMobile = window.innerWidth <= 768;
        const tables = document.querySelectorAll('.menu-table');
        const cardsContainers = document.querySelectorAll('.menu-cards-container');
        
        if (isMobile) {
            tables.forEach(table => table.style.display = 'none');
            cardsContainers.forEach(container => container.style.display = 'block');
        } else {
            tables.forEach(table => table.style.display = 'block');
            cardsContainers.forEach(container => container.style.display = 'none');
        }
    }
    
    toggleView();
    window.addEventListener('resize', toggleView);
}

function initAnimations() {
    const cards = document.querySelectorAll('.card, .category-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.menu-card').forEach(card => {
        observer.observe(card);
    });
}