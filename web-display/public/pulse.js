// Khởi tạo biểu đồ
const ctx = document.getElementById('pulseChart').getContext('2d');

const gradient = ctx.createLinearGradient(0, 0, 0, 400);
gradient.addColorStop(0, 'rgba(255,99,132,1)');
gradient.addColorStop(1, 'rgba(255,99,132,0.2)');

const pulseChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [{
      label: 'Tín hiệu xung',
      data: [],
      fill: true,
      backgroundColor: gradient,
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 2,
      tension: 0.4,
      pointRadius: 0
    }]
  },
  options: {
    animation: false,
    responsive: true,
    plugins: {
      legend: { labels: { color: 'green' }},
      tooltip: { mode: 'nearest', intersect: false }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'minute',
          stepSize: 1, // Mỗi 1 phút 1 mốc
          displayFormats: {
            minute: 'HH:mm'
          }
        },
        ticks: {
          color: 'black'
        },
        grid: {
          color: 'rgba(33, 228, 228, 0.61)'
        },
        title: {
          display: true,
          text: 'Thời gian',
          color: 'green'
        }
      },
      y: {
        min: -50,
        max: 750,
        ticks: {
          stepSize: 50,
          color: 'green',
          callback: function(value) {
            return value + ' L';
          }
        },
        grid: {
          color: 'rgba(128, 219, 53, 0.73)'
        },
        title: {
          display: true,
          text: 'Lượng nước (Lít)',
          color: 'green'
        }
      }
    }
  }
});

// Kết nối WebSocket
const socket = io('http://localhost:3000');

socket.on('newData', (data) => {
  if (!document.getElementById('home').classList.contains('active')) return;

  const { time, value } = data;

  pulseChart.data.labels.push(time);
  pulseChart.data.datasets[0].data.push(value);

  if (pulseChart.data.labels.length > 50) {
    pulseChart.data.labels.shift();
    pulseChart.data.datasets[0].data.shift();
  }

  pulseChart.update();
});
