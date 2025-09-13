document.addEventListener('DOMContentLoaded', () => {
  const jobSelect = document.getElementById('jobSelect');
  const form = document.getElementById('wageForm');
  const tableBody = document.getElementById('wageTableBody');
  const exportBtn = document.getElementById('exportBtn');

  // Fetch job codes
  fetch('/api/jobs')
    .then(res => res.json())
    .then(data => {
      data.forEach(job => {
        const option = document.createElement('option');
        option.value = job.job_cd;
        option.textContent = `${job.job_cd} - ${job.contractor_name}`;
        jobSelect.appendChild(option);
      });
    });

  // Handle form submit
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const job_cd = jobSelect.value;
    const year = document.getElementById('yearInput').value;
    const month = document.getElementById('monthSelect').value;

    fetch(`/api/wages?job_cd=${job_cd}&year=${year}&month=${month}`)
      .then(res => res.json())
      .then(data => {
        tableBody.innerHTML = '';
        data.forEach(row => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${row.worker_name}</td>
            <td>${row.worker_skill}</td>
            <td>${row.attendance_days}</td>
            <td>₹ ${row.allowance.toFixed(2)}</td>
            <td><strong>₹ ${row.total_wage.toFixed(2)}</strong></td>
          `;
          tableBody.appendChild(tr);
        });
      });
  });

  // Handle Export
  exportBtn.addEventListener('click', () => {
    const job_cd = jobSelect.value;
    const year = document.getElementById('yearInput').value;
    const month = document.getElementById('monthSelect').value;
    const url = `/api/wages/export?job_cd=${job_cd}&year=${year}&month=${month}`;
    window.open(url, '_blank');
  });
});
