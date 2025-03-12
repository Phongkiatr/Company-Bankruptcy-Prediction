import React, { useState } from 'react';

function App() {
  // สร้าง state สำหรับเก็บค่าของตัวเลขและผลลัพธ์
  const [numbers, setNumbers] = useState(Array(10).fill(''));
  const [result, setResult] = useState(null);

  // ฟังก์ชันสำหรับอัพเดทค่าในตัวเลข
  const handleChange = (e, index) => {
    const newNumbers = [...numbers];
    newNumbers[index] = e.target.value;
    setNumbers(newNumbers);
  };

  // ฟังก์ชันสำหรับคำนวณผลรวม
  const calculateSum = async () => {
    // ตรวจสอบว่ามีช่องไหนที่ยังกรอกไม่ครบหรือไม่
    if (numbers.some(num => num === '')) {
      setResult('กรุณากรอกให้ครบ');
      return;
    }

    // ตรวจสอบว่าทุกค่าใน numbers เป็นตัวเลขหรือไม่ (รองรับทั้งจำนวนเต็มและทศนิยม)
    if (numbers.some(num => isNaN(num) || num === '' || num.trim() === '')) {
      setResult('กรุณากรอกข้อมูลที่เป็นตัวเลขเท่านั้น');
      return;
    }

    // ส่งคำขอไปที่ Flask API
    const response = await fetch('https://company-bankruptcy-prediction-0a7i.onrender.com/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numbers: numbers.map(num => parseFloat(num)) }) // แปลงเป็นจำนวนจริง
    });

    // รับผลลัพธ์จาก API และตั้งค่าใน state
    const data = await response.json();
    setResult(`Prediction: ${data.prediction}`);
  };

  // ข้อความที่จะแสดงในแต่ละช่อง
  const inputLabels = [
    "กรุณากรอกตัวเลขที่ 1",
    "กรุณากรอกตัวเลขที่ 2",
    "กรุณากรอกตัวเลขที่ 3",
    "กรุณากรอกตัวเลขที่ 4",
    "กรุณากรอกตัวเลขที่ 5",
    "กรุณากรอกตัวเลขที่ 6",
    "กรุณากรอกตัวเลขที่ 7",
    "กรุณากรอกตัวเลขที่ 8",
    "กรุณากรอกตัวเลขที่ 9",
    "กรุณากรอกตัวเลขที่ 10"
  ];

  return (
    <div style={styles.container}>
      <h2>Bankruptcy Prediction</h2>
      <div style={styles.formContainer}>
        <div style={styles.column}>
          {numbers.slice(0, 5).map((num, index) => (
            <div key={index} style={styles.inputContainer}>
              <label style={styles.label}>{inputLabels[index]}</label>
              <input
                type="number"
                value={num}
                onChange={(e) => handleChange(e, index)}
                placeholder={inputLabels[index]}
                style={styles.input}
              />
            </div>
          ))}
        </div>
        <div style={styles.column}>
          {numbers.slice(5).map((num, index) => (
            <div key={index + 5} style={styles.inputContainer}>
              <label style={styles.label}>{inputLabels[index + 5]}</label>
              <input
                type="number"
                value={num}
                onChange={(e) => handleChange(e, index + 5)}
                placeholder={inputLabels[index + 5]}
                style={styles.input}
              />
            </div>
          ))}
        </div>
      </div>
      <button onClick={calculateSum} style={styles.button}>คำนวณ</button>
      <p style={{ fontSize: '20px' }}>{result}</p>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // ให้ความสูงเต็มหน้าจอ
    textAlign: 'left',
    background: 'linear-gradient(to top,rgb(252, 194, 251),rgb(248, 250, 212))',
  },
  formContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '20%', // กำหนดความกว้างของฟอร์ม
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    width: '45%', // แบ่งฝั่งให้มีขนาดครึ่งหนึ่ง
  },
  inputContainer: {
    marginBottom: '20px', // เพิ่มระยะห่างระหว่างแต่ละกล่อง
  },
  label: {
    display: 'block',  // ทำให้ label อยู่ในบรรทัดใหม่
    marginBottom: '5px', // เพิ่มพื้นที่ว่างด้านล่าง label
  },
  input: {
    padding: '5px',
    width: '100%',
    textAlign: 'left'
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer'
  }
};

export default App;
