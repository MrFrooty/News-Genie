from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017')
db = client['news_aggregator']

def save_user_preferences(user_id, preferences):
    db.users.update_one(
        {'_id': user_id},
        {'$set': {'preferences': preferences}},
        upsert=True
    )

def get_user_preferences(user_id):
    user = db.users.find_one({'_id': user_id})
    return user['preferences'] if user else None

# Add more database functions as needed