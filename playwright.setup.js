export default async () => {  
  // Поднимаем переменную чтобы отключить хеширование CSS модулей в Vite в тестовом режиме
  process.env.PLAYWRIGHT_TEST = 'true';
};

