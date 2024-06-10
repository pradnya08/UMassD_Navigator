#This will be the chatbot
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_community.document_loaders import WebBaseLoader
from langchain_community.document_loaders.recursive_url_loader import RecursiveUrlLoader
from bs4 import BeautifulSoup as Soup
from langchain_openai import OpenAIEmbeddings
import os
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain



def setup_bot():
  llm = ChatOpenAI(openai_api_key="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")
  prompt = ChatPromptTemplate.from_messages([
    ("system", "You are world class technical documentation writer."),
    ("user", "{input}")
  ])
  output_parser = StrOutputParser()
  chain = prompt | llm | output_parser
  loader = RecursiveUrlLoader(url="https://www.umassd.edu/engineering/cis/", max_depth=5, extractor=lambda x: Soup(x, "html.parser").text)

  docs = loader.load()
  os.environ ["OPENAI_API_KEY"] = "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"
  embeddings = OpenAIEmbeddings()
  text_splitter = RecursiveCharacterTextSplitter()
  documents = text_splitter.split_documents(docs)
  vector = FAISS.from_documents(documents, embeddings)

  
  prompt = ChatPromptTemplate.from_template("""Answer the following question based only on the provided context:

  <context>
  {context}
  </context>

  Question: {input}""")

  document_chain = create_stuff_documents_chain(llm, prompt)
  retriever = vector.as_retriever()
  global retrieval_chain
  retrieval_chain= create_retrieval_chain(retriever, document_chain)

def ask_bot(input):
  # Example question: "What are all the graduate level courses? List them"
  response = retrieval_chain.invoke({"input": input})
  return response["answer"]
