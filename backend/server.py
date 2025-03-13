from flask import Flask, request, jsonify
from flask_cors import CORS  # ใช้ CORS สำหรับ React
import datetime
import joblib  # ใช้ joblib ในการโหลดโมเดล
import numpy as np
import os  # สำหรับอ่านค่าจาก environment variable
import warnings

# ปิดการแจ้งเตือนจาก sklearn
warnings.filterwarnings('ignore', category=UserWarning, module='sklearn')

app = Flask(__name__)
CORS(app)  # เปิดให้ React สามารถเรียก API ได้จากทุกที่

model = joblib.load("random_forest_standard_modelfinal.pkl")
scaler = joblib.load("scaler_selected_columns.pkl")

# Route สำหรับ root
@app.route('/')
def index():
    return "Flask API is running!"  # เพิ่มข้อความทดสอบ

# ใช้โมเดลพยากรณ์
@app.route('/predict', methods=['POST'])
def calculate_sum():
    data = request.json
    numbers = np.array(data.get('numbers', []))  # รับตัวเลข 14 ตัวจากคำขอ

    # Calculation
    input1 = datetime.datetime.now().year - numbers[0]
    input2 = numbers[4] / numbers[13] # X8 / X17
    input3 = numbers[5] / numbers[6] # X9 / X10
    input4 = numbers[13] / numbers[6] # X17 / X10
    input5 = numbers[8] / numbers[7] # X12 / X11
    input6 = (numbers[1] - numbers[10]) / numbers[6] # (X1 - X14) / X10
    input7 = numbers[3] # X7
    input8 = numbers[9] / numbers[12] # X13 / X16
    input9 = numbers[2] / numbers[12] # X4 / X16
    input10 = 1.2 * input6 + 1.4 * (numbers[11] / numbers[6]) + 3.3 * (numbers[8] / numbers[6]) + 0.6 * input2 + 1.0 * input3

    # Apply the conditional logic to input5
    if (input5 < 0).any():
        input5 = np.log1p(input5 - 0.6931471805599453 + 1)  # Handling negative values (Min = 0.6931471805599453)
    else:
        input5 = np.log1p(input5)  # Apply log1p if input5 is not negative

    # Apply the conditional logic to input10
    if (input10 < 0).any():
        input10 = np.log1p(input10 - 0.6931471805599453 + 1)  # Handling negative values (Min = 0.6931471805599453)
    else:
        input10 = np.log1p(input10)  # Apply log1p if input10 is not negative

    # To 2D Arrays
    inputs_array = np.array([[input1, input2, input3, input4, input5, input6, input7, input8, input9, input10]])

    # ทำการแปลงข้อมูลด้วย scaler
    scaled_inputs = scaler.transform(inputs_array)

    prediction = model.predict(scaled_inputs)

    # ตรวจสอบค่า prediction[0] และแสดงผลตามที่ต้องการ
    if prediction[0] == 0:
        result = "Alive"
    elif prediction[0] == 1:
        result = "Bankrupt"
    else:
        result = "Unknown"  # ถ้าไม่ได้ค่า 0 หรือ 1

    return jsonify({'prediction': result, 'prediction_values': scaled_inputs.tolist()})

if __name__ == '__main__':
    # ใช้พอร์ตจาก environment variable ที่ Render กำหนด และเปิดให้เข้าถึงจากภายนอก
    port = int(os.environ.get("PORT", 5000))  # หากไม่มีจะใช้พอร์ต 5000
    app.run(debug=True, host="0.0.0.0", port=port)  # กำหนด host เป็น 0.0.0.0
