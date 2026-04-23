'use client';

import { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';

interface Question {
  id: number;
  content: string;
  correct_answer: string;
  solution: string;
  difficulty: number;
  knowledge_tags: string[];
  hints: string[];
  common_mistakes: string[];
}

interface Message {
  role: 'system' | 'student' | 'ai' | 'ai-diagnosis' | 'ai-step' | 'ai-success';
  text: string;
}

export default function LearnPage({ params }: { params: Promise<{ questionId: string }> }) {
  const { questionId } = use(params);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [chapterName, setChapterName] = useState('');
  const [courseName, setCourseName] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [aiThinking, setAiThinking] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [solved, setSolved] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    fetch(`/api/learn/${questionId}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions || []);
        setChapterName(data.chapter?.name || '');
        setCourseName(data.course?.name || '');
        setLoading(false);
        if (data.questions?.length > 0) {
          setMessages([
            { role: 'system', text: `📋 题目：${data.questions[0].content}` },
            { role: 'ai', text: '你好！请仔细阅读题目，然后把你的答案告诉我吧。如果不确定也没关系，我会帮你分析 😊' },
          ]);
        }
      })
      .catch(() => setLoading(false));
  }, [questionId]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, aiThinking]);

  const addMessage = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
  };

  const handleSubmit = () => {
    if (!input.trim() || !currentQuestion || aiThinking) return;

    const userAnswer = input.trim();
    setInput('');
    addMessage({ role: 'student', text: userAnswer });
    setAiThinking(true);

    // 模拟 AI 分析（实际项目中调用 AI API）
    setTimeout(() => {
      const isCorrect = checkAnswer(userAnswer, currentQuestion.correct_answer);

      if (isCorrect) {
        addMessage({ role: 'ai-success', text: `🎉 太棒了！答案完全正确！\n\n${currentQuestion.solution}` });
        setSolved(true);
      } else {
        // 诊断错因
        const mistake = findMistake(userAnswer, currentQuestion);
        addMessage({ role: 'ai-diagnosis', text: `🔍 诊断结果\n\n你的答案是 ${userAnswer}，但正确答案不是这个哦。\n\n⚠️ 可能的错因：${mistake}` });

        // 给出提示
        if (hintIndex < currentQuestion.hints.length) {
          setTimeout(() => {
            addMessage({
              role: 'ai-step',
              text: `📝 引导提示\n\n${currentQuestion.hints[hintIndex]}\n\n试试重新算一下？`,
            });
            setHintIndex((i) => i + 1);
            setAiThinking(false);
          }, 1000);
          return;
        } else {
          setTimeout(() => {
            addMessage({
              role: 'ai-step',
              text: `📝 完整解析\n\n让我带你一步步来：\n\n${currentQuestion.solution}\n\n所以正确答案是：${currentQuestion.correct_answer}`,
            });
            setSolved(true);
            setAiThinking(false);
          }, 1000);
          return;
        }
      }
      setAiThinking(false);
    }, 1500);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSolved(false);
      setHintIndex(0);
      setMessages([
        { role: 'system', text: `📋 题目：${questions[nextIdx].content}` },
        { role: 'ai', text: '新的一题！仔细读题，把答案告诉我吧 💪' },
      ]);
    }
  };

  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'student': return 'bg-blue-500 text-white ml-auto rounded-br-md';
      case 'ai': return 'bg-gray-100 text-gray-800 rounded-bl-md';
      case 'ai-diagnosis': return 'bg-orange-50 text-gray-800 border border-orange-200 rounded-bl-md';
      case 'ai-step': return 'bg-gradient-to-r from-blue-50 to-purple-50 text-gray-800 border border-blue-100 rounded-bl-md';
      case 'ai-success': return 'bg-green-50 text-gray-800 border border-green-200 rounded-bl-md';
      case 'system': return 'bg-yellow-50 text-gray-800 border border-yellow-200 mx-auto text-center';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">加载学习内容中...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">📚</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">暂无题目</h2>
          <p className="text-gray-500 mb-4">该章节的题目正在准备中</p>
          <Link href="/courses" className="text-blue-500 hover:text-blue-600 font-medium">
            返回课程列表
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/courses" className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <div className="text-sm font-medium text-gray-900">{chapterName}</div>
              <div className="text-xs text-gray-500">{courseName}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {currentIndex + 1} / {questions.length}
            </span>
            <div className="flex gap-1">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${
                    i === currentIndex ? 'bg-blue-500' : i < currentIndex ? 'bg-green-400' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div ref={chatRef} className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'student' ? 'justify-end' : msg.role === 'system' ? 'justify-center' : 'justify-start'}`}
            >
              <div className={`px-4 py-3 rounded-2xl text-sm max-w-[85%] whitespace-pre-wrap ${getRoleStyle(msg.role)}`}>
                {msg.text}
              </div>
            </div>
          ))}

          {aiThinking && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-bl-md">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {solved && currentIndex < questions.length - 1 && (
            <div className="flex justify-center pt-4">
              <button
                onClick={nextQuestion}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium px-6 py-3 rounded-xl shadow-lg shadow-blue-500/20 hover:from-blue-600 hover:to-purple-700 transition-all flex items-center gap-2"
              >
                下一题
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}

          {solved && currentIndex === questions.length - 1 && (
            <div className="flex justify-center pt-4">
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                <div className="text-3xl mb-2">🎉</div>
                <h3 className="font-bold text-gray-900 mb-1">本章学习完成！</h3>
                <p className="text-sm text-gray-500 mb-4">继续加油，保持学习节奏</p>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium px-6 py-2.5 rounded-xl"
                >
                  返回课程
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      {!solved && (
        <div className="bg-white border-t border-gray-100 px-4 py-3">
          <div className="max-w-2xl mx-auto flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
              placeholder="输入你的答案..."
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
              disabled={aiThinking}
            />
            <button
              onClick={handleSubmit}
              disabled={!input.trim() || aiThinking}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-xl disabled:opacity-50 transition-all shadow-md"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// 检查答案（简单匹配）
function checkAnswer(userAnswer: string, correctAnswer: string): boolean {
  const normalize = (s: string) => s.replace(/\s+/g, '').replace(/cm²|cm2|平方厘米/g, 'cm²').toLowerCase();
  return normalize(userAnswer) === normalize(correctAnswer);
}

// 分析错因
function findMistake(userAnswer: string, question: Question): string {
  const numAnswer = parseFloat(userAnswer.replace(/[^0-9.]/g, ''));
  const numCorrect = parseFloat(question.correct_answer.replace(/[^0-9.]/g, ''));

  if (isNaN(numAnswer)) {
    return '你的答案格式不太对，请输入一个数值答案';
  }

  // 检查常见错误
  for (const mistake of question.common_mistakes) {
    if (mistake.includes('体积') && Math.abs(numAnswer - numCorrect) > 10) {
      return mistake;
    }
  }

  if (numAnswer < numCorrect) {
    return '你的答案偏小了，可能漏算了某些部分';
  } else if (numAnswer > numCorrect) {
    return '你的答案偏大了，可能多算了某些部分';
  }

  return question.common_mistakes[0] || '计算过程中可能有小错误';
}
