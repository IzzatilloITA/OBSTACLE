import React, { useState, useEffect } from "react";
import "./App.css";

const OBSTACLE = () => {
  const [isJumping, setIsJumping] = useState(false);
  const [dinoY, setDinoY] = useState(0); // Позиция динозавра по оси Y
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(Number(localStorage.getItem("highScore")) || 0); // Наилучший рекорд
  const [obstacles, setObstacles] = useState([]); // Массив с препятствиями
  const [obstacleSpeed] = useState(3); // Скорость движения препятствий

  // Управление прыжком
  const jump = () => {
    if (!isJumping) {
      setIsJumping(true);
      setDinoY(150); // Позиция прыжка
    }
  };

  // Динамика прыжка
  useEffect(() => {
    if (isJumping) {
      setTimeout(() => {
        setDinoY(0); // Возвращаем динозавра в исходное положение
        setIsJumping(false);
      }, 500); // Время прыжка
    }
  }, [isJumping]);

  // Создание новых препятствий
  useEffect(() => {
    if (isGameOver) return;

    const createObstacleInterval = setInterval(() => {
      setObstacles((prevObstacles) => [
        ...prevObstacles,
        { x: 300, width: 30, height: 40 }, // Новый объект с позиции 300
      ]);
    }, 2000); // Каждые 2 секунды появляется новое препятствие

    return () => clearInterval(createObstacleInterval);
  }, [isGameOver]);

  // Движение препятствий
  useEffect(() => {
    if (isGameOver) return;

    const moveObstaclesInterval = setInterval(() => {
      setObstacles((prevObstacles) => {
        const updatedObstacles = prevObstacles
          .map((obstacle) => ({
            ...obstacle,
            x: obstacle.x - obstacleSpeed, // Двигаем препятствие влево
          }))
          .filter((obstacle) => obstacle.x > 0); // Убираем препятствия, которые ушли за экран

        // Увеличиваем счёт за каждый пройденный объект
        updatedObstacles.forEach((obstacle) => {
          if (obstacle.x <= 60) {
            setScore((prevScore) => prevScore + 1);
          }
        });

        return updatedObstacles;
      });
    }, 20);

    return () => clearInterval(moveObstaclesInterval);
  }, [isGameOver, obstacleSpeed]);

  // Проверка на столкновение с препятствием
  useEffect(() => {
    if (isJumping) return; // Игнорируем проверку во время прыжка

    const collision = obstacles.some(
      (obstacle) =>
        obstacle.x <= 60 && obstacle.x + obstacle.width >= 60 && dinoY === 0 // Столкновение с препятствием
    );

    if (collision) {
      setIsGameOver(true); // Если столкновение, игра заканчивается
      // Сохраняем рекорд, если текущий счёт выше
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem("highScore", score);
      }
    }
  }, [obstacles, dinoY, isJumping, score, highScore]);

  // Обработчик нажатия клавиши пробела или стрелки вверх
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === " " || e.key === "ArrowUp") {
        jump();
      } else if (e.key === "r" || e.key === "R" || e.key === "р" || e.key === "Р" || e.key === "к" || e.key === "К" || e.key === "H" || e.key === "h") {
        restartGame(); // Перезапуск игры при нажатии 'R'
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isJumping, obstacles, dinoY, score]);

  // Перезапуск игры
  const restartGame = () => {
    setIsJumping(false);
    setDinoY(0);
    setIsGameOver(false);
    setScore(0);
    setObstacles([]); // Очистка препятствий при перезапуске
  };

  // Сброс рекорда
  const resetHighScore = () => {
    setHighScore(0); // Сбрасываем рекорд в состоянии
    localStorage.setItem("highScore", 0); // Сбрасываем рекорд в localStorage
  };

  // Обработчик для тапа по экрану
  const handleTouch = (e) => {
    e.preventDefault(); // Предотвращаем стандартное поведение (например, прокрутку страницы)
    if (isGameOver) {
      restartGame(); // Перезапуск игры при касании экрана, если игра завершена
    } else {
      jump(); // Прыжок при касании экрана, если игра не завершена
    }
  };

  return (
    <div className="game-container" onTouchStart={handleTouch}>
      <div className="game-info">
        <h1>OBSTACLE by <a href="https://zimp.netlify.app/">ZIM</a> </h1>
        <p>Score: {score}⭐</p>
        <p>High Score: {highScore}⭐</p> {/* Добавляем отображение наилучшего рекорда */}
        {isGameOver && <p>Game Over! Tap to Restart</p>}
        {/* Кнопка сброса рекорда */}
        <button className="reset-btnc" onClick={resetHighScore}>Reset High Score</button>
      </div>
      <div className="game-area">
        <div
          className="dino"
          style={{ bottom: `${dinoY}px`, transition: "bottom 0.3s" }}
        />
        {obstacles.map((obstacle, index) => (
          <div
            key={index}
            className="obstacle"
            style={{
              left: `${obstacle.x}px`,
              width: `${obstacle.width}px`,
              height: `${obstacle.height}px`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div className="App">
      <OBSTACLE />
    </div>
  );
};

export default App;
