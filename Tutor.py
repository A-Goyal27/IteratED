import numpy as np
#test push

class Tutor:
    def __init__(self, question=None, answer=None): #there will be a new tutor for each question
        #the subclasses will have specific models

        # Initialize chat history
        self.chatHistory = []
        self.nSteps = len(self.chatHistory)

        # Initialize current question and answer
        self.currentQuestion = question
        self.currentAnswer = answer

    def addHistory(self, input, output):
        pair = self.createPair(input, output)
        self.chatHistory.append(pair)
    def createPair(self, input, output):
        #UserInput-ModelOutput pairs are stored as tuples
        return (input, output)
    
    def summarizeHistory(self):
        pass
    
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
        return response