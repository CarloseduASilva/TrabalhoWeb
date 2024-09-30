const questionsDC = [
    {
        question: 'Quem é o verdadeiro nome do Batman?',
        answers: [
            { text: 'Bruce Wayne', correct: true },
            { text: 'Clark Kent', correct: false },
            { text: 'Tony Stark', correct: false },
            { text: 'Peter Parker', correct: false }
        ]
    },
    {
        question: 'Quem é o vilão principal em "Liga da Justiça"?',
        answers: [
            { text: 'Lobo da Estepe', correct: true },
            { text: 'Coringa', correct: false },
            { text: 'Lex Luthor', correct: false },
            { text: 'Ares', correct: false }
        ]
    },
    // Adicione mais perguntas aqui
];

// Variáveis globais
let currentQuestionIndex = 0;
let score = 0;
let shuffledQuestions = [];

// Elementos da página
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const scoreContainer = document.getElementById('score-container');
const scoreElement = document.getElementById('score');
const nameInputContainer = document.getElementById('name-input-container');
const submitNameButton = document.getElementById('submit-name-btn');
const nameInput = document.getElementById('name');
const rankingContainer = document.getElementById('ranking-container');
const rankingList = document.getElementById('ranking-list');

// Função para iniciar o quiz
function startQuiz() {
    score = 0;
    currentQuestionIndex = 0;
    shuffledQuestions = questionsDC.sort(() => Math.random() - 0.5); // Embaralhar perguntas
    document.getElementById('quiz').classList.remove('hide');
    scoreContainer.classList.add('hide');
    rankingContainer.classList.add('hide');
    nameInputContainer.classList.add('hide');
    showQuestion();
}

// Função para exibir a pergunta
function showQuestion() {
    resetState();
    const question = shuffledQuestions[currentQuestionIndex];
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
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

// Função para limpar o estado da pergunta anterior
function resetState() {
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

// Função para selecionar a resposta
function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct === 'true';
    if (correct) {
        score++;
    }
    Array.from(answerButtonsElement.children).forEach(button => {
        button.disabled = true; // Desabilitar botões após seleção
        setStatusClass(button, button.dataset.correct === 'true');
    });

    nextButton.classList.remove('hide');
}

// Função para definir a classe correta/incorreta
function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

// Função para remover as classes de status
function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

// Função para exibir a pontuação final
function showScore() {
    document.getElementById('quiz').classList.add('hide');
    scoreContainer.classList.remove('hide');
    scoreElement.innerText = `Você acertou ${score} de ${shuffledQuestions.length} perguntas.`;
    nameInputContainer.classList.remove('hide'); // Mostrar campo de nome
}

// Função para salvar o nome e pontuação no ranking
submitNameButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    if (name) {
        saveToRanking(name, score);
        nameInput.value = '';
        showRanking();
    }
});

// Função para salvar no ranking (usando localStorage)
function saveToRanking(name, score) {
    let ranking = JSON.parse(localStorage.getItem('rankingDC')) || [];
    ranking.push({ name, score });
    localStorage.setItem('rankingDC', JSON.stringify(ranking));
}

// Função para exibir o ranking
function showRanking() {
    rankingContainer.classList.remove('hide');
    rankingList.innerHTML = '';
    let ranking = JSON.parse(localStorage.getItem('rankingDC')) || [];
    ranking.sort((a, b) => b.score - a.score); // Ordenar por maior pontuação
    ranking.forEach(entry => {
        const li = document.createElement('li');
        li.innerText = `${entry.name} - ${entry.score} pontos`;
        rankingList.appendChild(li);
    });
    scoreContainer.classList.add('hide');
}

// Evento de clique no botão "Próxima Pergunta"
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < shuffledQuestions.length) {
        showQuestion();
    } else {
        showScore(); // Mostrar pontuação final apenas no final do quiz
    }
});

// Iniciar o quiz
startQuiz();
