# vector.py
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
import os
import pandas as pd

# Absolute path for shopee_like_app_features.csv (relative to this vector.py file)
csv_path = os.path.join(os.path.dirname(__file__), 'features.csv')
df = pd.read_csv(csv_path)

embeddings = OllamaEmbeddings(model="mxbai-embed-large")

# Absolute path for DB directory (relative to this vector.py file)
db_location = os.path.join(os.path.dirname(__file__), 'chrome_langchain_db_ShinyCloth_features')
add_documents = not os.path.exists(db_location)

if add_documents:
    documents = []
    ids = []

    for i, row in df.iterrows():
        # Combine object, feature, descript, manual to create full content
        document_content = f"Object: {row['object']}\nFeature: {row['feature']}\nDescript: {row['descript']}\nManual: {row['manual']}"
        document = Document(
            page_content=document_content,
            metadata={
                "id": row["id"],
                "object": row["object"],
                "feature": row["feature"],
                "descript": row["descript"],
                "manual": row["manual"]
            },
            id=str(row["id"])
        )
        ids.append(str(row["id"]))
        documents.append(document)

    vector_store = Chroma(
        collection_name="shopee_features",
        persist_directory=db_location,
        embedding_function=embeddings
    )

    vector_store.add_documents(documents=documents, ids=ids)
else:
    vector_store = Chroma(
        collection_name="shopee_features",
        persist_directory=db_location,
        embedding_function=embeddings
    )

retriever = vector_store.as_retriever(
    search_kwargs={"k": 3}  # Increased k to retrieve more for better object/feature matching
)