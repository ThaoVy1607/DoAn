async function fetchData() {
  try {
    const res = await fetch('http://localhost:3000/data');
    const data = await res.json();
    const list = document.getElementById('dataList');
    list.innerHTML = ''; // Xóa dữ liệu cũ

    data.forEach(item => {
    const recordTime = new Date(item.time);  // Dùng thời gian từ MongoDB
    const date = recordTime.toLocaleDateString();
    const time = recordTime.toLocaleTimeString();

    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${date}</td>
      <td>${time}</td>
      <td>${item.value}</td>
    `;
    list.appendChild(row);
  });

  } catch (err) {
    document.getElementById('dataList').innerHTML = `
      <tr><td colspan="3">Lỗi kết nối server!</td></tr>
    `;
    console.error(err);
  }
}

fetchData();
setInterval(fetchData, 3000);
