from flask import Flask, request, jsonify
from flask_cors import CORS  # ใช้ CORS สำหรับ React
import joblib  # ใช้ joblib ในการโหลดโมเดล
import numpy as np

app = Flask(__name__)
CORS(app)  # เปิดให้ React สามารถเรียก API ได้จากทุกที่

model = joblib.load("backend/random_forest_standard_modelfinal.pkl")

# ใช้โมเดลพยากรณ์
@app.route('/predict', methods=['POST'])
def calculate_sum():
    data = request.json
    numbers = np.array(data.get('numbers', []))  # รับตัวเลข 10 ตัวจากคำขอ
    numbers = numbers.reshape(1, -1)  # เปลี่ยนให้เป็น 2D array โดยให้แต่ละค่าอยู่ใน 1 แถว
    prediction = model.predict(numbers)

    # ตรวจสอบค่า prediction[0] และแสดงผลตามที่ต้องการ
    if prediction[0] == 0:
        result = "Alive"
    elif prediction[0] == 1:
        result = "Bankrupt"
    else:
        result = "Unknown"  # ถ้าไม่ได้ค่า 0 หรือ 1

    return jsonify({'prediction': result})

if __name__ == '__main__':
    app.run(debug=True, port=5000)  # กำหนดให้ Flask รันที่พอร์ต 5000
