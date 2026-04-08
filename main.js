(function() {
  "use strict";

  // ---------- ТАЙМЕР (до 18.09.2026 15:00) ----------
  function updateTimer() {
    const weddingDate = new Date(2026, 8, 18, 15, 0, 0).getTime(); // месяц 8 = сентябрь
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const timerContainer = document.getElementById('timer');
    if (!timerContainer) return;

    if (distance < 0) {
      timerContainer.innerHTML = `
        <div class="timer-item">
          <div class="timer-value">🎉</div>
          <div class="timer-caption">Свадьба состоялась!</div>
        </div>
      `;
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const formatTwoDigits = (num) => num.toString().padStart(2, '0');

    timerContainer.innerHTML = `
      <div class="timer-item">
        <div class="timer-value">${days}</div>
        <div class="timer-caption">дней</div>
      </div>
      <div class="timer-item">
        <div class="timer-value">${formatTwoDigits(hours)}</div>
        <div class="timer-caption">часов</div>
      </div>
      <div class="timer-item">
        <div class="timer-value">${formatTwoDigits(minutes)}</div>
        <div class="timer-caption">минут</div>
      </div>
      <div class="timer-item">
        <div class="timer-value">${formatTwoDigits(seconds)}</div>
        <div class="timer-caption">секунд</div>
      </div>
    `;
  }

  updateTimer();
  const timerInterval = setInterval(updateTimer, 1000);

  // ---------- ФОРМА: отправка в Google Sheets ----------
  const form = document.getElementById('rsvpForm');
  const statusDiv = document.getElementById('formStatus');

  // ⚠️ ЗАМЕНИТЕ НА СВОЙ URL ИЗ GOOGLE APPS SCRIPT
  const SCRIPT_URL = 'hthttps://script.google.com/macros/s/AKfycbzb6ym0IomHUhugKgOzZXKSWJxiiqFAMABjUIRYLA513WjZWXKOa1Bcg5c8sgwCOrpg/exectps://script.google.com/macros/s/AKfycbwWKsFqYhPsG8v4L8IBQjX6z1JpDfIY_8l2Uq2FqJxH0y9K7aM/exec';
  
  function isDemoUrl(url) {
    return url.includes('AKfycbwWKsFqYhPsG8v4L8IBQjX6z1JpDfIY_8l2Uq2FqJxH0y9K7aM') || url === '';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('guestName').value.trim();
    const attendance = document.querySelector('input[name="attendance"]:checked')?.value || '';
    const message = document.getElementById('message').value.trim();
    
    if (!name) {
      statusDiv.innerHTML = '<span class="error">Пожалуйста, укажите имя</span>';
      return;
    }
    if (!attendance) {
      statusDiv.innerHTML = '<span class="error">Выберите вариант присутствия</span>';
      return;
    }

    statusDiv.innerHTML = '<span style="color:#a58374;">Отправка...</span>';

    const formData = new FormData();
    formData.append('name', name);
    formData.append('attendance', attendance);
    formData.append('message', message || '(без комментария)');
    formData.append('timestamp', new Date().toLocaleString('ru-RU'));

    if (isDemoUrl(SCRIPT_URL)) {
      console.warn('⚠️ Используется демо-URL Google Script. Для реальной отправки замените SCRIPT_URL.');
      statusDiv.innerHTML = '<span class="success">✓ Спасибо! Ваш ответ принят (демо-режим).<br><small>Для реальной записи в Google Таблицу замените SCRIPT_URL в коде.</small></span>';
      form.reset();
      return;
    }

    try {
      await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });
      
      statusDiv.innerHTML = '<span class="success">✓ Благодарим! Ваш ответ отправлен.</span>';
      form.reset();
    } catch (error) {
      console.error('Ошибка отправки:', error);
      statusDiv.innerHTML = '<span class="error">⚠️ Ошибка соединения. Проверьте интернет или настройки скрипта.</span>';
    }
  });

  document.querySelectorAll('#rsvpForm input, #rsvpForm textarea').forEach(el => {
    el.addEventListener('input', () => {
      if (statusDiv) statusDiv.innerHTML = '';
    });
  });

  window.addEventListener('beforeunload', () => clearInterval(timerInterval));
})();