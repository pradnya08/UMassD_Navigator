#This will be the chatbot
import os
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.document_loaders.recursive_url_loader import RecursiveUrlLoader
from bs4 import BeautifulSoup as Soup
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain.chains import create_retrieval_chain
from langchain_core.prompts import MessagesPlaceholder
from langchain.chains import create_history_aware_retriever
from langchain_google_firestore import FirestoreChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_core.chat_history import BaseChatMessageHistory
from firebase_admin import credentials, firestore, initialize_app
from langchain_community.document_loaders.merge import MergedDataLoader

def setup_bot():
  llm = ChatOpenAI(temperature=0, model="gpt-3.5-turbo-1106", openai_api_key=os.environ["OPENAI_API_KEY"])
  loader_cis = RecursiveUrlLoader(url="https://www.umassd.edu/engineering/cis/", max_depth=10, extractor=lambda x: Soup(x, "html.parser").text)
  loader_calendar = RecursiveUrlLoader(url="https://www.umassd.edu/academiccalendar/", max_depth=5, extractor=lambda x: Soup(x, "html.parser").text)

  loader_all = MergedDataLoader(loaders=[loader_cis, loader_calendar])

  docs = loader_all.load()
  embeddings = OpenAIEmbeddings(model='text-embedding-3-small')
  text_splitter = RecursiveCharacterTextSplitter()
  documents = text_splitter.split_documents(docs)
  vector = FAISS.from_documents(documents, embeddings)
  retriever = vector.as_retriever()

  
  contextualize_q_system_prompt = (
    """
    Given a chat history and the latest user question
    which might reference context in the chat history, formulate a standalone question
    which can be understood without the chat history. Do NOT answer the question,
    just reformulate it if needed and otherwise return it as is.
    """
  )

  contextualize_q_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", contextualize_q_system_prompt),
        MessagesPlaceholder("chat_history"),
        ("human", "{input}"),
    ]
  )

  history_aware_retriever = create_history_aware_retriever(
    llm, retriever, contextualize_q_prompt
  )
  system_prompt = (
    """
    You are an assistant for question-answering tasks of University of Massachusetts Dartmouth also called UmassD or UMASSD or uMASSD.
    Use the following pieces of retrieved context to answer the question. If you don't know the answer, say that you don't know.

    If asked for contact information provide phone numbers and email addresses.
    
    If you are answering bullet points or a list of items can you add them in a list one after the other and make subsections if necessary
    Provide a conversational answer with a hyperlink whenever neccessary to the right source. You should only use hyperlinks that are explicitly listed as a source in the context.
    Do NOT make up a hyperlink that is not listed. The links should only be found as hyperlinks in the context.
    
    If the provided context does not have a hyperlink to a resource then say you cannot list the source of that resource.

    If the questions ask about dates without specific session provide the most recent one which is Fall 2024. You are in the year 2024, so provide answers to the most recent information in the context.
    The link to the calendar is https://www.umassd.edu/academiccalendar, if asked about any of the dates, mention the session and the date. 

    \n\n
    {context}
    Answer in Markdown:
                   """
  )
  qa_prompt = ChatPromptTemplate.from_messages(
      [
          ("system", system_prompt),
          MessagesPlaceholder("chat_history"),
          ("human", "{input}"),
      ]
  )
  question_answer_chain = create_stuff_documents_chain(llm, qa_prompt)

  global rag_chain
  rag_chain = create_retrieval_chain(history_aware_retriever, question_answer_chain)

  # Setup Firebase
  cred_path = os.environ["FIREBASE_ADMIN_CREDS"]
  cred = credentials.Certificate(cred_path)
  initialize_app(cred)
  global db
  db = firestore.client()



def ask_bot(input, session_id):

  def get_session_history(session_id: str) -> BaseChatMessageHistory:
    chat_history = FirestoreChatMessageHistory(
      client=db,
      session_id=session_id, collection="history"
    )
    return chat_history

  conversational_rag_chain = RunnableWithMessageHistory(
    rag_chain,
    get_session_history,
    input_messages_key="input",
    history_messages_key="chat_history",
    output_messages_key="answer",
  )

  response = conversational_rag_chain.invoke({"input": input},config={
        "configurable": {"session_id": session_id}
    })
  return response["answer"]
