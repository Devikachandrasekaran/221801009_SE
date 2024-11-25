import pandas as pd
from flask import Flask, request, jsonify
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import accuracy_score
import traceback
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model = None  # Placeholder for the trained model
accuracy = None  # Placeholder for the model's accuracy

@app.route('/train', methods=['POST'])
def train_model():
    global model, accuracy
    try:
        # Check if a file is included in the request
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        # Read the uploaded CSV file
        data = pd.read_csv(file)

        # Check if the required columns exist
        required_columns = [
            "CustomerID", "Tenure", "PreferredLoginDevice", "CityTier",
            "OrderCount", "Churn"
        ]
        if not all(col in data.columns for col in required_columns):
            return jsonify({"error": f"Missing one or more required columns: {required_columns}"}), 400

        # Preprocessing: Convert categorical data to numeric values
        try:
            device_mapping = {"WebMobile": 1, "MobileWeb": 2, "Mobile": 3, "Web": 4}
            data['PreferredLoginDevice'] = data['PreferredLoginDevice'].map(device_mapping).fillna(0).astype('float64')
            data['CityTier'] = pd.to_numeric(data['CityTier'], errors='coerce').fillna(0).astype('float64')
        except Exception as e:
            return jsonify({"error": f"Error during preprocessing: {str(e)}"}), 500

        # Feature selection
        X = data[["Tenure", "PreferredLoginDevice", "CityTier", "OrderCount"]]
        y = data["Churn"]

        # Encode target column (Churn)
        label_encoder = LabelEncoder()
        y = label_encoder.fit_transform(y)

        # Split data into train and test sets
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Train the model
        model = RandomForestClassifier(random_state=42)
        model.fit(X_train, y_train)

        # Calculate accuracy on the test set
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)

        return jsonify({"message": "Model trained successfully!", "accuracy": accuracy}), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

@app.route('/predict', methods=['POST'])
def predict():
    global model
    try:
        # Ensure the model is trained
        if model is None:
            return jsonify({"error": "Model is not trained yet"}), 400

        # Get the JSON payload
        data = request.get_json()
        if not data or "data" not in data:
            return jsonify({"error": "Invalid or missing data in request"}), 400

        # Convert JSON data to DataFrame
        input_data = pd.DataFrame(data["data"])

        # Ensure the required columns are present
        required_columns = ["Tenure", "PreferredLoginDevice", "CityTier", "OrderCount"]
        if not all(col in input_data.columns for col in required_columns):
            return jsonify({"error": f"Missing one or more required columns: {required_columns}"}), 400

        # Preprocessing: Convert categorical data to numeric
        try:
            device_mapping = {"WebMobile": 1, "MobileWeb": 2, "Mobile": 3, "Web": 4}
            input_data['PreferredLoginDevice'] = input_data['PreferredLoginDevice'].map(device_mapping).fillna(0).astype('float64')
            input_data['CityTier'] = pd.to_numeric(input_data['CityTier'], errors='coerce').fillna(0).astype('float64')
        except Exception as e:
            return jsonify({"error": f"Error during input data preprocessing: {str(e)}"}), 500

        # Ensure data matches feature set
        input_data = input_data[required_columns]

        # Predictions
        probabilities = model.predict_proba(input_data)[:, 1]  # Churn probabilities
        predictions = model.predict(input_data)

        # Calculate risk score
        total_risk_score = sum(probabilities)  # Sum of churn probabilities
        risk_score_percentage = (total_risk_score / len(input_data)) * 100  # Normalize as percentage

        return jsonify({
            "predictions": predictions.tolist(),
            "total_risk_score": total_risk_score,
            "risk_score_percentage": risk_score_percentage
        }), 200

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
