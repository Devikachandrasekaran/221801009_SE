import pandas as pd

def generate_insights(y_test, y_pred, X_test):
    """
    Generate insights for churn prediction dashboard.
    
    Args:
        y_test (pd.Series): Actual labels.
        y_pred (pd.Series): Predicted labels.
        X_test (pd.DataFrame): Test features.
        
    Returns:
        dict: Analytical insights.
    """
    from sklearn.metrics import classification_report, confusion_matrix

    cm = confusion_matrix(y_test, y_pred)
    report = classification_report(y_test, y_pred, output_dict=True)
    churn_rate = (y_pred.sum() / len(y_pred)) * 100

    return {
        "confusion_matrix": cm.tolist(),
        "classification_report": report,
        "churn_rate": churn_rate,
        "top_features": X_test.columns.tolist()[:5],  # Example: top features
    }
