const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

const strengthText = document.getElementById("strengthText");
const strengthFill = document.getElementById("strengthFill");
const scoreElement = document.getElementById("score");
const suggestion = document.getElementById("suggestion");

const requirements = {
    length: document.getElementById("lengthRequirement"),
    uppercase: document.getElementById("uppercaseRequirement"),
    lowercase: document.getElementById("lowercaseRequirement"),
    number: document.getElementById("numberRequirement"),
    symbol: document.getElementById("symbolRequirement")
};


/* =========================
   MOSTRAR / OCULTAR SENHA
========================= */

togglePassword.addEventListener("click", () => {

    const passwordIsHidden =
        passwordInput.type === "password";

    if (passwordIsHidden) {
        passwordInput.type = "text";
        togglePassword.textContent = "🙈";
    } else {
        passwordInput.type = "password";
        togglePassword.textContent = "👁";
    }

});


/* =========================
   ANALISAR ENQUANTO DIGITA
========================= */

passwordInput.addEventListener("input", analyzePassword);


/* =========================
   FUNÇÃO PRINCIPAL
========================= */

function analyzePassword() {

    const password = passwordInput.value;

    if (password.length === 0) {
        resetAnalyzer();
        return;
    }

    let score = 0;


    /* =========================
       VERIFICAÇÕES BÁSICAS
    ========================= */

    const hasMinLength = password.length >= 8;
    const hasStrongLength = password.length >= 12;

    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);


    /* =========================
       PONTUAÇÃO
    ========================= */

    if (hasMinLength) {
        score += 15;
    }

    if (hasStrongLength) {
        score += 15;
    }

    if (password.length >= 16) {
        score += 10;
    }

    if (hasUppercase) {
        score += 15;
    }

    if (hasLowercase) {
        score += 15;
    }

    if (hasNumber) {
        score += 15;
    }

    if (hasSymbol) {
        score += 15;
    }


    /* =========================
       DETECÇÃO DE PADRÕES FRACOS
    ========================= */

    const weakPatterns = [
        "123456",
        "12345678",
        "123456789",
        "password",
        "senha",
        "senha123",
        "qwerty",
        "qwerty123",
        "admin",
        "admin123",
        "abc123"
    ];

    const normalizedPassword =
        password.toLowerCase();

    const containsWeakPattern =
        weakPatterns.some(pattern =>
            normalizedPassword.includes(pattern)
        );

    if (containsWeakPattern) {
        score -= 30;
    }


    /* =========================
       SEQUÊNCIAS PREVISÍVEIS
    ========================= */

    const hasSequence =
        /1234|2345|3456|4567|5678|6789|abcd|bcde|cdef|qwer|wert/i
            .test(password);

    if (hasSequence) {
        score -= 15;
    }


    /* =========================
       CARACTERES REPETIDOS
    ========================= */

    const hasRepeatedCharacters =
        /(.)\1{2,}/.test(password);

    if (hasRepeatedCharacters) {
        score -= 15;
    }


    /* =========================
       GARANTE SCORE ENTRE 0 E 100
    ========================= */

    score = Math.max(0, Math.min(score, 100));


    /* =========================
       ATUALIZA REQUISITOS
    ========================= */

    updateRequirement(
        requirements.length,
        hasMinLength
    );

    updateRequirement(
        requirements.uppercase,
        hasUppercase
    );

    updateRequirement(
        requirements.lowercase,
        hasLowercase
    );

    updateRequirement(
        requirements.number,
        hasNumber
    );

    updateRequirement(
        requirements.symbol,
        hasSymbol
    );


    /* =========================
       ATUALIZA PONTUAÇÃO
    ========================= */

    scoreElement.textContent =
        `${score} / 100`;

    strengthFill.style.width =
        `${score}%`;


    /* =========================
       CLASSIFICAÇÃO
    ========================= */

    updateStrength(
        score,
        password,
        containsWeakPattern,
        hasSequence,
        hasRepeatedCharacters,
        hasStrongLength
    );

}


/* =========================
   ATUALIZA CHECKS
========================= */

function updateRequirement(element, isValid) {

    const icon = element.querySelector("span");

    if (isValid) {

        element.classList.add("valid");

        icon.textContent = "✓";

    } else {

        element.classList.remove("valid");

        icon.textContent = "○";

    }

}


/* =========================
   CLASSIFICAÇÃO DA SENHA
========================= */

function updateStrength(
    score,
    password,
    containsWeakPattern,
    hasSequence,
    hasRepeatedCharacters,
    hasStrongLength
) {

    if (score < 35) {

        strengthText.textContent =
            "Fraca";

        suggestion.textContent =
            "Sua senha está fraca. Use uma combinação maior de letras maiúsculas, minúsculas, números e símbolos.";

        return;
    }


    if (score < 60) {

        strengthText.textContent =
            "Média";

        suggestion.textContent =
            "Sua senha possui alguma variedade, mas ainda pode ser fortalecida com mais caracteres e combinações menos previsíveis.";

        return;
    }


    if (score < 85) {

        strengthText.textContent =
            "Forte";

        suggestion.textContent =
            "Boa senha. Para aumentar ainda mais a segurança, prefira pelo menos 12 caracteres e evite padrões previsíveis.";

        return;
    }


    strengthText.textContent =
        "Muito forte";


    if (containsWeakPattern) {

        suggestion.textContent =
            "A senha possui boa variedade, mas contém um padrão muito comum. Evite termos como 'senha', 'password', 'admin' ou sequências numéricas.";

    } else if (hasSequence) {

        suggestion.textContent =
            "A senha é forte, mas contém uma sequência previsível. Evite padrões como 1234, abcd ou qwerty.";

    } else if (hasRepeatedCharacters) {

        suggestion.textContent =
            "A senha é forte, mas possui caracteres repetidos. Reduza repetições para aumentar a imprevisibilidade.";

    } else if (!hasStrongLength) {

        suggestion.textContent =
            "Boa combinação de caracteres. Considere usar pelo menos 12 caracteres para aumentar ainda mais a segurança.";

    } else {

        suggestion.textContent =
            "Excelente! Sua senha possui bom comprimento, variedade de caracteres e não apresenta padrões simples detectados.";

    }

}


/* =========================
   RESET
========================= */

function resetAnalyzer() {

    scoreElement.textContent =
        "0 / 100";

    strengthText.textContent =
        "Aguardando...";

    strengthFill.style.width =
        "0%";

    suggestion.textContent =
        "Digite uma senha para iniciar a análise.";


    Object.values(requirements)
        .forEach(element => {

            element.classList.remove("valid");

            element.querySelector("span")
                .textContent = "○";

        });

}