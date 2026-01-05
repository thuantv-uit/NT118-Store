from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from vector import retriever
import uvicorn
import sys

# -----------------------------
# LLM CONFIG (NHANH)
# -----------------------------
MODEL_NAME = "qwen2.5:3b"

model = OllamaLLM(
    model=MODEL_NAME,
    temperature=0.3,      # thấp để bám sát instruction
    num_predict=256
)

# -----------------------------
# FALLBACK MESSAGE (GIỮ NGUYÊN Ý BẠN)
# -----------------------------
UNSUPPORTED_MESSAGE = (
    "The app does not support this feature yet, but it's under development.\n\n"
    "For example, you can ask:\n"
    "- How can users purchase a product?\n"
    "- If a user forgets their password, is there a way to recover it?\n"
    "- How does a seller list a new item?\n"
    "- What are the steps for a buyer to track an order?\n"
    "- How can a shipper accept a delivery job?"
)

# -----------------------------
# PROMPT (GIỮ NGHIỆP VỤ GỐC)
# -----------------------------
template = """
You are an expert advisor for the ShinyCloth e-commerce app.

Below are the ONLY app features you are allowed to use.
Each feature includes Object, Feature, Descript, and Manual.

{features}

STRICT RULES (IMPORTANT):
- If the user's question does NOT clearly relate to ANY Object or Feature above,
  reply EXACTLY with the following message and NOTHING else:
  "{unsupported_message}"

- If the question IS related:
  - Answer professionally as a ShinyCloth advisor
  - Use ONLY the Descript and Manual
  - Provide clear, numbered steps
  - Do NOT mention unrelated features
  - Do NOT invent any new functionality

User Question:
{question}

Answer:
"""

prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model | StrOutputParser()

# -----------------------------
# CORE LOGIC (QUAN TRỌNG NHẤT)
# -----------------------------
def handle_question(user_input: str) -> str:
    if not user_input.strip():
        return UNSUPPORTED_MESSAGE

    # 1️⃣ Semantic retrieve (hiểu từ đồng nghĩa)
    retrieved_docs = retriever.invoke(user_input)

    # 2️⃣ Nếu không retrieve được gì -> KHÔNG HỖ TRỢ
    if not retrieved_docs:
        return UNSUPPORTED_MESSAGE

    # 3️⃣ Build context cho LLM
    features_text = "\n\n".join(
        f"Object: {doc.metadata['object']}\n"
        f"Feature: {doc.metadata['feature']}\n"
        f"Descript: {doc.metadata['descript']}\n"
        f"Manual: {doc.metadata['manual']}"
        for doc in retrieved_docs
    )

    # 4️⃣ LLM quyết định cuối cùng (có guard bằng prompt)
    result = chain.invoke({
        "features": features_text,
        "question": user_input,
        "unsupported_message": UNSUPPORTED_MESSAGE
    })

    return f"ShinyCloth: {result}"

# -----------------------------
# API SCHEMA
# -----------------------------
class QuestionRequest(BaseModel):
    question: str

# -----------------------------
# FASTAPI APP
# -----------------------------
app = FastAPI(
    title="ShinyCloth Chatbot API",
    description="RAG-based chatbot with synonym understanding and strict fallback",
    version="1.2.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# WARM-UP (GIỮ NHANH)
# -----------------------------
@app.on_event("startup")
def warmup():
    try:
        model.invoke("hello")
        print(f"[OK] Warm-up {MODEL_NAME}")
    except Exception as e:
        print(f"[WARN] Warm-up failed: {e}")

# -----------------------------
# API ENDPOINT
# -----------------------------
@app.post("/ask")
async def ask_question(request: QuestionRequest):
    try:
        return {"response": handle_question(request.question)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# -----------------------------
# CLI MODE (GIỮ NGUYÊN)
# -----------------------------
def run_cli():
    print("ShinyCloth Chatbot CLI (q to quit)")
    while True:
        q = input("\nQuestion: ")
        if q.lower() == "q":
            break
        print(handle_question(q))

# -----------------------------
# ENTRY POINT
# -----------------------------
if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "--cli":
        run_cli()
    else:
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
