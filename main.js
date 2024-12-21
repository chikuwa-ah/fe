//INITIAL
const initialMethod = (file) => {
    const arrayedFile = arrayCSV(file);
    const needData = dataRestructuring(arrayedFile);
    display(needData);
    const studyDate = arrayedFile[1][7];
    const rate = getRate(needData);
    displayDate(studyDate);
    displayInfo(rate[0], rate[1], rate[2], 0);
    generateButton(0);
    generateButton(1);
    buttonBackColor(0, 0);
    buttonBackColor(1, 0);

    const searchCriteria = new SearchCriteria(needData);
    const buttonEvent = new ButtonEvent(searchCriteria);
    buttonEvent.addEvent();
};

const arrayCSV = (file) => {
    const rows = file.split('\n');
    const array = rows.slice(0, rows.length - 1);
    return array.map(row => row.split(','));
};

const dataRestructuring = (arrayedFile) => arrayedFile.map(row => row.filter((_, i) => i < 6));

const getRate = (data) => {
    const correct = data.filter(row => row[1] === '○').length;
    const rate = Math.round(correct / (data.length - 1) * 10000) / 100;
    return [rate, correct, data.length - 1];
};

const displayDate = (date) => {
    const info = document.querySelector('.information-date');
    info.innerHTML = `
        <div class="info-date">
            <p>学習日： ${date}</p>
        </div>`;
};

const displayInfo = (rate, correct, length, state) => {
    const info = document.querySelector('.information-rate');
    if (state === 0) {
        info.innerHTML = `
        <div class="info-rate">
            <p>正答率： ${rate}% ( ${correct} / ${length} )</p>
        </div>`;
    } else {
        info.innerHTML = `
        <div class="info-rate">
            <p>件数： ${length}</p>
        </div>`;
    };
};


//REMOVE TABLE
const removeTable = () => {
    const parent = document.querySelector('.root');
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    };
    parent.style.border = 'none';
};

//DISPLAY TABLE
const display = (data) => {
    const root = document.querySelector('.root');
    root.style.border = '1px solid #000';
    for (const row of data) {
        const div = document.createElement('div');
        root.appendChild(div);

        const rowNameList = ['number', 'correct', 'big', 'middle', 'small'];
        for (const [i, name] of rowNameList.entries()) {
            const element = createNormalElement(row[i], name);
            div.appendChild(element);
        };
        const link = createLink(row[5]);
        div.appendChild(link);
    };
};

const createNormalElement = (text, className) => {
    const element = document.createElement('div');
    element.textContent = text;
    element.classList.add(className);
    if (text === '○' || text === '×') element.style.backgroundColor = text === '○' ? '#6cd0c6' : '#f67171';
    return element;
};

const createLink = (text) => {
    const element = document.createElement('a');
    element.classList.add('link');
    if (text === '出典') {
        element.textContent = text;
        return element;
    };
    element.classList.add('source');
    element.textContent = 'LINK';
    const url = text.split('"')[3];
    element.href = url;
    element.target = '_blank';
    return element;
};


//BUTTON
const generateButton = (index) => {
    const button = [['ALL', '○', '×'],
    ['ALL', 'テクノロジ系', 'マネジメント系', 'ストラテジ系'],
    ['ALL', '基礎理論', 'コンピュータシステム', '技術要素', '開発技術'],
    ['ALL', 'プロジェクトマネジメント', 'サービスマネジメント'],
    ['ALL', 'システム戦略', '経営戦略', '企業と法務']][index];
    const classification = ['button-correct', 'button-big', 'button-middle', 'button-middle', 'button-middle'][index];

    const root = document.querySelector('.operation-button');
    const parent = document.createElement('div');
    parent.classList.add('part');
    parent.classList.add(classification);
    for (const text of button) {
        const button = document.createElement('div');
        button.textContent = text;
        parent.appendChild(button);
    };
    root.appendChild(parent);
};

const removeMiddleButton = () => {
    const part = document.querySelector('.operation-button');
    const genreList = part.children;
    if (genreList[genreList.length - 1].classList[1] === 'button-middle') {
        part.removeChild(genreList[genreList.length - 1]);
    };
};


//EVENT
class ButtonEvent {
    constructor(conditionManager) {
        this.conditionManager = conditionManager;
        this.target = document.querySelector('.operation-button');
        this.handleButtonClick = this.handleButtonClick.bind(this);
    };

    handleButtonClick(event) {
        const target = event.target;
        const root = document.querySelector('.operation-button');
        const part = target.parentNode;
        const genre = Array.from(root.children).indexOf(part);
        const index = Array.from(part.children).indexOf(target);
        this.conditionManager.setCondition(genre, index);
    };

    addEvent() {
        this.target.addEventListener('click', this.handleButtonClick);
    };
};

class SearchCriteria {
    condition = [0, 0, 0];
    constructor(data) {
        this.data = data;
    };

    setCondition(index, value) {
        this.condition[index] = value;
        if (index === 1) {
            removeMiddleButton();
            this.condition[2] = 0;
            if (value != 0) {
                generateButton(value + 1);
                buttonBackColor(2, 0);
            };
        };
        changeCondition(this.condition, index, this.data);
    };

    getCondition() {
        return this.condition;
    };
};

const changeCondition = (nowCondition, changeGenre, data) => {
    buttonBackColor(changeGenre, nowCondition[changeGenre]);
    removeTable();

    const [, ...handleData] = data;
    const buttonList = document.querySelector('.operation-button').children;
    const filterCI = nowCondition[0] === 0 ? handleData : handleData.filter(row => row[1] === buttonList[0].children[nowCondition[0]].textContent);
    const filterBigGenre = nowCondition[1] === 0 ? filterCI : filterCI.filter(row => row[2] === buttonList[1].children[nowCondition[1]].textContent);
    const filterMiddleGenre = nowCondition[1] === 0 ? filterBigGenre : nowCondition[2] === 0 ? filterBigGenre : filterBigGenre.filter(row => row[3] === buttonList[2].children[nowCondition[2]].textContent);
    const completeData = [data[0], ...filterMiddleGenre];
    display(completeData);

    if (nowCondition[0] === 0) {
        const rate = getRate(completeData);
        displayInfo(rate[0], rate[1], rate[2], 0);
    } else {
        const correct = completeData.filter(row => row[1] === '○').length;
        const length = completeData.length - 1;
        displayInfo('', correct, length, 1);
    }
};

const buttonBackColor = (genre, index) => {
    const genreList = document.querySelector('.operation-button').children;
    const buttonList = genreList[genre].children;
    for (const button of buttonList) {
        button.style.backgroundColor = 'white';
    };
    genreList[genre].children[index].style.backgroundColor = '#bababa';
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
            initialMethod(decodedText);
        });
    });
});