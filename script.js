const questions = [
    {
        question: "Qual é o verdadeiro nome do Homem de Ferro?",
        answers: [
            { text: "Tony Stark", correct: true },
            { text: "Steve Rogers", correct: false },
            { text: "Bruce Banner", correct: false },
            { text: "Thor Odinson", correct: false }
        ]
    },
    {
        question: "Quem é o vilão do primeiro filme dos Vingadores?",
        answers: [
            { text: "Thanos", correct: false },
            { text: "Ultron", correct: false },
            { text: "Loki", correct: true },
            { text: "Hela", correct: false }
        ]
    },
    {
        question: "Qual é o nome da irmã de Pantera Negra?",
        answers: [
            { text: "Nakia", correct: false },
            { text: "Okoye", correct: false },
            { text: "Shuri", correct: true },
            { text: "Ramonda", correct: false }
        ]
    },
    {
        question: "Quem quebra o escudo do Capitão América?",
        answers: [
            { text: "Ultron", correct: false },
            { text: "Thanos", correct: true },
            { text: "Loki", correct: false },
            { text: "Hela", correct: false }
        ]
    },
    {
        question: "Qual o nome do martelo de Thor?",
        answers: [
            { text: "Mjolnir", correct: true },
            { text: "Stormbreaker", correct: false },
            { text: "Gungnir", correct: false },
            { text: "Hofund", correct: false }
        ]
    },
    {
        question: "Onde o Capitão América foi congelado?",
        answers: [
            { text: "Ártico", correct: true },
            { text: "Antártida", correct: false },
            { text: "Alasca", correct: false },
            { text: "Groenlândia", correct: false }
        ]
    }
];

const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const scoreContainer = document.getElementById('score-container');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restart-btn');
const nameInputContainer = document.getElementById('name-input-container');
const submitNameButton = document.getElementById('submit-name-btn');
const nameInput = document.getElementById('name');
const rankingContainer = document.getElementById('ranking-container');
const rankingList = document.getElementById('ranking-list');

let shuffledQuestions, currentQuestionIndex;
let score = 0;

// Função para embaralhar array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function startQuiz() {
    score = 0;
    scoreContainer.classList.add('hide');
    rankingContainer.classList.add('hide');
    document.getElementById('quiz').classList.remove('hide');

    shuffledQuestions = shuffleArray([...questions]);
    currentQuestionIndex = 0;

    showQuestion();
}

function showQuestion() {
    resetState();
    const currentQuestion = shuffledQuestions[currentQuestionIndex];
    questionElement.innerText = currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

function resetState() {
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === "true";
    setStatusClass(selectedButton, correct);
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct === "true");
    });

    if (correct) {
        score++;
    }

    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide');
    } else {
        showScore();
    }
}

function setStatusClass(element, correct) {
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

function showScore() {
    document.getElementById('quiz').classList.add('hide');
    scoreContainer.classList.remove('hide');
    scoreElement.innerText = `${score} de ${shuffledQuestions.length}`;
}

function submitScore() {
    const name = nameInput.value;
    if (name === "") {
        alert("Por favor, insira um nome!");
        return;
    }

    // Carregar ranking do localStorage ou iniciar um novo array
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];

    // Adicionar o novo recorde
    ranking.push({ name, score });
    
    // Ordenar o ranking por pontuação (decrescente)
    ranking.sort((a, b) => b.score - a.score);

    // Salvar o ranking atualizado no localStorage
    localStorage.setItem('ranking', JSON.stringify(ranking));

    // Exibir o ranking
    showRanking();
}

function showRanking() {
    scoreContainer.classList.add('hide');
    rankingContainer.classList.remove('hide');
    
    // Limpar lista anterior
    rankingList.innerHTML = "";

    // Carregar o ranking do localStorage
    const ranking = JSON.parse(localStorage.getItem('ranking')) || [];

    // Exibir ranking na tela
    ranking.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.innerText = `${index + 1}. ${entry.name}: ${entry.score} pontos`;
        rankingList.appendChild(listItem);
    });
}

const clearRankingButton = document.getElementById('clear-ranking-btn');

// Função para limpar o ranking
function clearRanking() {
    localStorage.removeItem('ranking'); // Remove o ranking do localStorage
    rankingList.innerHTML = ""; // Limpa a lista exibida
    alert("Ranking limpo com sucesso!"); // Mensagem de confirmação
}

// Adicionando o listener de evento ao botão
clearRankingButton.addEventListener('click', clearRanking);


nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    showQuestion();
});

submitNameButton.addEventListener('click', submitScore);

restartButton.addEventListener('click', startQuiz);

startQuiz();