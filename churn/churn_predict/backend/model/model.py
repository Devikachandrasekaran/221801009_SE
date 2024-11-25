import pandas as pd
from catboost import CatBoostClassifier, Pool

# File path to the dataset
DATASET_PATH = "C:\\Users\\Keethika P\\churn\\churn_predict\\backend\\data\\modified.xlsx"  # Replace with your dataset path
MODEL_SAVE_PATH = "C:\\Users\\Keethika P\\churn\\churn_predict\\backend\\model\\saved_model.pkl"  # Path to save the model


def load_data(dataset_path):
    """
    Load the dataset from the given path.
    """
    try:
        # Load the Excel file into a DataFrame
        data = pd.read_excel(dataset_path)
        return data
    except Exception as e:
        raise Exception(f"Error loading data: {str(e)}")

def preprocess_data(data):
    """
    Preprocess the data: Handle missing values, encode categorical variables, and split into features and target.
    """
    try:
        # Drop unnecessary columns (e.g., 'CustomerID')
        data = data.drop(columns=['CustomerID'], errors='ignore')

        # Handle missing values
        data.fillna(data.mean(numeric_only=True), inplace=True)  # Replace numerical NaNs with column mean
        data.fillna("Unknown", inplace=True)  # Replace categorical NaNs with "Unknown"

        # One-hot encode categorical variables
        categorical_columns = ['PreferredLoginDevice', 'PreferredPaymentMode', 'Gender', 'PreferedOrderCat', 'MaritalStatus']
        data = pd.get_dummies(data, columns=categorical_columns, drop_first=True)

        # Split the dataset into features (X) and target (y)
        X = data.drop(columns=['Churn'], errors='ignore')  # 'Churn' is the target column
        y = data['Churn']
        return X, y
    except Exception as e:
        raise Exception(f"Error during preprocessing: {str(e)}")

def train_and_save_model(X, y, save_path):
    """
    Train a CatBoostClassifier model and save it to a file.
    """
    try:
        # Initialize the CatBoostClassifier
        model = CatBoostClassifier(
            iterations=500, 
            learning_rate=0.1, 
            depth=6, 
            verbose=0  # Suppress verbose output during training
        )

        # Train the model
        train_data = Pool(X, label=y)
        model.fit(train_data)

        # Save the trained model to a file
        model.save_model(save_path)
        print(f"Model saved successfully at {save_path}")
    except Exception as e:
        raise Exception(f"Error during training or saving model: {str(e)}")

def main():
    """
    Main function to load data, preprocess it, train the model, and save it.
    """
    try:
        # Load the dataset
        data = load_data(DATASET_PATH)

        # Preprocess the data
        X, y = preprocess_data(data)

        # Train the model and save it
        train_and_save_model(X, y, MODEL_SAVE_PATH)
    except Exception as e:
        print(f"Error in main: {str(e)}")

if __name__ == "__main__":
    main()
