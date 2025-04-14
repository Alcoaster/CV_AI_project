import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { FaCheck, FaTimes, FaEdit, FaTrash } from 'react-icons/fa';

export default function Home() {
  const router = useRouter();
  const [chats, setChats] = useState([
    { id: 1, name: 'Чат 1', messages: [] },
    { id: 2, name: 'Чат 2', messages: [] },
  ]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [showMockInterviewInput, setShowMockInterviewInput] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [editingChatId, setEditingChatId] = useState(null);
  const [editingChatName, setEditingChatName] = useState('');
  const [deletingChatId, setDeletingChatId] = useState(null); // Состояние для режима удаления
  const [selectedResume, setSelectedResume] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const fileInputRef = useRef(null);
  const profileButtonRef = useRef(null);

  const handleAddChat = () => {
    const newChat = {
      id: chats.length ? Math.max(...chats.map((chat) => chat.id)) + 1 : 1,
      name: `Чат ${chats.length + 1}`,
      messages: [],
    };
    setChats([...chats, newChat]);
    setCurrentChatId(newChat.id);
  };

  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId);
    setShowMockInterviewInput(false);
  };

  const handleDeleteChat = (chatId) => {
    const updatedChats = chats.filter((chat) => chat.id !== chatId);
    setChats(updatedChats);
    if (currentChatId === chatId) {
      setCurrentChatId(updatedChats.length ? updatedChats[0].id : null);
      setShowMockInterviewInput(false);
    }
    setDeletingChatId(null); // Сбрасываем режим удаления
  };

  const handleEditChatName = (chatId, currentName) => {
    setEditingChatId(chatId);
    setEditingChatName(currentName);
  };

  const handleSaveChatName = (chatId) => {
    if (!editingChatName.trim()) return;
    const updatedChats = chats.map((chat) =>
      chat.id === chatId ? { ...chat, name: editingChatName } : chat
    );
    setChats(updatedChats);
    setEditingChatId(null);
    setEditingChatName('');
  };

  const handleCancelEdit = () => {
    setEditingChatId(null);
    setEditingChatName('');
  };

  const handleStartDelete = (chatId) => {
    setDeletingChatId(chatId);
  };

  const handleCancelDelete = () => {
    setDeletingChatId(null);
  };

  const startMockInterview = () => {
    if (!currentChatId) return;
    setShowMockInterviewInput(true);
    const currentChat = chats.find((chat) => chat.id === currentChatId);
    if (currentChat.messages.length === 0) {
      const initialMessage = {
        sender: 'ai',
        text: 'Сейчас мы будем проводить мок-интервью. Тебе станет доступна на строках ввода, через которую ты будешь писать свои ответы, я буду задавать тебе вопросы, твоя задача отвечать на них так, как ты бы это сделал на настоящем собеседовании. Хочу уточнить привычки и аналитику. Поначалу оставлю открытым окно вопросов, говорить правду по тому отклику или нет, отмечай, что эксперту было бы интересно. Вопрос 5 вопросов. Добавь совет по тому как улучшить твоё резюме. Первый вопрос: что такое декораторы в Python?',
      };
      updateChatMessages(currentChatId, [initialMessage]);
    }
  };

  const updateChatMessages = (chatId, messages) => {
    const updatedChats = chats.map((chat) =>
      chat.id === chatId ? { ...chat, messages } : chat
    );
    setChats(updatedChats);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!userInput.trim() || !currentChatId) return;

    const newUserMessage = { sender: 'user', text: userInput };
    const currentChat = chats.find((chat) => chat.id === currentChatId);
    const updatedMessages = [...currentChat.messages, newUserMessage];
    updateChatMessages(currentChatId, updatedMessages);

    setTimeout(() => {
      const aiResponse = {
        sender: 'ai',
        text: 'Декораторы в Python позволяют расширять и изменять поведение вызываемых объектов (функций, методов и классов) без постоянного изменения самого кода. Хочешь привести пример декоратора на основе/функции/метода/класса. Второй вопрос: как создать словарь, имея два списка? Первый список будет ключом, второй значением.',
      };
      updateChatMessages(currentChatId, [...updatedMessages, aiResponse]);
    }, 1000);

    setUserInput('');
  };

  const handleEndInterview = () => {
    setShowMockInterviewInput(false);
    const currentChat = chats.find((chat) => chat.id === currentChatId);
    const finalMessage = {
      sender: 'ai',
      text: 'Мок-интервью завершено. Спасибо за участие! Вот мой совет по улучшению твоего резюме: добавь больше конкретных достижений с цифрами, например, "увеличил производительность команды на 20%".',
    };
    updateChatMessages(currentChatId, [...currentChat.messages, finalMessage]);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Пожалуйста, выберите файл в формате PDF.');
        setSelectedResume(null);
        e.target.value = null;
        return;
      }
      setSelectedResume(file);
    }
  };

  const handleAddResume = () => {
    fileInputRef.current.click();
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleSettings = () => {
    setShowProfileDropdown(false);
    router.push('/settings');
  };

  const handleLogout = () => {
    setShowProfileDropdown(false);
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-[#1E1E1E] text-white">
      {/* Боковая панель */}
      <div className="w-64 p-4 bg-[#3D3D3D] border-r border-[#3D3D3D]">
        <h1 className="text-2xl text-center font-bold mb-4">CV AI</h1>
        <div className="h-0.5 bg-teal-600 rounded-full mb-4 relative"></div>
        <div className="space-y-2">
          <div className="relative">
            <button
              ref={profileButtonRef}
              onClick={toggleProfileDropdown}
              className="w-full py-2 px-4 bg-[#3D3D3D] rounded-lg hover:bg-[#4E4E4E] transition-colors cursor-pointer"
            >
              Профиль
            </button>
            {showProfileDropdown && (
              <div className="absolute left-full top-0 ml-2 w-48 bg-[#3D3D3D] p-4 rounded-lg border border-teal-600 z-50 profile-dropdown">
                <h2 className="text-lg font-semibold mb-3 text-center">Настройки</h2>
                <div className="space-y-2">
                  <button
                    onClick={handleSettings}
                    className="w-full py-1 px-2 bg-[#3D3D3D] rounded-lg hover:bg-[#4E4E4E] transition-colors text-sm cursor-pointer"
                  >
                    Настройки пользователя
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full py-1 px-2 bg-[#3D3D3D] rounded-lg hover:bg-[#4E4E4E] transition-colors text-sm cursor-pointer"
                    
                  >
                    Выйти из аккаунта
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleAddChat}
            className="w-full py-2 px-4 bg-[#3D3D3D] rounded-lg hover:bg-[#4E4E4E] transition-colors cursor-pointer"
          >
            Добавить чат
          </button>
          <button className="w-full py-2 px-4 border border-teal-600 bg-[#3D3D3D] rounded-lg hover:bg-[#4E4E4E] transition-colors cursor-pointer">
            Автоотклик на вакансии
          </button>
        </div>
        
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">История чатов:</h2>
          <div className="space-y-1">
            {chats.map((chat) => (
              <div key={chat.id} className="relative">
                {editingChatId === chat.id ? (
                  <div className="flex items-center space-x-2 w-full">
                    <textarea
                      value={editingChatName}
                      onChange={(e) => setEditingChatName(e.target.value)}
                      className="flex-1 p-2 bg-[#3D3D3D] rounded-lg border border-[#4E4E4E] focus:outline-none focus:border-teal-600 min-w-0 "
                    />
                    <button
                      onClick={() => handleSaveChatName(chat.id)}
                      className="p-2 text-[#AAAAAA] hover:text-[#FFFFFF] flex-shrink-0"
                    >
                      <FaCheck/>
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="p-2 text-[#AAAAAA] hover:text-[#FFFFFF] flex-shrink-0"
                    >
                      <FaTimes/>
                    </button>
                  </div>
                ) : deletingChatId === chat.id ? (
                  <div className="relative">
                    <button
                      className="w-full py-2 px-4 text-left rounded-lg bg-[#4E4E4E]"
                      disabled
                    >
                      {chat.name}
                    </button>
                    <button
                      onClick={() => handleDeleteChat(chat.id)}
                      className="absolute right-10 top-1/2 transform -translate-y-1/2 text-[#AAAAAA] hover:text-[#FFFFFF]"
                    >
                      <FaCheck/>
                    </button>
                    <button
                      onClick={handleCancelDelete}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#AAAAAA] hover:text-[#FFFFFF]"
                    >
                      <FaTimes/>
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <button
                      onClick={() => handleSelectChat(chat.id)}
                      className={`w-full py-2 px-2 text-left rounded-lg transition-colors break-words  ${
                        currentChatId === chat.id
                          ? 'bg-[#4E4E4E]'
                          : 'bg-[#3D3D3D] hover:bg-[#4E4E4E]'
                      }`}
                    >
                      {chat.name}
                    </button>
                    <button
                      onClick={() => handleEditChatName(chat.id, chat.name)}
                      className="absolute right-10 top-1/2 transform -translate-y-1/2 text-[#AAAAAA] hover:text-[#FFFFFF]"
                    >
                      <FaEdit/>
                    </button>
                    <button
                      onClick={() => handleStartDelete(chat.id)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#AAAAAA] hover:text-[#FFFFFF]"
                    >
                      <FaTrash/>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Основная область */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-[#3D3D3D]">
          <h2 className="text-lg font-semibold">
            {currentChatId
              ? chats.find((chat) => chat.id === currentChatId)?.name
              : 'Выберите чат'}
          </h2>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          {currentChatId ? (
            (() => {
              const currentChat = chats.find((chat) => chat.id === currentChatId);
              return currentChat.messages.length > 0 ? (
                currentChat.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 p-3 rounded-lg max-w-md ${
                      message.sender === 'ai'
                        ? 'bg-[#3D3D3D] mr-auto'
                        : 'bg-teal-600 ml-auto'
                    }`}
                  >
                    <p>{message.text}</p>
                  </div>
                ))
              ) : showMockInterviewInput ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400">Мок-интервью началось...</p>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-400">
                    {selectedResume
                      ? `Выбрано резюме: ${selectedResume.name}`
                      : 'Выберите действие ниже'}
                  </p>
                </div>
              );
            })()
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-400">Выберите чат или создайте новый</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-[#3D3D3D] flex justify-center">
          {showMockInterviewInput && currentChatId ? (
            <div className="flex items-center space-x-2 max-w-6xl w-full">
              <form onSubmit={handleSendMessage} className="flex-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Введите ответ..."
                  className="flex-1 p-2 bg-[#3D3D3D] rounded-lg border border-[#4E4E4E] focus:outline-none focus:border-teal-600"
                />
                <button
                  type="submit"
                  className="p-2 bg-teal-600 rounded-lg hover:bg-teal-500 transition-colors cursor-pointer"
                >
                  Отправить
                </button>
              </form>
              <button
                onClick={handleEndInterview}
                className="p-2 bg-red-600 rounded-lg hover:bg-red-500 transition-colors cursor-pointer"
              >
                Завершить интервью
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="relative">
                <button
                  onClick={handleAddResume}
                  className="py-2 px-4 bg-[#3D3D3D] rounded-lg hover:bg-[#4E4E4E] transition-colors cursor-pointer"
                >
                  Добавить резюме
                </button>
                <input
                  type="file"
                  accept="application/pdf"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              <button className="py-2 px-4 bg-[#3D3D3D] rounded-lg hover:bg-[#4E4E4E] transition-colors cursor-pointer">
                Проанализировать резюме
              </button>
              <button className="py-2 px-4 bg-[#3D3D3D] rounded-lg hover:bg-[#4E4E4E] transition-colors cursor-pointer">
                Подобрать вакансии
              </button>
              <button
                onClick={startMockInterview}
                className="py-2 px-4 bg-teal-600 rounded-lg hover:bg-teal-500 transition-colors cursor-pointer"
                disabled={!currentChatId}
              >
                Провести мок-интервью
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}