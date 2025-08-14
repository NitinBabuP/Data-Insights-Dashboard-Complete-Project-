
import os
import pandas as pd
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import create_access_token, jwt_required, JWTManager
from flask_bcrypt import Bcrypt
from sklearn.linear_model import LinearRegression
import numpy as np

# Load environment variables
load_dotenv()

# Initialize Flask App
app = Flask(__name__)

# Configure CORS to allow requests from the frontend
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Configure Database and JWT
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = os.environ.get('JWT_SECRET_KEY')

# Initialize extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# --- Database Models ---
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

    def __init__(self, username, password):
        self.username = username
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)

# Create database tables if they don't exist
with app.app_context():
    db.create_all()

# --- API Endpoints ---
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({"msg": "Username and password are required"}), 400
    if User.query.filter_by(username=username).first():
        return jsonify({"msg": "Username already exists"}), 409

    new_user = User(username=username, password=password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"msg": "User created successfully"}), 201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token)
    return jsonify({"msg": "Bad username or password"}), 401

@app.route('/api/upload', methods=['POST'])
@jwt_required()
def upload_file():
    if 'file' not in request.files:
        return jsonify({"msg": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"msg": "No selected file"}), 400

    if file and file.filename.endswith('.csv'):
        try:
            df = pd.read_csv(file)
            summary = {
                "columns": df.columns.tolist(),
                "shape": df.shape,
                "description": df.describe().to_dict()
            }
            numeric_cols = df.select_dtypes(include=np.number).columns.tolist()
            chart_data = {}
            if len(numeric_cols) >= 2:
                chart_data = {
                    "labels": df[numeric_cols[0]].tolist(),
                    "values": df[numeric_cols[1]].tolist(),
                    "x_label": numeric_cols[0],
                    "y_label": numeric_cols[1]
                }
            return jsonify({"summary": summary, "chart_data": chart_data}), 200
        except Exception as e:
            return jsonify({"msg": f"Error processing file: {e}"}), 500
    return jsonify({"msg": "Invalid file type. Please upload a CSV."}), 400

@app.route('/api/predict', methods=['POST'])
@jwt_required()
def predict():
    data = request.get_json()
    x_values = data.get('x_values')
    y_values = data.get('y_values')
    if not x_values or not y_values:
        return jsonify({"msg": "Missing data for prediction"}), 400

    try:
        X = np.array(x_values).reshape(-1, 1)
        y = np.array(y_values)
        model = LinearRegression()
        model.fit(X, y)
        last_x = X[-1][0]
        future_x = np.array([last_x + i for i in range(1, 6)]).reshape(-1, 1)
        predictions = model.predict(future_x)
        return jsonify({"predictions": predictions.tolist()}), 200
    except Exception as e:
        return jsonify({"msg": f"Prediction error: {e}"}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)

---
