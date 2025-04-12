import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AuthForm({ isLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState(''); // Заменил email на username
  const [error, setError] = useState(''); // Для отображения ошибок
  const [loading, setLoading] = useState(false); // Для индикации загрузки
  const router = useRouter();

  const handleSubmit = async (e) => { 
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!isLogin && password !== confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    const url = isLogin
      ? 'http://localhost:8000/api/login/'
      : 'http://localhost:8000/api/register/';

    const data = isLogin
      ? { username, password }
      : { username, password_hash: password };

    try {
      console.log('Sending request to:', url, 'with data:', data);
      const response = await axios.post(url, data);
      if (isLogin) {
        localStorage.setItem('refresh', response.data.refresh);
        localStorage.setItem('access', response.data.access);
        console.log('Успешный вход:', response.data);
        router.push('/');
      } else {
        console.log('Успешная регистрация:', response.data);
        router.push('/login');
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 'Произошла ошибка. Попробуйте снова.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[450px] h-auto mx-auto p-6 bg-[#555454] rounded-3xl shadow-md">
      <h1 className="text-3xl font-bold text-center mb-4 text-[#FFFFFF]">CV AI</h1>
      <h2 className="text-xl font-semibold text-center mb-4 text-[#FFFFFF]">
        {isLogin ? 'Вход' : 'Регистрация'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Поле Имя */}
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-[#FFFFFF] mb-1">
              Имя
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-[#000000] rounded-md 
                         hover:bg-[#7C7C7C] hover:border-[#FFFFFF] focus:outline-none
                         focus:bg-[#7C7C7C] focus:border-[#FFFFFF] transition-all duration-200"
              placeholder="Имя"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
        )}

        {/* Поле Фамилия */}
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-[#FFFFFF] mb-1">
              Фамилия
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-[#000000] rounded-md 
                         hover:bg-[#7C7C7C] hover:border-[#FFFFFF] focus:outline-none
                         focus:bg-[#7C7C7C] focus:border-[#FFFFFF] transition-all duration-200"
              placeholder="Фамилия"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        )}

        {/* Поле Email */}
        <div>
          <label className="block text-sm font-medium text-[#FFFFFF] mb-1">
            Username
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-[#000000] rounded-md 
                       hover:bg-[#7C7C7C] hover:border-[#FFFFFF] focus:outline-none
                       focus:bg-[#7C7C7C] focus:border-[#FFFFFF] transition-all duration-200"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Поле Пароль */}
        <div>
          <label className="block text-sm font-medium text-[#FFFFFF] mb-1">
            Пароль
          </label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-[#000000] rounded-md 
                       hover:bg-[#7C7C7C] hover:border-[#FFFFFF] focus:outline-none
                       focus:bg-[#7C7C7C] focus:border-[#FFFFFF] transition-all duration-200"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {isLogin && (
          <div className="mt-2 text-right">
          <Link 
            href="/forgot-password" 
            className="text-sm text-[#FFFFFF] hover:text-[#2C9092] transition-colors cursor-pointer"
          >
            Забыли пароль?
          </Link>
          </div>
          )}
        </div>

        {/* Поле Повторите пароль */}
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-[#FFFFFF] mb-1">
              Повторите пароль
            </label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-[#000000] rounded-md 
                         hover:bg-[#7C7C7C] hover:border-[#FFFFFF] focus:outline-none
                         focus:bg-[#7C7C7C] focus:border-[#FFFFFF] transition-all duration-200"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        )}

        {/* Кнопка Войти/Зарегистрироваться */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-[#3D3D3D] text-[#FFFFFF] py-2 px-4 rounded-md 
          hover:bg-[#292929] transition-colors duration-200 cursor-pointer
          ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
        </button>

        {/* Ссылка на вход/регистрацию */}
        <div className="text-center text-sm mt-[-16px]">
          <Link
            href={isLogin ? '/register' : '/login'}
            className="text-[#FFFFFF] hover:text-[#2C9092] transition-colors cursor-pointer"
          >
            {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Есть аккаунт? Войти'}
          </Link>
        </div>
      </form>
    </div>
  );
}