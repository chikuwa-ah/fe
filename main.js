const mainMethod = (file) => {
    const arrayedFile = arrayCSV(file);
    display(arrayedFile);
};

const arrayCSV = (file) => {
    const rows = file.split('\n');
    const array = rows.slice(0, rows.length - 1);
    return array.map(row => row.split(','));
};

const display = (data) => {
    const root = document.querySelector('.root');
    for (const row of data) {
        const div = document.createElement('div');
        root.appendChild(div);
        const number = createNormal(row[0], 'number');
        div.appendChild(number);
        const correct = createCorrect(row[1]);
        div.appendChild(correct);
        const big = createNormal(row[2], 'big');
        div.appendChild(big);
        const small = createNormal(row[3], 'small');
        div.appendChild(small);
        const link = createLink(row[5]);
        div.appendChild(link);
    };
};

const createNormal = (text, className) => {
    const element = document.createElement('div');
    element.textContent = text;
    element.classList.add(className);
    return element;
};

const createCorrect = (text) => {
    const element = document.createElement('div');
    element.textContent = text;
    element.classList.add('correct');
    if (text != '正誤') element.style.backgroundColor = text === '○' ? '#6cd0c6' : '#f67171';
    return element;
};

const createLink = (text) => {
    const div = document.createElement('div');
    if (text === '出典') {
        div.textContent = '出典';
        div.classList.add('link');
        return div;
    };
    const a = document.createElement('a');
    div.classList.add('link');
    a.textContent = 'LINK';
    const url = text.split('"')[3];
    a.href = url;
    a.target = '_blank';
    div.appendChild(a);
    return div;
};

window.addEventListener('DOMContentLoaded', () => {
    document.querySelector('input').addEventListener('change', (e) => {
        const result = e.target.files[0];
        const reader = new FileReader();
        reader.readAsArrayBuffer(result);
        reader.addEventListener('load', () => {
            const arrayBuffer = reader.result;
            const decoder = new TextDecoder('shift-jis');
            const decodedText = decoder.decode(arrayBuffer);
            mainMethod(decodedText);
        });
    });
});