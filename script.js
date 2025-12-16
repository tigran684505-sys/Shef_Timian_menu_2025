document.addEventListener('DOMContentLoaded', function() {
    // Обработка кнопок "Состав" в таблицах меню
    const descButtons = document.querySelectorAll('.desc-btn');
    
    descButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const descriptionRow = document.getElementById(targetId);
            
            // Закрываем все открытые описания
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
            
            // Переключаем текущее описание
            if (descriptionRow) {
                descriptionRow.classList.toggle('active');
                this.classList.toggle('active');
                
                // Меняем иконку
                if (this.classList.contains('active')) {
                    this.innerHTML = '<i class="fas fa-times"></i>';
                } else {
                    this.innerHTML = '<i class="fas fa-info"></i>';
                }
            }
        });
    });
    
    // Плавные анимации при загрузке
    const cards = document.querySelectorAll('.card, .category-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
});