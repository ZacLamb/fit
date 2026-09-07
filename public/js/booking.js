(function () {
  const serviceSelect = document.getElementById('service_id');
  const dateInput = document.getElementById('date');
  const slotGrid = document.getElementById('slot-grid');
  const startTimeInput = document.getElementById('start_time');
  const submitBtn = document.getElementById('submit-btn');

  // Pre-select a service if arriving from a service detail page (?service=ID)
  const params = new URLSearchParams(window.location.search);
  const preselect = params.get('service');
  if (preselect) serviceSelect.value = preselect;

  function formatTime(t) {
    const [h, m] = t.split(':').map(Number);
    const period = h >= 12 ? 'PM' : 'AM';
    const hour12 = h % 12 === 0 ? 12 : h % 12;
    return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
  }

  async function loadSlots() {
    startTimeInput.value = '';
    submitBtn.disabled = true;

    const serviceId = serviceSelect.value;
    const date = dateInput.value;
    if (!serviceId || !date) {
      slotGrid.innerHTML = '<span class="slot-empty">Choose a program and date to see open times.</span>';
      return;
    }

    slotGrid.innerHTML = '<span class="slot-empty">Loading times...</span>';

    try {
      const res = await fetch(`/booking/slots?service_id=${serviceId}&date=${date}`);
      const data = await res.json();
      if (!data.slots || !data.slots.length) {
        slotGrid.innerHTML = '<span class="slot-empty">No open times that day — try another date.</span>';
        return;
      }
      slotGrid.innerHTML = '';
      data.slots.forEach((slot) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'slot-btn';
        btn.textContent = formatTime(slot);
        btn.addEventListener('click', () => {
          document.querySelectorAll('.slot-btn.selected').forEach((b) => b.classList.remove('selected'));
          btn.classList.add('selected');
          startTimeInput.value = slot;
          submitBtn.disabled = false;
        });
        slotGrid.appendChild(btn);
      });
    } catch (err) {
      slotGrid.innerHTML = '<span class="slot-empty">Couldn\'t load times. Please try again.</span>';
    }
  }

  serviceSelect.addEventListener('change', loadSlots);
  dateInput.addEventListener('change', loadSlots);

  if (preselect) loadSlots();
})();
