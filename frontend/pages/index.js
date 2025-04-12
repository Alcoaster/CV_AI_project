import { useState, useRef } from 'react';
import { useRouter } from 'next/router';

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
  const [selectedResume, setSelectedResume] = useState(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false); // Состояние для выпадающего окна
  const fileInputRef = useRef(null);
  const profileButtonRef = useRef(null); // Ref для кнопки "Профиль"

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

  // Функция для открытия/закрытия выпадающего окна профиля
  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  // Функция для перехода на страницу настроек
  const handleSettings = () => {
    setShowProfileDropdown(false);
    router.push('/settings');
  };

  // Функция для выхода из аккаунта
  const handleLogout = () => {
    setShowProfileDropdown(false);
    router.push('/login'); // Изменено с /api/login на /login
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Боковая панель */}
      <div className="w-64 p-4 bg-gray-800 border-r border-gray-700">
        <h1 className="text-2xl font-bold mb-4">CV AI</h1>
        <div className="space-y-2">
          <div className="relative">
            <button
              ref={profileButtonRef}
              onClick={toggleProfileDropdown}
              className="w-full py-2 px-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Профиль
            </button>
            {/* Выпадающее окно профиля */}
            {showProfileDropdown && (
              <div
                className="absolute left-full top-0 ml-2 w-48 bg-gray-800 p-4 rounded-lg border border-teal-500 z-50"
              >

                <div className="space-y-2">
                  <button
                    onClick={handleSettings}
                    className="w-full py-1 px-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  >
                    Настройки пользователя
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full py-1 px-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  >
                    Выйти из аккаунта
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleAddChat}
            className="w-full py-2 px-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Добавить чат
          </button>
          <button className="w-full py-2 px-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
            Автоотклик на вакансии
          </button>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">История чатов:</h2>
          <div className="space-y-1">
            {chats.map((chat) => (
              <div key={chat.id} className="flex items-center space-x-2">
                {editingChatId === chat.id ? (
                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="text"
                      value={editingChatName}
                      onChange={(e) => setEditingChatName(e.target.value)}
                      className="flex-1 p-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-teal-500"
                    />
                    <button
                      onClick={() => handleSaveChatName(chat.id)}
                      className="p-2 text-teal-500 hover:text-teal-400"
                    >
                      Сохранить
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => handleSelectChat(chat.id)}
                      className={`flex-1 py-2 px-4 text-left rounded-lg transition-colors ${
                        currentChatId === chat.id
                          ? 'bg-gray-600'
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                    >
                      {chat.name}
                    </button>
                    <button
                      onClick={() => handleEditChatName(chat.id, chat.name)}
                      className="p-2 text-yellow-500 hover:text-yellow-400"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteChat(chat.id)}
                      className="p-2 text-red-500 hover:text-red-400"
                    >
                      🗑️
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Основная область */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-700">
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
                        ? 'bg-gray-700 mr-auto'
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

        <div className="p-4 border-t border-gray-700">
          {showMockInterviewInput && currentChatId ? (
            <div className="flex items-center space-x-2">
              <form onSubmit={handleSendMessage} className="flex-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="Введите ответ..."
                  className="flex-1 p-2 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:border-teal-500"
                />
                <button
                  type="submit"
                  className="p-2 bg-teal-600 rounded-lg hover:bg-teal-500 transition-colors"
                >
                  Отправить
                </button>
              </form>
              <button
                onClick={handleEndInterview}
                className="p-2 bg-red-600 rounded-lg hover:bg-red-500 transition-colors"
              >
                Завершить интервью
              </button>
            </div>
          ) : (
            <div className="flex space-x-2">
              <div className="relative">
                <button
                  onClick={handleAddResume}
                  className="py-2 px-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
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
              <button className="py-2 px-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                Проанализировать резюме
              </button>
              <button className="py-2 px-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                Подобрать вакансии
              </button>
              <button
                onClick={startMockInterview}
                className="py-2 px-4 bg-teal-600 rounded-lg hover:bg-teal-500 transition-colors"
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