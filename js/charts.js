(function () {
  const chartRegistry = {};

  const getChartOptions = (type) => {
    const defaults = {
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          display: type !== 'line',
          labels: {
            usePointStyle: true,
            pointStyle: 'circle'
          }
        }
      }
    };

    return defaults;
  };

  const renderLineChart = (canvasId, labels, revenueData, expenseData) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    if (chartRegistry[canvasId]) {
      chartRegistry[canvasId].destroy();
    }

    chartRegistry[canvasId] = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Revenue',
            data: revenueData,
            borderColor: '#6d5efc',
            backgroundColor: 'rgba(109, 94, 252, 0.18)',
            fill: true,
            tension: 0.45,
            borderWidth: 3,
            pointRadius: 0
          },
          {
            label: 'Expenses',
            data: expenseData,
            borderColor: '#60a5fa',
            backgroundColor: 'rgba(96, 165, 250, 0.12)',
            fill: true,
            tension: 0.45,
            borderWidth: 2,
            pointRadius: 0
          }
        ]
      },
      options: {
        ...getChartOptions('line'),
        scales: {
          y: {
            grid: { color: 'rgba(148, 163, 184, 0.12)' },
            ticks: { color: 'rgba(148, 163, 184, 0.9)' }
          },
          x: {
            grid: { display: false },
            ticks: { color: 'rgba(148, 163, 184, 0.9)' }
          }
        }
      }
    });
  };

  const renderBarChart = (canvasId, labels, data, color = '#8b5cf6') => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    if (chartRegistry[canvasId]) {
      chartRegistry[canvasId].destroy();
    }

    chartRegistry[canvasId] = new Chart(canvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: color,
          borderRadius: 8,
          borderSkipped: false
        }]
      },
      options: {
        ...getChartOptions('bar'),
        plugins: { legend: { display: false } },
        scales: {
          y: {
            grid: { color: 'rgba(148, 163, 184, 0.12)' },
            ticks: { color: 'rgba(148, 163, 184, 0.9)' }
          },
          x: {
            grid: { display: false },
            ticks: { color: 'rgba(148, 163, 184, 0.9)' }
          }
        }
      }
    });
  };

  const renderDoughnutChart = (canvasId, labels, data, colors) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    if (chartRegistry[canvasId]) {
      chartRegistry[canvasId].destroy();
    }

    chartRegistry[canvasId] = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          borderWidth: 0
        }]
      },
      options: {
        ...getChartOptions('doughnut'),
        cutout: '68%',
        plugins: { legend: { position: 'bottom', labels: { color: 'rgba(148, 163, 184, 0.9)' } } }
      }
    });
  };

  const renderRadarChart = (canvasId, labels, data) => {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    if (chartRegistry[canvasId]) {
      chartRegistry[canvasId].destroy();
    }

    chartRegistry[canvasId] = new Chart(canvas, {
      type: 'radar',
      data: {
        labels,
        datasets: [{
          label: 'Value',
          data,
          backgroundColor: 'rgba(109, 94, 252, 0.18)',
          borderColor: '#6d5efc',
          pointBackgroundColor: '#6d5efc',
          borderWidth: 2
        }]
      },
      options: {
        ...getChartOptions('radar'),
        scales: {
          r: {
            grid: { color: 'rgba(148, 163, 184, 0.14)' },
            angleLines: { color: 'rgba(148, 163, 184, 0.14)' },
            suggestedMin: 0,
            suggestedMax: 100,
            pointLabels: { color: 'rgba(148, 163, 184, 0.9)' }
          }
        }
      }
    });
  };

  window.novaAdminCharts = {
    renderLineChart,
    renderBarChart,
    renderDoughnutChart,
    renderRadarChart
  };
})();
