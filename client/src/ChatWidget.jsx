import { useState } from 'react'
import './ChatWidget.css'

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="chat-widget">
      {/* Chat popup */}
      {isOpen && (
        <div className="chat-popup">
          <div className="chat-header">
            <h3>Chat with us</h3>
            <button className="close-btn" onClick={toggleChat}>
              ×
            </button>
          </div>
          
          <div className="chat-messages">
            <div className="message bot-message">
              <div className="message-content">
                Hi there! Welcome to Cozy Beans Café! How can I help you today?
              </div>
            </div>
            <div className="message user-message">
              <div className="message-content">
                What are your opening hours?
              </div>
            </div>
          </div>
          
          <div className="chat-input">
            <input 
              type="text" 
              placeholder="Type your message..." 
              className="message-input"
            />
            <button className="send-btn">Send</button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button className="chat-toggle" onClick={toggleChat}>
        {isOpen ? '×' : '💬'}
      </button>
    </div>
  )
}

export default ChatWidget