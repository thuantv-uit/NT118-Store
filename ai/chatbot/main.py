from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_ollama.llms import OllamaLLM
from langchain_core.prompts import ChatPromptTemplate
from vector import retriever
from langchain_core.output_parsers import StrOutputParser
import uvicorn
import sys

# Initialize model
model = OllamaLLM(model="llama3")

template = """
You are an expert advisor for ShinyCloth, an e-commerce app. Your role is to guide users professionally and helpfully on app features.

Here are the relevant features retrieved from the database (each includes Object/role, Feature, Descript, and Manual instructions):
{features}

Guidelines for responding:
- First, check if the question relates to any 'Object' in the retrieved features. If no matching Object, respond with: "The app does not support this feature yet, but it's under development. For example, you can ask: 'How can users purchase a product?', 'If a user forgets their password, is there a way to recover it?', 'How does a seller list a new item?', 'What are the steps for a buyer to track an order?', or 'How can a shipper accept a delivery job?'"
- If it relates to an Object, then check if it matches any 'Feature' in the retrieved ones. If no exact or close match, respond with the same message as above.
- If it matches, provide a helpful answer based ONLY on the Descript and Manual of that feature. 
  - Start your response professionally as a customer advisor: e.g., "As your ShinyCloth advisor, let me guide you through this step by step."
  - Structure the core response as clear, numbered steps: "Step 1: [clear action]", "Step 2: [next action]", etc. Base the steps primarily on the Manual instructions. If Manual is short or absent, derive logical steps from Descript.
  - Keep steps concise, actionable, and user-friendly. Do NOT mention or list any other features.
- Always keep responses concise, accurate, and focused strictly on the user's question. Use the provided features only; do not invent new ones. No extra introductions or explanations.

Question: {question}

Answer:
"""
prompt = ChatPromptTemplate.from_template(template)
chain = prompt | model | StrOutputParser()

def handle_question(user_input: str) -> str:
    """
    Handle a single question input: Retrieve relevant features and invoke RAG chain.
    """
    if not user_input.strip():
        return "No input provided."

    # Retrieve relevant features
    retrieved_docs = retriever.invoke(user_input)
    features_text = "\n\n".join([
        f"ID: {doc.metadata['id']}\nObject: {doc.metadata['object']}\nFeature: {doc.metadata['feature']}\nDescript: {doc.metadata['descript']}\nManual: {doc.metadata['manual']}"
        for doc in retrieved_docs
    ])

    result = chain.invoke({
        "features": features_text,
        "question": user_input
    })
    return f"ShinyCloth: {result}"  # Add prefix for ShinyCloth-style response

# Pydantic model for request body
class QuestionRequest(BaseModel):
    question: str

# FastAPI app
app = FastAPI(title="ShinyCloth Chatbot API", description="API for ShinyCloth e-commerce features Q&A", version="1.0.0")

# CORS middleware (giữ nguyên)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cho test: tất cả origins. Production: ["http://yourdomain.com"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/ask", response_model=dict)
async def ask_question(request: QuestionRequest):
    """
    Ask a question about ShinyCloth app features.
    """
    try:
        response = handle_question(request.question)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing question: {str(e)}")

# CLI fallback (original behavior if no args)
def run_question_chatbot():
    print("ShinyCloth App Chatbot: Ask about app features. Type 'q' to quit.")
    while True:
        print("\n-------------------------------")
        question = input("Ask your question about the ShinyCloth app (q to quit): ")
        print("\n")
        if question.lower() == "q":
            break
        response = handle_question(question)
        print(response)

if __name__ == "__main__":
    # Check if running as API server (default) or CLI
    if len(sys.argv) > 1 and sys.argv[1] == "--cli":
        run_question_chatbot()
    else:
        # Run FastAPI server on port 8000 với import string để fix reload warning
        uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)  # reload=True for dev