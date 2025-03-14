import React, { useState } from 'react';

function App() {
  const [numbers, setNumbers] = useState(Array(14).fill(''));
  const [result, setResult] = useState(null);
  const [resultColor, setResultColor] = useState('#6200ea'); // เพิ่ม state สำหรับสีของผลลัพธ์

  const handleChange = (e, index) => {
    const newNumbers = [...numbers];
    newNumbers[index] = e.target.value;
    setNumbers(newNumbers);
  };

  const predict = async () => {
    if (numbers.some(num => num === '')) {
      setResult('กรุณากรอกให้ครบ');
      setResultColor('#6200ea'); // สีปกติ
      return;
    }

    if (numbers.some(num => isNaN(num) || num === '' || num.trim() === '')) {
      setResult('กรุณากรอกข้อมูลที่เป็นตัวเลขเท่านั้น');
      setResultColor('#6200ea'); // สีปกติ
      return;
    }

    const response = await fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ numbers: numbers.map(num => parseFloat(num)) })
    });

    const data = await response.json();
    const prediction = data.prediction;

    if (prediction === 'Alive') {
      setResult(`Prediction: ${prediction}`);
      setResultColor('green'); // ถ้าเป็น Alive ให้เป็นสีเขียว
    } else if (prediction === 'Bankrupt') {
      setResult(`Prediction: ${prediction}`);
      setResultColor('red'); // ถ้าเป็น Bankrupt ให้เป็นสีแดง
    } else {
      setResult(`Prediction: ${prediction}`);
      setResultColor('#6200ea'); // ถ้าเป็นค่าอื่น ให้แสดงสีปกติ
    }
  };

  const inputLabels = [
    'Year of establishment (AD)',
    "Current assets ($)",
    "EBITDA ($)",
    "Total Receivables ($)",
    "Market value ($)",
    "Net sales ($)",
    "Total assets ($)",
    "Total Long-term debt ($)",
    "EBIT ($)",
    "Gross Profit ($)",
    "Total Current Liabilities ($)",
    "Retained Earnings ($)",
    "Total Revenue ($)",
    "Total Liabilities ($)"
  ];

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>Bankruptcy Prediction</h2>
      <div style={styles.formContainer}>
        <div style={styles.column}>
          {numbers.slice(0, 7).map((num, index) => (
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
          {numbers.slice(7).map((num, index) => (
            <div key={index + 7} style={styles.inputContainer}>
              <label style={styles.label}>{inputLabels[index + 7]}</label>
              <input
                type="number"
                value={num}
                onChange={(e) => handleChange(e, index + 7)}
                placeholder={inputLabels[index + 7]}
                style={styles.input}
              />
            </div>
          ))}
        </div>
      </div>
      <button onClick={predict} style={styles.button}>คำนวณ</button>

      {result && <p style={{ ...styles.resultText, color: resultColor }}>{result}</p>} {/* แสดงผลลัพธ์ด้วยสีที่กำหนด */}

    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    textAlign: 'center',
    background: 'linear-gradient(to top, #fce4ec, #e1bee7)',
    fontFamily: 'Arial, sans-serif',
  },
  header: {
    fontSize: '28px',
    color: '#6200ea',
    marginBottom: '20px',
    fontWeight: 'bold',
  },
  formContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '60%',
    maxWidth: '1000px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    width: '45%',
  },
  inputContainer: {
    marginBottom: '12px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    marginBottom: '6px',
    color: '#333',
    textAlign: 'left', // ทำให้ข้อความชิดซ้าย
    width: '100%', // ให้ครอบคลุมความกว้างเต็ม
  },
  input: {
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ccc',
    borderRadius: '5px',
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: '#f9f9f9',
    transition: '0.3s',
  },
  button: {
    marginTop: '20px',
    padding: '10px 18px',
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    backgroundColor: '#6200ea',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  resultText: {
    fontSize: '16px',
    marginTop: '20px',
    fontWeight: 'bold',
  },
  predictionValuesContainer: {
    textAlign: 'left',
  },
  predictionValuesList: {
    listStyleType: 'none',
    padding: 0,
  },
  predictionValueItem: {
    fontSize: '14px',
    color: '#333',
    marginBottom: '6px',
  },
};

export default App;
