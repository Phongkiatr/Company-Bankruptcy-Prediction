from flask import Flask, request, jsonify
from flask_cors import CORS  # ใช้ CORS สำหรับ React
import joblib  # ใช้ joblib ในการโหลดโมเดล
import numpy as np
import os  # สำหรับอ่านค่าจาก environment variable

app = Flask(__name__)
CORS(app)  # เปิดให้ React สามารถเรียก API ได้จากทุกที่

model = joblib.load("random_forest_standard_modelfinal.pkl")

# Route สำหรับ root
@app.route('/')
def index():
    return "Flask API is running!"  # เพิ่มข้อความทดสอบ

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
    # ใช้พอร์ตจาก environment variable ที่ Render กำหนด และเปิดให้เข้าถึงจากภายนอก
    port = int(os.environ.get("PORT", 5000))  # หากไม่มีจะใช้พอร์ต 5000
    app.run(debug=True, host="0.0.0.0", port=port)  # กำหนด host เป็น 0.0.0.0
