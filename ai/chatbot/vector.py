from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
import os
import pandas as pd

# -----------------------------
# Paths
# -----------------------------
BASE_DIR = os.path.dirname(__file__)
csv_path = os.path.join(BASE_DIR, "features.csv")
db_location = os.path.join(BASE_DIR, "chroma_langchain_db_shinycloth_features")

# -----------------------------
# Load CSV
# -----------------------------
df = pd.read_csv(csv_path)

# -----------------------------
# Embedding model (NHANH HƠN)
# -----------------------------
# mxbai-embed-large -> chất lượng cao nhưng chậm
# nomic-embed-text -> nhanh hơn rất nhiều, đủ tốt cho RAG app
embeddings = OllamaEmbeddings(model="nomic-embed-text")

# -----------------------------
# Load / Build Vector DB
# -----------------------------
db_exists = os.path.exists(db_location)

vector_store = Chroma(
    collection_name="shinycloth_features",
    persist_directory=db_location,
    embedding_function=embeddings
)

if not db_exists:
    print("[INFO] Building vector database (one-time)...")

    documents = []
    ids = []

    for _, row in df.iterrows():
        content = (
            f"Object: {row['object']}\n"
            f"Feature: {row['feature']}\n"
            f"Descript: {row['descript']}\n"
            f"Manual: {row['manual']}"
        )

        documents.append(
            Document(
                page_content=content,
                metadata={
                    "id": row["id"],
                    "object": row["object"],
                    "feature": row["feature"],
                    "descript": row["descript"],
                    "manual": row["manual"],
                },
                id=str(row["id"])
            )
        )
        ids.append(str(row["id"]))

    vector_store.add_documents(documents=documents, ids=ids)
    print("[OK] Vector database built")

# -----------------------------
# Retriever (giảm k = nhanh hơn)
# -----------------------------
retriever = vector_store.as_retriever(
    search_kwargs={"k": 2}
)
