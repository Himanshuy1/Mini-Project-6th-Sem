import React, { useState, useRef, useEffect } from 'react';

const SUGGESTED_QUERIES = [
  "What is the current status of the Ukraine-Russia conflict?",
  "Analyze Israel-Gaza escalation risks",
  "What weapons systems are decisive in modern warfare?",
  "Assess Taiwan Strait military tensions",
  "How is the Red Sea crisis affecting global trade?",
  "What is NATO's posture in the Baltic region?",
];

const TypingIndicator = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '10px 14px' }}>
    {[0, 1, 2].map(i => (
      <div key={i} style={{
        width: '6px', height: '6px', borderRadius: '50%',
        background: 'var(--text-neon-amber)',
        animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`
      }} />
    ))}
    <style>{`@keyframes pulse { 0%,80%,100%{opacity:0.2;transform:scale(0.8)} 40%{opacity:1;transform:scale(1)} }`}</style>
  </div>
);

const Message = ({ msg }) => {
  const isUser = msg.role === 'user';

  // Parse ASSESSMENT: / DETAIL: structure
  let content = msg.content;
  let assessment = null;
  let detail = null;
  if (!isUser && content.includes('ASSESSMENT:')) {
    const parts = content.split(/DETAIL:/i);
    assessment = parts[0].replace(/ASSESSMENT:/i, '').trim();
    detail = parts[1]?.trim() || null;
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '12px',
      gap: '4px'
    }}>
      {/* Role label */}
      <span style={{
        fontSize: '8px',
        letterSpacing: '1.5px',
        color: 'var(--text-dim)',
        fontFamily: 'var(--font-hud)',
        paddingLeft: isUser ? 0 : '2px',
        paddingRight: isUser ? '2px' : 0
      }}>
        {isUser ? 'OPERATOR' : '● SENTINEL-7'}
      </span>

      <div style={{
        maxWidth: '92%',
        padding: '10px 14px',
        borderRadius: isUser ? '10px 10px 2px 10px' : '2px 10px 10px 10px',
        background: isUser
          ? 'linear-gradient(135deg, rgba(255,51,102,0.2), rgba(255,51,102,0.1))'
          : 'rgba(255,255,255,0.04)',
        border: `1px solid ${isUser ? 'rgba(255,51,102,0.3)' : 'rgba(255,255,255,0.07)'}`,
        backdropFilter: 'blur(4px)',
        fontSize: '11.5px',
        lineHeight: '1.7',
        color: isUser ? 'rgba(255,255,255,0.9)' : 'var(--text-main)',
        fontFamily: 'var(--font-body)',
        wordBreak: 'break-word'
      }}>
        {assessment ? (
          <>
            <div style={{
              fontSize: '10px',
              color: 'var(--text-neon-amber)',
              fontFamily: 'var(--font-hud)',
              letterSpacing: '1px',
              marginBottom: '6px',
              fontWeight: 'bold'
            }}>▸ ASSESSMENT</div>
            <div style={{ color: 'white', marginBottom: detail ? '10px' : 0, fontWeight: '500' }}>
              {assessment}
            </div>
            {detail && (
              <>
                <div style={{
                  fontSize: '10px',
                  color: 'var(--text-neon-green)',
                  fontFamily: 'var(--font-hud)',
                  letterSpacing: '1px',
                  marginBottom: '6px',
                  fontWeight: 'bold',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  paddingTop: '8px'
                }}>▸ DETAIL</div>
                <div style={{ color: 'rgba(255,255,255,0.85)' }}>{detail}</div>
              </>
            )}
          </>
        ) : (
          content
        )}
      </div>
    </div>
  );
};

const GrokChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'ASSESSMENT: SENTINEL-7 online. Global intelligence stream active.\nDETAIL: I have access to real-time geopolitical analysis, active conflict monitoring, and military intelligence. Query me on any ongoing conflict, escalation risk, weapons system, or global security event.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 300);
  }, [isOpen]);

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    const userMsg = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content }))
        })
      });
      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `ASSESSMENT: Communication error.\nDETAIL: ${data.message || 'Unable to reach SENTINEL-7 intelligence core.'}`
        }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'ASSESSMENT: Network failure detected.\nDETAIL: Backend connection lost. Verify server status at port 5000.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: 'ASSESSMENT: Session cleared. SENTINEL-7 ready for new query stream.\nDETAIL: All previous conversation data purged. Intelligence core is standing by.'
    }]);
  };

  return (
    <>
      {/* Slide-in Panel */}
      <div style={{
        position: 'fixed',
        top: 0,
        right: isOpen ? 0 : '-420px',
        width: '420px',
        height: '100vh',
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(8,10,16,0.98)',
        borderLeft: '1px solid rgba(255,51,102,0.25)',
        boxShadow: isOpen ? '-20px 0 60px rgba(255,51,102,0.08)' : 'none',
        transition: 'right 0.35s cubic-bezier(0.4,0,0.2,1)',
        backdropFilter: 'blur(20px)',
        pointerEvents: 'auto'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255,51,102,0.04)',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* AI Icon */}
            <div style={{
              width: '34px', height: '34px', borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(255,51,102,0.3), rgba(255,170,0,0.2))',
              border: '1px solid rgba(255,51,102,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px'
            }}>🛡️</div>
            <div>
              <div className="hud-text" style={{ fontSize: '13px', fontWeight: 'bold', color: 'white', letterSpacing: '1px' }}>
                SENTINEL-7
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                <div className="blink" style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--text-neon-green)' }} />
                <span style={{ fontSize: '9px', color: 'var(--text-neon-green)', fontFamily: 'var(--font-hud)', letterSpacing: '1px' }}>
                  LLAMA-3.3 · ONLINE
                </span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={clearChat} title="Clear chat" style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'var(--text-dim)',
              padding: '4px 10px',
              cursor: 'pointer',
              fontSize: '9px',
              fontFamily: 'var(--font-hud)',
              borderRadius: '3px',
              letterSpacing: '1px',
              transition: 'all 0.2s ease'
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,51,102,0.4)'; e.currentTarget.style.color = 'var(--text-neon-red)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text-dim)'; }}
            >CLEAR</button>
            <button onClick={() => setIsOpen(false)} style={{
              background: 'rgba(255,51,102,0.1)',
              border: '1px solid rgba(255,51,102,0.3)',
              color: 'var(--text-neon-red)',
              width: '28px', height: '28px',
              cursor: 'pointer',
              fontSize: '14px',
              borderRadius: '4px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease'
            }}
              onMouseOver={e => { e.currentTarget.style.background = 'var(--text-neon-red)'; e.currentTarget.style.color = 'black'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,51,102,0.1)'; e.currentTarget.style.color = 'var(--text-neon-red)'; }}
            >✕</button>
          </div>
        </div>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 16px 8px',
          display: 'flex',
          flexDirection: 'column',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,51,102,0.2) transparent'
        }}>
          {messages.map((msg, idx) => (
            <Message key={idx} msg={msg} />
          ))}
          {loading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Queries */}
        {messages.length <= 1 && !loading && (
          <div style={{ padding: '0 16px 12px', flexShrink: 0 }}>
            <div style={{ fontSize: '9px', color: 'var(--text-dim)', fontFamily: 'var(--font-hud)', letterSpacing: '1px', marginBottom: '8px' }}>
              SUGGESTED QUERIES
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {SUGGESTED_QUERIES.map((q, i) => (
                <button key={i} onClick={() => sendMessage(q)} style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: 'rgba(255,255,255,0.6)',
                  padding: '7px 10px',
                  cursor: 'pointer',
                  fontSize: '10px',
                  textAlign: 'left',
                  borderRadius: '4px',
                  fontFamily: 'var(--font-body)',
                  transition: 'all 0.2s ease',
                  lineHeight: '1.3'
                }}
                  onMouseOver={e => { e.currentTarget.style.background = 'rgba(255,51,102,0.08)'; e.currentTarget.style.borderColor = 'rgba(255,51,102,0.25)'; e.currentTarget.style.color = 'white'; }}
                  onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; }}
                >
                  <span style={{ color: 'var(--text-neon-amber)', marginRight: '6px' }}>›</span>{q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div style={{
          padding: '12px 16px 16px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
          background: 'rgba(255,255,255,0.01)'
        }}>
          <div style={{
            display: 'flex', gap: '8px', alignItems: 'flex-end',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,51,102,0.2)',
            borderRadius: '6px',
            padding: '8px 12px',
            transition: 'border-color 0.2s ease'
          }}
            onFocusCapture={e => e.currentTarget.style.borderColor = 'rgba(255,51,102,0.5)'}
            onBlurCapture={e => e.currentTarget.style.borderColor = 'rgba(255,51,102,0.2)'}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Query SENTINEL-7 intelligence core..."
              rows={1}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'white',
                fontSize: '12px',
                fontFamily: 'var(--font-body)',
                resize: 'none',
                lineHeight: '1.5',
                maxHeight: '80px',
                overflowY: 'auto',
                caretColor: 'var(--text-neon-red)',
                scrollbarWidth: 'none'
              }}
              onInput={e => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 80) + 'px';
              }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              style={{
                background: loading || !input.trim()
                  ? 'rgba(255,255,255,0.05)'
                  : 'linear-gradient(135deg, #ff3366, #ff8800)',
                border: 'none',
                borderRadius: '4px',
                width: '32px', height: '32px',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
            >
              {loading ? '⏳' : '➤'}
            </button>
          </div>
          <div style={{ fontSize: '9px', color: 'var(--text-dim)', marginTop: '6px', fontFamily: 'var(--font-hud)', textAlign: 'center', letterSpacing: '0.5px' }}>
            POWERED BY GROK-3 · ENTER TO SEND · SHIFT+ENTER FOR NEW LINE
          </div>
        </div>
      </div>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        style={{
          position: 'fixed',
          right: isOpen ? '420px' : '0',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 501,
          background: isOpen
            ? 'rgba(255,51,102,0.15)'
            : 'linear-gradient(180deg, rgba(255,51,102,0.9), rgba(180,20,60,0.9))',
          border: '1px solid rgba(255,51,102,0.5)',
          borderRight: isOpen ? '1px solid rgba(255,51,102,0.5)' : 'none',
          color: 'white',
          cursor: 'pointer',
          width: '28px',
          padding: '18px 0',
          borderRadius: isOpen ? '6px 0 0 6px' : '6px 0 0 6px',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          fontSize: '10px',
          fontFamily: 'var(--font-hud)',
          letterSpacing: '2px',
          transition: 'all 0.35s cubic-bezier(0.4,0,0.2,1)',
          boxShadow: isOpen ? 'none' : '-4px 0 20px rgba(255,51,102,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0',
          pointerEvents: 'auto'
        }}
        title="Open SENTINEL-7 Intelligence Chatbot"
      >
        {isOpen ? '✕ CLOSE' : '🛡 SENTINEL'}
      </button>

      {/* Overlay backdrop when open on mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            zIndex: 499,
            background: 'rgba(0,0,0,0.3)',
            backdropFilter: 'blur(2px)',
            pointerEvents: 'auto'
          }}
        />
      )}
    </>
  );
};

export default GrokChatbot;
