'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, BookOpen, Settings, Sparkles, Menu, X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'tutor';
  timestamp: Date;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          question: question,
          answer: answer,
          sessionId: Date.now().toString(),
          model_type: "gemini", // or "openai"
          api_key: "", // Add your API key here or use environment variables
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        const tutorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: data.message,
          sender: 'tutor',
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, tutorMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error. Please try again.",
        sender: 'tutor',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartSession = () => {
    if (!question.trim() || !answer.trim()) return;
    
    setIsSessionStarted(true);
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: `Welcome to IteratED! I'm here to help you with your question: "${question}". Let's work through this together using the Socratic method. What would you like to start with?`,
      sender: 'tutor',
      timestamp: new Date(),
    };
    setMessages([welcomeMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 shadow-sm">
        <div className="flex items-center justify-between max-w-none mx-auto">
          {/* Left side - Course Name */}
          <div className="flex items-center">
            <div className="text-lg font-semibold text-gray-800 tracking-wide">
              Course Name
            </div>
          </div>
          
          {/* Right side - Student Name and Settings */}
          <div className="flex items-center space-x-4 lg:space-x-6">
            <div className="text-right">
              <span className="text-lg font-semibold text-gray-800 tracking-wide">Student Name</span>
            </div>
            <button className="flex items-center space-x-2 p-3 text-gray-600 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-all duration-200">
              <Settings className="w-5 h-5" />
              <span className="text-lg font-semibold tracking-wide">Settings</span>
            </button>
          </div>
        </div>
      </header>

      {/* Second Header Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 lg:px-8 py-10 shadow-md">
        <div className="max-w-none mx-auto flex items-center justify-between">
          {/* Left side - Menu button and Assignment Name */}
          <div className="flex items-center space-x-4 lg:space-x-8">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="text-white hover:text-blue-200 transition-colors duration-200 p-2"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <span className="text-white text-lg font-semibold">Assignment Name</span>
          </div>
          
          {/* Center - Problem number and part info with navigation */}
          <div className="flex items-center space-x-6 lg:space-x-10">
            {/* Previous button */}
            <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border border-blue-400">
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {/* Problem info */}
            <div className="flex flex-col items-center text-center">
              <span className="text-white text-xl font-semibold">Problem #</span>
              <span className="text-white text-sm font-normal mt-1">Part 1 of X</span>
            </div>
            
            {/* Next button */}
            <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg border border-blue-400">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          
          {/* Right side - Points and Save & Exit button */}
          <div className="flex items-center space-x-8 lg:space-x-12">
            <span className="text-white text-lg font-semibold">(-/X points)</span>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-50 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 border border-blue-200 transform">
              Save & Exit
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className={`fixed inset-0 z-50 flex transition-opacity duration-300 ease-in-out ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black transition-opacity duration-300 ease-in-out ${isSidebarOpen ? 'opacity-50' : 'opacity-0'}`}
          onClick={() => setIsSidebarOpen(false)}
        ></div>
        
        {/* Sidebar */}
        <div className={`relative w-80 bg-white shadow-2xl h-full flex flex-col transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 flex-shrink-0">
            <h2 className="text-xl font-semibold text-gray-900">Problems</h2>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          {/* Sidebar Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-3">
              {/* Homework problems 1-15 */}
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                <h3 className="font-medium text-gray-900">Problem 1</h3>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                <h3 className="font-medium text-gray-900">Problem 2</h3>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                <h3 className="font-medium text-gray-900">Problem 3</h3>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                <h3 className="font-medium text-gray-900">Problem 4</h3>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                <h3 className="font-medium text-gray-900">Problem 5</h3>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                <h3 className="font-medium text-gray-900">Problem 6</h3>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                <h3 className="font-medium text-gray-900">Problem 7</h3>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                <h3 className="font-medium text-gray-900">Problem 8</h3>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                <h3 className="font-medium text-gray-900">Problem 9</h3>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                <h3 className="font-medium text-gray-900">Problem 10</h3>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                <h3 className="font-medium text-gray-900">Problem 11</h3>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                <h3 className="font-medium text-gray-900">Problem 12</h3>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                <h3 className="font-medium text-gray-900">Problem 13</h3>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                <h3 className="font-medium text-gray-900">Problem 14</h3>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-200">
                <h3 className="font-medium text-gray-900">Problem 15</h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`max-w-none mx-auto p-4 lg:p-8 ${isFullScreen ? 'hidden' : ''}`}>
        <div className="flex flex-col space-y-4 lg:space-y-6">
          {/* Question Section */}
          <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
            <div className="space-y-3">
              <div>
                <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                  Question or Problem
                </label>
                <textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Enter the question or problem you need help with..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  rows={2}
                />
              </div>

              <div>
                <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Answer (Optional)
                </label>
                <textarea
                  id="answer"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="If you have an answer, enter it here. If not, leave blank and we'll work through it together."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  rows={2}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleStartSession}
                  disabled={!question.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
                >
                  {isSessionStarted ? 'Session Active' : 'Start Learning Session'}
                </button>

                {isSessionStarted && (
                  <button
                    onClick={() => {
                      setIsSessionStarted(false);
                      setMessages([]);
                      setQuestion('');
                      setAnswer('');
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 text-sm"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="bg-white rounded-2xl shadow-xl flex flex-col h-[calc(100vh-280px)]">
            {/* Chat Header */}
            <div className="border-b border-gray-200 px-8 lg:px-10 py-6 flex items-center justify-between flex-shrink-0">
              <div>
                <h3 className="font-semibold text-gray-900">
                  {isSessionStarted ? 'Tutoring Session' : 'Chat Interface'}
                </h3>
                <p className="text-sm text-gray-500">
                  {isSessionStarted 
                    ? `Question: "${question}"` 
                    : 'Start a session to begin chatting with your AI tutor'
                  }
                </p>
              </div>
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                title={isFullScreen ? 'Exit Full Screen' : 'Enter Full Screen'}
              >
                {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-6 min-h-0">
              {!isSessionStarted ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-gray-500">
                    <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">Welcome to IteratED!</p>
                    <p className="text-sm">Enter a question above to start learning.</p>
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`flex items-start space-x-3 max-w-[80%] ${
                          message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                            message.sender === 'user'
                              ? 'bg-blue-500'
                              : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                          }`}
                        >
                          {message.sender === 'user' ? (
                            <User className="w-4 h-4 text-white" />
                          ) : (
                            <Bot className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div
                          className={`px-4 py-3 rounded-2xl ${
                            message.sender === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-50 text-gray-900 border border-gray-200'
                          }`}
                        >
                          <p className="whitespace-pre-wrap text-sm">
                            {message.content}
                          </p>
                          <p
                            className={`text-xs mt-2 ${
                              message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                          <Bot className="w-4 h-4 text-white" />
                        </div>
                        <div className="bg-gray-50 text-gray-900 border border-gray-200 px-4 py-3 rounded-2xl">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input */}
            {isSessionStarted && (
              <div className="border-t border-gray-200 bg-white p-8 lg:p-10 flex-shrink-0">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <textarea
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message here..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      rows={1}
                      disabled={isLoading}
                    />
                  </div>
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim() || isLoading}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={`bg-gradient-to-r from-blue-600 to-indigo-700 px-4 lg:px-8 py-10 shadow-md mt-8 ${isFullScreen ? 'hidden' : ''}`}>
        <div className="max-w-none mx-auto flex items-center justify-between">
          {/* Left side - Additional Materials */}
          <div className="flex items-center space-x-4 lg:space-x-8">
            <span className="text-white text-lg font-semibold underline cursor-pointer hover:text-blue-200 transition-colors duration-200">
              Additional Materials
            </span>
          </div>
          
          {/* Right side - Next button */}
          <div className="flex items-center">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-50 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 border border-blue-200 transform">
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Full Screen Chat Interface */}
      {isFullScreen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in fade-in-0 zoom-in-95 duration-300 ease-out">
          {/* Chat Header */}
          <div className="border-b border-gray-200 px-8 lg:px-10 py-6 flex items-center justify-between flex-shrink-0">
            <div>
              <h3 className="font-semibold text-gray-900">
                {isSessionStarted ? 'Tutoring Session' : 'Chat Interface'}
              </h3>
              <p className="text-sm text-gray-500">
                {isSessionStarted 
                  ? `Question: "${question}"` 
                  : 'Start a session to begin chatting with your AI tutor'
                }
              </p>
            </div>
            <button
              onClick={() => setIsFullScreen(false)}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              title="Exit Full Screen"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-6 min-h-0">
            {!isSessionStarted ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">Welcome to IteratED!</p>
                  <p className="text-sm">Enter a question above to start learning.</p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex items-start space-x-3 max-w-[80%] ${
                        message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.sender === 'user'
                            ? 'bg-blue-500'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                        }`}
                      >
                        {message.sender === 'user' ? (
                          <User className="w-4 h-4 text-white" />
                        ) : (
                          <Bot className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          message.sender === 'user'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-50 text-gray-900 border border-gray-200'
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm">
                          {message.content}
                        </p>
                        <p
                          className={`text-xs mt-2 ${
                            message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                          }`}
                        >
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gray-50 text-gray-900 border border-gray-200 px-4 py-3 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Input */}
          {isSessionStarted && (
            <div className="border-t border-gray-200 bg-white p-8 lg:p-10 flex-shrink-0">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <textarea
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message here..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={1}
                    disabled={isLoading}
                  />
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
