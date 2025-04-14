import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Settings() {
  const router = useRouter();

  const [email, setEmail] = useState("Ivanov@tpu.ru");
  const [firstName, setFirstName] = useState("Иван");
  const [lastName, setLastName] = useState("Иванов");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const handleLogout = () => {
    router.push('/login');
  };

  const goToChat = () => {
    router.push('/');
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert("Пароли не совпадают!");
    } else {
      alert("Пароль успешно изменён!");
      setNewPassword("");
      setConfirmPassword("");
      setShowPasswordFields(false);
    }
  };

  const handleSaveProfile = () => {
    alert("Изменения сохранены!");
  };

  return (
    <div className="flex h-screen bg-[#1E1E1E] text-white">
      {/* Левая панель */}
      <div className="w-64 p-4 bg-[#3D3D3D] border-r border-[#3D3D3D] flex flex-col justify-between">
        <div>
          <h1 className="text-2xl text-center font-bold mb-4">CV AI</h1>
          <div className="h-0.5 bg-teal-600 rounded-full mb-4" />

          <button
            onClick={goToChat}
            className="w-full py-2 px-4 bg-[#3D3D3D] rounded-lg hover:bg-[#4E4E4E] transition-colors"
          >
            Назад к чату
          </button>
        </div>
      </div>

      {/* Основной контент */}
      <div className="flex-1 flex items-start justify-start p-8 overflow-y-auto">
        <div className="w-full max-w-3xl flex flex-col md:flex-row gap-8">
          {/* Настройки аккаунта */}
          <div className="w-full md:w-1/2">
            <h3 className="text-xl font-semibold mb-4">Настройки аккаунта</h3>
            <p className="mb-6 text-sm text-gray-400">Здесь вы можете изменять персональную информацию</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 rounded bg-[#2A2A2A] text-white border border-[#555]"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Имя</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2 rounded bg-[#2A2A2A] text-white border border-[#555]"
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Фамилия</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2 rounded bg-[#2A2A2A] text-white border border-[#555]"
                />
              </div>

              <button
                onClick={() => setShowPasswordFields(!showPasswordFields)}
                className="mt-4 py-2 px-4 bg-[#4E4E4E] hover:bg-[#5f5f5f] rounded text-sm transition-colors"
              >
                {showPasswordFields ? "Скрыть смену пароля" : "Сменить пароль"}
              </button>

               {/* Кнопка выхода */}
            <button
              onClick={handleLogout}
              className="w-full mt-8 py-2 px-4 bg-[#2A2A2A] border border-[#555] hover:bg-[#3A3A3A] rounded text-sm transition-colors"
            >
              Выйти из аккаунта
            </button>
            </div>
          </div>

          {/* Смена пароля — по условию */}
          {showPasswordFields && (
            <div className="w-full md:w-1/2 bg-[#2A2A2A] p-6 rounded-xl mt-[4px]">
              <h3 className="text-xl font-semibold mb-6 text-center">Смена пароля</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Введите новый пароль</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 rounded bg-[#1E1E1E] text-white border border-[#555]"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Повторите пароль</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 rounded bg-[#1E1E1E] text-white border border-[#555]"
                  />
                </div>
                <button
                  onClick={handlePasswordChange}
                  className="w-full mt-4 py-2 px-4 bg-teal-600 hover:bg-teal-700 rounded text-white font-semibold transition-colors"
                >
                  Подтвердить
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
