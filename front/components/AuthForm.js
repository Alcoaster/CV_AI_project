import { useState } from 'react';
import Link from 'next/link';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="w-[450px] h-[500px] mx-auto p-6 bg-[#555454] rounded-3xl shadow-md">
      <h1 className="text-3xl font-bold text-center mb-4 text-[#FFFFFF]">CV AI</h1>
      <h2 className="text-xl font-semibold text-center mb-4 text-[#FFFFFF]">Вход</h2>

      <div className="space-y-6">
        {/* Поле Email */}
        <div>
          <label className="block text-sm font-medium text-[#FFFFFF] mb-1">
            E-mail
          </label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-[#000000] rounded-md 
                      hover:bg-[#7C7C7C] hover:border-[#FFFFFF] focus:outline-none
                      fosuc:bg-[#7C7C7C] focus:border-[#FFFFFF] transition-all duration-200"
            placeholder="example@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
                      fosuc:bg-[#7C7C7C] focus:border-[#FFFFFF] transition-all duration-200"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

        {/* Кнопка Войти */}
        <button
          className="w-full bg-[#3D3D3D] text-[#FFFFFF] py-2 px-4 rounded-md 
                    hover:bg-[#292929] 
                    transition-colors duration-200 cursor-pointer"
        >
          Войти
        </button>

        {/* Ссылка на регистрацию */}
        <div className="text-center text-sm mt-[-16px]">
          <Link 
            href="/register" 
            className="text-[#FFFFFF] hover:text-[#2C9092] transition-colors cursor-pointer"
          >
            Нет аккаунта? Зарегистрироваться
          </Link>
        </div>
      </div>
    </div>
  );
}