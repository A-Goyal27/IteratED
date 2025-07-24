#testpush
class Tutor:
    def __init__(self, question="", answer="", verificationMode=False, logLength=2): #there will be a new tutor for each question
        #the subclasses will have specific models

        # Initialize chat history
        self._chatHistory = []
        self._nSteps = 0
        
        self._lastResponse = "No initial model output yet"  # Placeholder for the first response
        self.lastSummary = "No initial summary yet"  # Placeholder for the first summary
        self._responseObject = None

        # Initialize current question and answer
        self.currentQuestion = question
        self.currentAnswer = answer
        
        self._initPrompt = self._loadPrompt("IteratED_Github/IteratED_AI/Prompts/InitPrompt.txt")
        #self._initPrompt = self._openFile("IteratED_Github/IteratED_AI/Prompts/InitPrompt.txt")
        #self._initPrompt = self._initPrompt.replace("[question]", self.currentQuestion)
        #self._initPrompt = self._initPrompt.replace("[answer]", self.currentAnswer)

        #verification mode
        self._verificationMode = verificationMode
        self._verificationPrompt = self._loadPrompt("IteratED_Github/IteratED_AI/Prompts/verificationModePrompt.txt")

        self.logLength = logLength #should be made longer for more complex problems
    
    def _generateResponse(self, contents):
        pass #Each specific model has their own response generation method, so this will be overridden

    def turnVerificationModeOn(self):
        self._verificationMode = True
        return
    def turnVerificationModeOff(self):
        self._verificationMode = False
        return

    def _openFile(self, filename):
        with open(filename, "r") as file:
            contents = file.read()
        return contents

    def _loadPrompt(self, filename): #I am doing this open file, replace QnA routine a lot, so this makes it easier
        prompt = self._openFile(filename)
        prompt = prompt.replace("[question]", self.currentQuestion)
        prompt = prompt.replace("[answer]", self.currentAnswer)
        return prompt
    
    def _addHistory(self, modelOutput, userInput):
        pair = (modelOutput, userInput) #ModelOutput-UserInput pairs are stored as tuples
        self._chatHistory.append(pair)
    
    def _summarizeHistory(self, chatHistory):
        contents = self._loadPrompt("IteratED_Github/IteratED_AI/Prompts/summaryPrompt.txt")

        contents += "Chat Log: " + self._createChatLog(self.logLength) #the number here is how many pairs to include, it can be changed later but less means less token usage
        contents += "Synopsis: " + (self.lastSummary or "")

        response = self._generateResponse(contents)
        
        self.lastSummary = response  # Store the last summary
        return response

    def _contextWindow(self, n=2):
        """
        Returns the last n pairs of user input and model output.
        If n is larger than the chat history, it returns the entire history.
        """
        if n > self._nSteps:
            return self._chatHistory
        else:
            return self._chatHistory[-n:]
        
    def _createChatLog(self, n=2):
        """
        Creates a chat log string from the chat history.
        The chat log is a concatenation of user inputs and model outputs.
        """
        history = self._contextWindow(n)
        chatLog = ""
        for modelOutput, userInput in history:
            chatLog += f"Model: {modelOutput}\nUser: {userInput}\n"
        return chatLog.strip()
    
    def _createContents(self, prompt):
        if self._nSteps == 0:
            # If this is the first step, use the initial prompt
            contents = "Context: " + self._initPrompt + "\nUser Input: " + prompt
        else:
            # If this is not the first step, use the chat history
            contents = self._initPrompt
            contents += "Here is a summary of the chat so far: " + (self._summarizeHistory(self._chatHistory) or "")
            contents += "\nHere is what the User Inputted: " + prompt
        
        return contents
    
    def chat(self, prompt):
        if self._verificationMode:
            response = self._generateResponse(self._verificationPrompt + "\n" + prompt)
            self._lastResponse = response
            return response
        self._addHistory(self._lastResponse, prompt)
        contents = self._createContents(prompt)

        response = self._generateResponse(contents)

        self._lastResponse = response
        self._nSteps += 1

        return response

from google import genai
from google.genai import types    
class TutorGemini(Tutor):
    def __init__(self, key, question="", answer=""):
        super().__init__(question, answer)

        #initialize Gemini client
        self._client = genai.Client(api_key=key)
    
    def _generateResponse(self, contents):
        response = self._client.models.generate_content(
            model="gemini-2.5-flash",
            contents=contents,
            config=types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(thinking_budget=-1) # Dynamic thinking budget
            ),
        )

        self._responseObject = response
        return response.text

import openai
from openai import OpenAI   
class TutorOpenAI(Tutor):
    def __init__(self, key, question="", answer=""):
        super().__init__(question, answer)
        
        # Initialize OpenAI client
        openai.api_key = key
        self._client = openai.Client()

    def _generateResponse(self, contents):
        response = self._client.responses.create(
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

        self._responseObject = response
        return response.output_text