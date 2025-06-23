import numpy as np
#test push 2.5

class Tutor:
    def __init__(self, question=None, answer=None): #there will be a new tutor for each question
        #the subclasses will have specific models

        # Initialize chat history
        self.chatHistory = []
        self.nSteps = len(self.chatHistory)

        # Initialize current question and answer
        self.currentQuestion = question
        self.currentAnswer = answer

        self.initPrompt =  """
        You are helping a user with a STEM question. 
        Here is the question: [question]. 
        Here is the answer to the question [answer]. 
        Help the user with the question, but when responding, respond in a friendly, socratic way. 
        That is, be nice while asking leading questions. 
        Never just give an answer, instead, prompt the user to think about things that help them reach the answer.
        """
        self.initPrompt = self.initPrompt.replace("[question]", self.currentQuestion)
        self.initPrompt = self.initPrompt.replace("[answer]", self.currentAnswer)

    def addHistory(self, userInput, modelOutput):
        pair = self.createPair(userInput, modelOutput)
        self.chatHistory.append(pair)
    def createPair(self, input, output):
        #UserInput-ModelOutput pairs are stored as tuples
        return (input, output)
    
    def summarizeHistory(self):
        pass

    def contextWindow(self, n=10):
        """
        Returns the last n pairs of user input and model output.
        If n is larger than the chat history, it returns the entire history.
        """
        if n > len(n.Steps):
            return self.chatHistory
        else:
            return self.chatHistory[-n:]
    def createContext(self):
        """
        Creates a context string from the chat history.
        The context is a concatenation of user inputs and model outputs.
        """
        history = self.contextWindow()

        context =   """
                    You are helping a user with a STEM question. 
                    The question is [question] and the answer is [answer]. 
                    Your role is to guide the user using a friendly, Socratic approach: 
                    ask thoughtful, leading questions that encourage the user to think and discover the answer themselves. 
                    Avoid giving direct answers. 
                    To keep your guidance fresh and non-repetitive, you'll also be given a chat log of prior interactions for context:
                    """
        context = context.replace("[question]", self.currentQuestion)
        context = context.replace("[answer]", self.currentAnswer)

        # Append each user input and model output to the context
        for userInput, modelOutput in history:
            context += f"User: {userInput}\nModel: {modelOutput}\n"
        return context.strip()
    
    def respond(self, prompt):
        """
        #pseudocode
        response = client.respond(prompt)
        return response
        """
        pass  # This method should be overridden by subclasses

from google import genai
from google.genai import types    
class TutorGemini(Tutor):
    def __init__(self, key, question=None, answer=None):
        super().__init__(question, answer)

        #initialize Gemini client
        self.client = genai.Client(api_key=key)

    def respond(self, prompt):
        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(thinking_budget=-1) # Dynamic thinking budget
            ),
        )

        self.addHistory(prompt, response.text)

        return response

import openai
from openai import OpenAI   
class TutorOpenAI(Tutor):
    def __init__(self, key, question=None, answer=None):
        super().__init__(question, answer)
        
        # Initialize OpenAI client
        openai.api_key = key
        self.client = openai.Client()

    def respond(self, prompt):
        response = self.client.responses.create(
        model="o4-mini",
        reasoning={"effort": "medium"},
        input=[
        {
            "role": "user", 
            "content": prompt
        }
        ],
        max_output_tokens=1000,  # Set a limit on the number of output tokens
        )
        self.addHistory(prompt, response.output_text)
        return response