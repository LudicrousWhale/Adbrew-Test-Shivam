import os
import logging
from pymongo import MongoClient, errors as pymongo_errors

logger = logging.getLogger(__name__)


def get_mongo_collection():
    try:
        mongo_uri = f"mongodb://{os.environ['MONGO_HOST']}:{os.environ['MONGO_PORT']}"
        client = MongoClient(mongo_uri, serverSelectionTimeoutMS=3000)
        db = client["test_db"]
        client.server_info()  # Trigger connection test
        return db["todos"]
    except pymongo_errors.ServerSelectionTimeoutError as e:
        logger.error(f"MongoDB connection failed: {e}")
        return None


def get_todos():
    collection = get_mongo_collection()
    if not collection:
        raise ConnectionError("MongoDB not available")
    try:
        return list(collection.find({}, {"_id": 0}))
    except Exception as e:
        logger.exception("Failed to fetch todos from MongoDB")
        raise


def add_todo(description: str):
    collection = get_mongo_collection()
    if not collection:
        raise ConnectionError("MongoDB not available")
    try:
        collection.insert_one({"description": description})
    except Exception as e:
        logger.exception("Failed to insert todo into MongoDB")
        raise
