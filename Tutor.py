class Tutor:
    def __init__(self, question="", answer=""): #there will be a new tutor for each question
        #the subclasses will have specific models

        # Initialize chat history
        self.chatHistory = []
        self.nSteps = 0
        self.correctAnswers = []

        # Initialize current question and answer
        self.currentQuestion = question
        self.currentAnswer = answer
        
        self.initPrompt = self.openFile("IteratED_Github/Prompts/InitPrompt.txt")

        self.initPrompt = self.initPrompt.replace("[question]", self.currentQuestion)
        self.initPrompt = self.initPrompt.replace("[answer]", self.currentAnswer)

        self.lastResponse = "No initial model output yet"  # Placeholder for the first response
        self.lastSummary = "No initial summary yet"  # Placeholder for the first summary
        self.responseObject = ""
    
    def generateResponse(self, contents):
        pass #Each specific model has their own response generation method, so this will be overridden

    def openFile(self, filename):
        with open(filename, "r") as file:
            contents = file.read()
        return contents
    
    def addHistory(self, modelOutput, userInput):
        pair = (modelOutput, userInput) #ModelOutput-UserInput pairs are stored as tuples
        self.chatHistory.append(pair)
    
    def summarizeHistory(self, chatHistory):
        contents = self.openFile("IteratED_Github/Prompts/summaryPrompt.txt")
        contents = contents.replace("[question]", self.currentQuestion)
        contents = contents.replace("[answer]", self.currentAnswer)

        contents += "Chat Log: " + self.createChatLog(2) #the number here is how many pairs to include, it can be changed later but less means less token usage
        contents += "Synopsis: " + (self.lastSummary or "")

        response = self.generateResponse(contents)
        
        self.lastSummary = response  # Store the last summary
        return response

    def contextWindow(self, n=20):
        """
        Returns the last n pairs of user input and model output.
        If n is larger than the chat history, it returns the entire history.
        """
        if n > self.nSteps:
            return self.chatHistory
        else:
            return self.chatHistory[-n:]
        
    def createChatLog(self, n=20):
        """
        Creates a chat log string from the chat history.
        The chat log is a concatenation of user inputs and model outputs.
        """
        history = self.contextWindow(n)
        chatLog = ""
        for modelOutput, userInput in history:
            chatLog += f"Model: {modelOutput}\nUser: {userInput}\n"
        return chatLog.strip()
    
    def createContents(self, prompt):
        if self.nSteps == 0:
            # If this is the first step, use the initial prompt
            contents = "Context: " + self.initPrompt + "\nUser Input: " + prompt
        else:
            # If this is not the first step, use the chat history
            contents = self.initPrompt
            contents += "Here is a summary of the chat so far: " + (self.summarizeHistory(self.chatHistory) or "")
            contents += "\nHere is what the User Inputted: " + prompt
        
        return contents
    
    def chat(self, prompt):
        self.addHistory(self.lastResponse, prompt)
        contents = self.createContents(prompt)

        response = self.generateResponse(contents)

        self.lastResponse = response
        self.nSteps += 1

        return response

from google import genai
from google.genai import types    
class TutorGemini(Tutor):
    def __init__(self, key, question="", answer=""):
        super().__init__(question, answer)

        #initialize Gemini client
        self.client = genai.Client(api_key=key)
    
    def generateResponse(self, contents):
        response = self.client.models.generate_content(
            model="gemini-2.5-flash",
            contents=contents,
            config=types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(thinking_budget=-1) # Dynamic thinking budget
            ),
        )

        self.responseObject = response
        return response.text

import openai
from openai import OpenAI   
class TutorOpenAI(Tutor):
    def __init__(self, key, question="", answer=""):
        super().__init__(question, answer)
        
        # Initialize OpenAI client
        openai.api_key = key
        self.client = openai.Client()

    def generateResponse(self, contents):
        response = self.client.responses.create(
        model="o4-mini",
        reasoning={"effort": "medium"},
        input=[
        {
            "role": "user", 
            "content": contents
        }
        ],
        max_output_tokens=1000,  # Set a limit on the number of output tokens
        )

        self.responseObject = response
        return response.output_text