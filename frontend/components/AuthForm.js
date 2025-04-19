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
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCodeForm, setShowCodeForm] = useState(false);
  const router = useRouter();

  // Проверка, что строка содержит только буквы
  const isLettersOnly = (value) => /^[а-яА-Яa-zA-Z]+$/.test(value);

  // Проверка корректности email
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Проверка корректности пароля (минимум 8 символов)
  const isValidPassword = (password) => password.length >= 8;

  // Обработчик повторной отправки кода
  const handleResendCode = async () => {
    setError('');
    setLoading(true);

    const url = 'http://localhost:8000/api/register/';
    const data = { email, password_hash: password, first_name: firstName, last_name: lastName };

    try {
      console.log('Sending resend code request to:', url, 'with data:', data);
      const response = await axios.post(url, data);
      console.log('Код успешно отправлен повторно:', response.data);
      setError(''); // Очищаем ошибки, если отправка успешна
    } catch (err) {
      setError(
        err.response?.data?.error || 'Ошибка при отправке кода. Попробуйте снова.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Обработчик отправки формы регистрации, логина или кода
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Проверки для формы регистрации
    if (!isLogin && !showCodeForm) {
      // Проверка заполненности всех полей
      if (!email || !password || !confirmPassword || !firstName || !lastName) {
        setError('Пожалуйста, заполните все поля');
        setLoading(false);
        return;
      }

      // Проверка корректности email
      if (!isValidEmail(email)) {
        setError('Пожалуйста, введите корректный email');
        setLoading(false);
        return;
      }

      // Проверка паролей на совпадение
      if (password !== confirmPassword) {
        setError('Пароли не совпадают');
        setLoading(false);
        return;
      }

      // Проверка корректности пароля
      if (!isValidPassword(password)) {
        setError('Пароль должен содержать минимум 8 символов');
        setLoading(false);
        return;
      }

      // Проверка, что в имени и фамилии только буквы
      if (!isLettersOnly(firstName)) {
        setError('Имя должно содержать только буквы');
        setLoading(false);
        return;
      }
      if (!isLettersOnly(lastName)) {
        setError('Фамилия должна содержать только буквы');
        setLoading(false);
        return;
      }
    }

    // Проверки для формы авторизации
    if (isLogin) {
      // Проверка заполненности полей
      if (!email || !password) {
        setError('Пожалуйста, заполните все поля');
        setLoading(false);
        return;
      }

      // Проверка корректности email
      if (!isValidEmail(email)) {
        setError('Пожалуйста, введите корректный email');
        setLoading(false);
        return;
      }

      // Проверка корректности пароля
      if (!isValidPassword(password)) {
        setError('Пароль должен содержать минимум 8 символов');
        setLoading(false);
        return;
      }
    }

    // Проверки для формы ввода кода
    if (!isLogin && showCodeForm) {
      if (!code) {
        setError('Пожалуйста, введите код');
        setLoading(false);
        return;
      }
    }

    // Определение URL и данных для запроса
    const url = isLogin
      ? 'http://localhost:8000/api/login/'
      : showCodeForm
      ? 'http://localhost:8000/api/verify-code/'
      : 'http://localhost:8000/api/register/';

    const data = isLogin
      ? { email, password }
      : showCodeForm
      ? { email, code }
      : { email, password_hash: password, first_name: firstName, last_name: lastName };

    try {
      console.log('Sending request to:', url, 'with data:', data);
      const response = await axios.post(url, data);
      if (isLogin) {
        localStorage.setItem('refresh', response.data.refresh);
        localStorage.setItem('access', response.data.access);
        console.log('Успешный вход:', response.data);
        router.push('/');
      } else if (showCodeForm) {
        console.log('Код успешно подтвержден:', response.data);
        router.push('/login');
      } else {
        console.log('Успешная регистрация, код отправлен:', response.data);
        setShowCodeForm(true); // Переключение на форму ввода кода
      }
    } catch (err) {
      if (isLogin && err.response?.data?.error === 'Invalid credentials') {
        setError('Неправильный email или пароль. Пожалуйста, попробуйте снова.');
      } else if (showCodeForm && err.response?.data?.error === 'Invalid code') {
        setError('Неправильный код. Пожалуйста, попробуйте снова.');
      } else {
        setError(
          err.response?.data?.error || 'Произошла ошибка. Попробуйте снова.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[450px] h-auto mx-auto p-6 bg-[#555454] rounded-3xl shadow-md">
      <h1 className="text-3xl font-bold text-center mb-4 text-[#FFFFFF]">CV AI</h1>
      <h2 className="text-xl font-semibold text-center mb-4 text-[#FFFFFF]">
        {isLogin ? 'Вход' : showCodeForm ? 'Подтверждение кода' : 'Регистрация'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Форма регистрации */}
        {!isLogin && !showCodeForm && (
          <>
            {/* Поле Имя */}
            <div>
              <label className="block text-sm font-medium text-[#FFFFFF] mb-1">
                Имя
              </label>
              <input
                type="text"
                className={`w-full px-4 py-2 border rounded-md 
                           hover:bg-[#7C7C7C] hover:border-[#FFFFFF] focus:outline-none
                           focus:bg-[#7C7C7C] focus:border-[#FFFFFF] transition-all duration-200
                           ${error.includes('Имя') ? 'border-red-500' : 'border-[#000000]'}`}
                placeholder="Имя"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setError('');
                }}
              />
            </div>

            {/* Поле Фамилия */}
            <div>
              <label className="block text-sm font-medium text-[#FFFFFF] mb-1">
                Фамилия
              </label>
              <input
                type="text"
                className={`w-full px-4 py-2 border rounded-md 
                           hover:bg-[#7C7C7C] hover:border-[#FFFFFF] focus:outline-none
                           focus:bg-[#7C7C7C] focus:border-[#FFFFFF] transition-all duration-200
                           ${error.includes('Фамилия') ? 'border-red-500' : 'border-[#000000]'}`}
                placeholder="Фамилия"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setError('');
                }}
              />
            </div>

            {/* Поле Email */}
            <div>
              <label className="block text-sm font-medium text-[#FFFFFF] mb-1">
                Email
              </label>
              <input
                type="email"
                className={`w-full px-4 py-2 border rounded-md 
                           hover:bg-[#7C7C7C] hover:border-[#FFFFFF] focus:outline-none
                           focus:bg-[#7C7C7C] focus:border-[#FFFFFF] transition-all duration-200
                           ${error.includes('email') || error.includes('Email') ? 'border-red-500' : 'border-[#000000]'}`}
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
              />
            </div>

            {/* Поле Пароль */}
            <div>
              <label className="block text-sm font-medium text-[#FFFFFF] mb-1">
                Пароль
              </label>
              <input
                type="password"
                className={`w-full px-4 py-2 border rounded-md 
                           hover:bg-[#7C7C7C] hover:border-[#FFFFFF] focus:outline-none
                           focus:bg-[#7C7C7C] focus:border-[#FFFFFF] transition-all duration-200
                           ${error.includes('Пароль') ? 'border-red-500' : 'border-[#000000]'}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
              />
            </div>

            {/* Поле Повторите пароль */}
            <div>
              <label className="block text-sm font-medium text-[#FFFFFF] mb-1">
                Повторите пароль
              </label>
              <input
                type="password"
                className={`w-full px-4 py-2 border rounded-md 
                           hover:bg-[#7C7C7C] hover:border-[#FFFFFF] focus:outline-none
                           focus:bg-[#7C7C7C] focus:border-[#FFFFFF] transition-all duration-200
                           ${error.includes('Пароли') ? 'border-red-500' : 'border-[#000000]'}`}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
              />
            </div>
          </>
        )}

        {/* Форма ввода кода */}
        {!isLogin && showCodeForm && (
          <div>
            <label className="block text-sm font-medium text-[#FFFFFF] mb-1">
              Код подтверждения
            </label>
            <input
              type="text"
              className={`w-full px-4 py-2 border rounded-md 
                         hover:bg-[#7C7C7C] hover:border-[#FFFFFF] focus:outline-none
                         focus:bg-[#7C7C7C] focus:border-[#FFFFFF] transition-all duration-200
                         ${error.includes('код') ? 'border-red-500' : 'border-[#000000]'}`}
              placeholder="Введите код"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError('');
              }}
            />
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={handleResendCode}
                className="text-sm text-[#FFFFFF] hover:text-[#2C9092] transition-colors cursor-pointer"
                disabled={loading}
              >
                Отправить код повторно
              </button>
            </div>
          </div>
        )}

        {/* Форма авторизации */}
        {isLogin && (
          <>
            {/* Поле Email */}
            <div>
              <label className="block text-sm font-medium text-[#FFFFFF] mb-1">
                Email
              </label>
              <input
                type="email"
                className={`w-full px-4 py-2 border rounded-md 
                           hover:bg-[#7C7C7C] hover:border-[#FFFFFF] focus:outline-none
                           focus:bg-[#7C7C7C] focus:border-[#FFFFFF] transition-all duration-200
                           ${error.includes('email') || error.includes('Email') || error.includes('Неправильный email') ? 'border-red-500' : 'border-[#000000]'}`}
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
              />
            </div>

            {/* Поле Пароль */}
            <div>
              <label className="block text-sm font-medium text-[#FFFFFF] mb-1">
                Пароль
              </label>
              <input
                type="password"
                className={`w-full px-4 py-2 border rounded-md 
                           hover:bg-[#7C7C7C] hover:border-[#FFFFFF] focus:outline-none
                           focus:bg-[#7C7C7C] focus:border-[#FFFFFF] transition-all duration-200
                           ${error.includes('Пароль') || error.includes('пароль') ? 'border-red-500' : 'border-[#000000]'}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
              />
              <div className="mt-2 text-right">
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#FFFFFF] hover:text-[#2C9092] transition-colors cursor-pointer"
                >
                  Забыли пароль?
                </Link>
              </div>
            </div>
          </>
        )}

        {/* Сообщение об ошибке */}
        {error && (
          <p className="text-red-500 text-sm text-center">{error}</p>
        )}

        {/* Кнопка действия */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-[#3D3D3D] text-[#FFFFFF] py-2 px-4 rounded-md 
                     hover:bg-[#292929] transition-colors duration-200 cursor-pointer
                     ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading
            ? 'Загрузка...'
            : isLogin
            ? 'Войти'
            : showCodeForm
            ? 'Подтвердить код'
            : 'Зарегистрироваться'}
        </button>

        {/* Ссылка на вход/регистрацию */}
        {(isLogin || !showCodeForm) && (
          <div className="text-center text-sm mt-[-16px]">
            <Link
              href={isLogin ? '/register' : '/login'}
              className="text-[#FFFFFF] hover:text-[#2C9092] transition-colors cursor-pointer"
            >
              {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Есть аккаунт? Войти'}
            </Link>
          </div>
        )}
      </form>
    </div>
  );
}