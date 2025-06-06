async function fetchData() {
  try {
    const res = await fetch('http://localhost:3000/data');
    const data = await res.json();
    const list = document.getElementById('dataList');
    list.innerHTML = ''; // Xóa dữ liệu cũ

    data.forEach(item => {
      const createdAt = new Date(item.createdAt);
      const date = createdAt.toLocaleDateString();
      const time = createdAt.toLocaleTimeString();

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
