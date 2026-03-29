function parseTime(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return { h, m };
}

function formatTime(h, m) {
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h % 12 === 0 ? 12 : h % 12;
  const min = m.toString().padStart(2, '0');
  return `${hour}:${min} ${period}`;
}

function addMinutes(h, m, mins) {
  const total = h * 60 + m + mins;
  return { h: Math.floor(total / 60) % 24, m: total % 60 };
}

function generateRoutine() {
  const goals = document.getElementById('goals').value.trim();
  const startStr = document.getElementById('startTime').value;
  const endStr = document.getElementById('endTime').value;
  const distractions = document.getElementById('distractions').value.trim();

  if (!goals || !distractions) {
    alert('Please fill in your goals and distractions.');
    return;
  }

  const start = parseTime(startStr);
  const end = parseTime(endStr);
  const totalMins = (end.h * 60 + end.m) - (start.h * 60 + start.m);

  if (totalMins <= 0) {
    alert('End time must be after start time.');
    return;
  }

  // Morning routine: 1 hour before work start
  const morningStart = addMinutes(start.h, start.m, -60);
  const morningEnd = start;

  // Deep work block 1: first 90 mins of work
  const dw1Start = start;
  const dw1End = addMinutes(dw1Start.h, dw1Start.m, 90);

  // Break 1: 15 mins
  const b1Start = dw1End;
  const b1End = addMinutes(b1Start.h, b1Start.m, 15);

  // Deep work block 2: 90 mins
  const dw2Start = b1End;
  const dw2End = addMinutes(dw2Start.h, dw2Start.m, 90);

  // Lunch break: 30 mins
  const lunchStart = dw2End;
  const lunchEnd = addMinutes(lunchStart.h, lunchStart.m, 30);

  // Deep work block 3: remaining time minus 15 min break
  const dw3Start = lunchEnd;
  const dw3End = addMinutes(dw3Start.h, dw3Start.m, 90);

  // Break 2: 15 mins
  const b2Start = dw3End;
  const b2End = addMinutes(b2Start.h, b2Start.m, 15);

  // Wind down: rest of work time
  const windStart = b2End;

  // Evening: 1 hour after work
  const eveningStart = end;
  const eveningEnd = addMinutes(eveningStart.h, eveningStart.m, 60);

  // Extract top 3 tasks from goals
  const goalLines = goals.split(/[,\n]+/).map(g => g.trim()).filter(Boolean);
  const top3 = goalLines.slice(0, 3);
  while (top3.length < 3) top3.push('Define your next priority task');

  // Distraction tips
  const distractionList = distractions.split(/[,]+/).map(d => d.trim()).filter(Boolean);
  const distractionTips = distractionList.map(d => `Put away / silence your ${d} during deep work blocks`);

  const output = document.getElementById('output');
  output.style.display = 'block';
  output.innerHTML = `
    <div class="section">
      <h3>🌅 Morning Routine (${formatTime(morningStart.h, morningStart.m)} – ${formatTime(morningEnd.h, morningEnd.m)})</h3>
      <ul>
        <li>Wake up and drink a glass of water</li>
        <li>5–10 min light stretch or walk</li>
        <li>Review your 3 most important tasks for the day</li>
        <li>Avoid phone/social media until work starts</li>
        <li>Eat a light breakfast and prepare your workspace</li>
      </ul>
    </div>

    <div class="section">
      <h3>💻 Deep Work Schedule</h3>
      <ul>
        <li><strong>Block 1:</strong> ${formatTime(dw1Start.h, dw1Start.m)} – ${formatTime(dw1End.h, dw1End.m)} — Hardest task first (peak focus)</li>
        <li><strong>Break:</strong> ${formatTime(b1Start.h, b1Start.m)} – ${formatTime(b1End.h, b1End.m)} — Step away, stretch, hydrate</li>
        <li><strong>Block 2:</strong> ${formatTime(dw2Start.h, dw2Start.m)} – ${formatTime(dw2End.h, dw2End.m)} — Second priority task</li>
        <li><strong>Lunch:</strong> ${formatTime(lunchStart.h, lunchStart.m)} – ${formatTime(lunchEnd.h, lunchEnd.m)} — Full break, no screens if possible</li>
        <li><strong>Block 3:</strong> ${formatTime(dw3Start.h, dw3Start.m)} – ${formatTime(dw3End.h, dw3End.m)} — Review, emails, lighter tasks</li>
        <li><strong>Break:</strong> ${formatTime(b2Start.h, b2Start.m)} – ${formatTime(b2End.h, b2End.m)} — Short reset</li>
        <li><strong>Wind down:</strong> ${formatTime(windStart.h, windStart.m)} – ${formatTime(end.h, end.m)} — Plan tomorrow, wrap up loose ends</li>
      </ul>
    </div>

    <div class="section">
      <h3>☕ Break Tips</h3>
      <ul>
        <li>Use breaks to move — don't just switch to another screen</li>
        <li>Drink water, not energy drinks, to stay focused</li>
        ${distractionTips.map(t => `<li>${t}</li>`).join('')}
      </ul>
    </div>

    <div class="section">
      <h3>🌙 Evening Routine (${formatTime(eveningStart.h, eveningStart.m)} – ${formatTime(eveningEnd.h, eveningEnd.m)})</h3>
      <ul>
        <li>Write down what you accomplished today</li>
        <li>Set your top 3 tasks for tomorrow</li>
        <li>Disconnect from work — no emails after hours</li>
        <li>Light activity: walk, read, or hobby time</li>
        <li>Wind down 30 min before sleep — dim lights, no screens</li>
      </ul>
    </div>

    <div class="section tasks">
      <h3>✅ 3 Most Important Tasks Today</h3>
      ${top3.map((t, i) => `<div class="task-item"><span>${i + 1}</span>${t}</div>`).join('')}
    </div>
  `;
}
