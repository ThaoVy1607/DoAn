// Xử lý chuyển tab
// document.querySelectorAll('.sidebar li').forEach(item => {
//   item.addEventListener('click', function () {
//     const target = this.getAttribute('data-target');
    
//     // Ẩn tất cả các tab
//     document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));

//     // Hiện tab được chọn
//     document.getElementById(target).classList.add('active');

//     // Nếu là tab 'home', thì gọi hàm vẽ biểu đồ
//     if (target === 'home') {
//       drawChart(); // Vẽ lại mỗi khi quay về Trang chủ
//     }
//   });
// });




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
      legend: { labels: { color: 'black' }},
      tooltip: { mode: 'nearest', intersect: false }
    },
    scales: {
      x: {
        ticks: { color: 'black' },
        grid: { color: 'rgba(0,0,0,0.1)' },
        title: { display: true, text: 'Thời gian', color: 'black' }
      },
      y: {
        min: 0,
        max: 100,
        ticks: { color: 'black' },
        grid: { color: 'rgba(0,0,0,0.1)' },
        title: { display: true, text: 'Giá trị xung', color: 'black' }
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
