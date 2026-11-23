
document.addEventListener('DOMContentLoaded', function () {
    createMobileCards();
    initTableButtons();
    initCardButtons();
    initResponsiveBehavior();
    initAnimations();
});

// ==================================================
// СОЗДАНИЕ КАРТОЧЕК ДЛЯ МОБИЛЬНОЙ ВЕРСИИ
// ==================================================

function createMobileCards() {
    const menuTables = document.querySelectorAll('.menu-table');

    menuTables.forEach((table, tableIndex) => {
        // Не создаём карточки повторно
        if (table.nextElementSibling?.classList.contains('menu-cards-container')) {
            return;
        }

        const tableId = table.id || `menu-table-${tableIndex}`;

        if (!table.id) {
            table.id = tableId;
        }

        const cardsContainer = document.createElement('div');
        cardsContainer.className = 'menu-cards-container';
        cardsContainer.id = `cards-${tableId}`;

        const rows = table.querySelectorAll('.table-row, .group-header-tab');

        let currentGroup = '';
        let cardIndex = 0;

        rows.forEach((row, index) => {
            // Заголовок группы
            if (row.classList.contains('group-header-tab')) {
                const groupElement =
                    row.querySelector('.col-name strong') ||
                    row.querySelector('.col-name');

                currentGroup = groupElement
                    ? groupElement.textContent.trim()
                    : '';

                if (currentGroup) {
                    const header = document.createElement('div');
                    header.className = 'group-header-card fade-in';

                    const title = document.createElement('div');
                    title.className = 'group-title';
                    title.innerHTML = '<i class="fas fa-drumstick-bite"></i>';

                    const groupName = document.createElement('span');
                    groupName.textContent = currentGroup;

                    title.appendChild(groupName);
                    header.appendChild(title);
                    cardsContainer.appendChild(header);
                }

                return;
            }

            // Обычная строка с блюдом
            if (!row.classList.contains('table-row')) {
                return;
            }

            const name = row.querySelector('.col-name')?.textContent.trim() || '';
            const weightText = row.querySelector('.col-weight')?.textContent.trim() || '';
            const priceText = row.querySelector('.col-price')?.textContent.trim() || '';

            const descButton = row.querySelector('.desc-btn');
            const targetId = descButton?.getAttribute('data-target');
            const descriptionRow = targetId
                ? document.getElementById(targetId)
                : null;

            const descriptionContent = descriptionRow?.querySelector('.description-content');

            const weightMatch = weightText.match(/[\d,.]+/);
            const priceMatch = priceText.match(/[\d,.]+/);

            const weight = weightMatch ? weightMatch[0] : weightText;
            const price = priceMatch ? priceMatch[0] : priceText;

            const card = document.createElement('div');
            card.className = 'menu-card fade-in';
            card.style.animationDelay = `${cardIndex * 0.05}s`;
            card.dataset.tableRow = index;

            if (currentGroup) {
                card.dataset.group = currentGroup;

                const badge = document.createElement('div');
                badge.className = 'card-group-badge';
                badge.textContent = currentGroup;
                card.appendChild(badge);
            }

            const header = document.createElement('div');
            header.className = 'card-header';

            const cardName = document.createElement('div');
            cardName.className = 'card-name';
            cardName.textContent = name;

            const details = document.createElement('div');
            details.className = 'card-details';

            const weightBlock = document.createElement('div');
            weightBlock.className = 'card-weight';
            weightBlock.innerHTML = `
                <span class="card-label">Выход:</span>
                <span class="card-value">${weight}${weightMatch ? ' г' : ''}</span>
            `;

            const priceBlock = document.createElement('div');
            priceBlock.className = 'card-price';
            priceBlock.innerHTML = `
                <span class="card-label">Цена:</span>
                <span class="card-value">${price}${priceMatch ? ' ₽' : ''}</span>
            `;

            details.appendChild(weightBlock);
            details.appendChild(priceBlock);

            header.appendChild(cardName);
            header.appendChild(details);

            const content = document.createElement('div');
            content.className = 'card-content';

            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'card-desc-btn';
            button.dataset.cardIndex = cardIndex;
            button.innerHTML = '<i class="fas fa-info-circle"></i><span>Состав</span>';

            const description = document.createElement('div');
            description.className = 'card-description';
            description.id = `card-desc-${tableId}-${cardIndex}`;

            const descriptionInner = document.createElement('div');
            descriptionInner.className = 'card-description-content';

            if (descriptionContent) {
                descriptionInner.appendChild(descriptionContent.cloneNode(true));
            } else {
                const paragraph = document.createElement('p');
                paragraph.textContent = 'Состав не указан';
                descriptionInner.appendChild(paragraph);
            }

            description.appendChild(descriptionInner);
            content.appendChild(button);
            content.appendChild(description);

            card.appendChild(header);
            card.appendChild(content);

            cardsContainer.appendChild(card);
            cardIndex++;
        });

        table.insertAdjacentElement('afterend', cardsContainer);
    });
}

// ==================================================
// КНОПКИ СОСТАВА В ТАБЛИЦЕ
// ==================================================

function initTableButtons() {
    document.addEventListener('click', function (event) {
        const button = event.target.closest('.desc-btn');

        if (!button) return;

        event.preventDefault();

        const targetId = button.getAttribute('data-target');
        const descriptionRow = targetId
            ? document.getElementById(targetId)
            : null;

        if (!descriptionRow) return;

        const wasActive = descriptionRow.classList.contains('active');

        // Закрываем остальные открытые описания
        document.querySelectorAll('.description-row.active').forEach(row => {
            row.classList.remove('active');

            const relatedButton = document.querySelector(
                `.desc-btn[data-target="${row.id}"]`
            );

            if (relatedButton) {
                relatedButton.classList.remove('active');
                relatedButton.innerHTML = '<i class="fas fa-info"></i>';
            }
        });

        // Открываем выбранное описание
        if (!wasActive) {
            descriptionRow.classList.add('active');
            button.classList.add('active');
            button.innerHTML = '<i class="fas fa-times"></i>';
        }
    });
}

// ==================================================
// КНОПКИ СОСТАВА В МОБИЛЬНЫХ КАРТОЧКАХ
// ==================================================

function initCardButtons() {
    document.addEventListener('click', function (event) {
        const button = event.target.closest('.card-desc-btn');

        if (!button) return;

        event.preventDefault();

        const card = button.closest('.menu-card');

        if (!card) return;

        const description = card.querySelector('.card-description');

        if (!description) return;

        const wasActive = description.classList.contains('active');

        // Закрываем остальные карточки
        document.querySelectorAll('.menu-card').forEach(otherCard => {
            if (otherCard === card) return;

            const otherDescription = otherCard.querySelector('.card-description');
            const otherButton = otherCard.querySelector('.card-desc-btn');

            if (otherDescription) {
                otherDescription.classList.remove('active');
            }

            if (otherButton) {
                otherButton.classList.remove('active');
                otherButton.innerHTML =
                    '<i class="fas fa-info-circle"></i><span>Состав</span>';
            }
        });

        // Переключаем выбранную карточку
        description.classList.toggle('active', !wasActive);
        button.classList.toggle('active', !wasActive);

        button.innerHTML = wasActive
            ? '<i class="fas fa-info-circle"></i><span>Состав</span>'
            : '<i class="fas fa-times"></i><span>Скрыть состав</span>';
    });
}

// ==================================================
// АДАПТАЦИЯ ПОД РАЗМЕР ЭКРАНА
// ==================================================

function initResponsiveBehavior() {
    function toggleView() {
        const isMobile = window.innerWidth <= 768;

        document.querySelectorAll('.menu-table').forEach(table => {
            table.style.display = isMobile ? 'none' : 'block';
        });

        document.querySelectorAll('.menu-cards-container').forEach(container => {
            container.style.display = isMobile ? 'block' : 'none';
        });
    }

    toggleView();

    window.addEventListener('resize', toggleView);
}

// ==================================================
// АНИМАЦИИ
// ==================================================

function initAnimations() {
    const animatedElements = document.querySelectorAll(
        '.card, .category-card, .menu-card'
    );

    animatedElements.forEach((element, index) => {
        element.style.animationDelay = `${index * 0.05}s`;
    });

    // Если браузер не поддерживает IntersectionObserver,
    // просто показываем элементы без анимации появления
    if (!('IntersectionObserver' in window)) {
        animatedElements.forEach(element => {
            element.classList.add('animated');
        });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.menu-card').forEach(card => {
        observer.observe(card);
    });
}
