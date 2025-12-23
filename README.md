# Overview
IteratED is a web-based homework platform designed to extend teachers' learning and help students understand difficult concepts through an integrated AI tutor. The AI tutor uses a socratic method to guide students to understand problems for themselves.

The AI tutor has a prototype, while the website is still in development. We plan to continue development and testing soon.

# AI Tutor
The AI tutor requires an LLM API key. The LLM is then given internal prompts that guide its response and method. 

Currently, the AI can only be used within Python. The AI currently supports OpenAI and Gemini API Keys. 
To create an OpenAI AI tutor: ''' tutor = TutorOpenAI(API_KEY, initial_question, initial_answer) '''
To create a Gemini AI tutor: ''' tutor = TutorGemini(API_KEY, initial_question, initial_answer) '''

To start interacting with the tutor, use something similar to the following code:
'''
prompt = input("Enter your question (or type "quit" to exit): ")
while prompt.lower() != "quit":
  response = tutor.chat(prompt)
  print(response)
  prompt = input("Enter your question (or type "quit" to exit): ")
'''
