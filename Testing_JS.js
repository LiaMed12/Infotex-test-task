// Создание копии структуры из файла test_file.js
let base = subjects;

// Буффер для хранения следующего направления сортировки
let directionSort = 1;

// Номер последней редактированной строки в структуре base
let editRow = -1;

// Пагинация
const pagination_element = document.getElementById('pagination');
let current_page = 1;
let rows = 10;


function writeTableRows()
{
    // Перезаписываем данные в таблице из структуры
    let bodyTable = document.getElementById("table");
    let count = bodyTable.childElementCount;
    for (let i = 0; i < count - 1; i++)
        writeTableRow(i);
}

function writeTableRow(row)
{
    //Перезапись данных в одной строке
    let bodyTable = document.getElementById("table");
    bodyTable.rows[row + 1].cells[0].textContent =  base[row].name.firstName;
    bodyTable.rows[row + 1].cells[1].textContent = base[row].name.lastName;
    bodyTable.rows[row + 1].cells[2].textContent = base[row].about;
    bodyTable.rows[row + 1].cells[3].style = "background-color: " + base[row].eyeColor;
}

function showWindow(x){
    // Показываем окно редактирования для выбранной строки
    editRow = x.rowIndex - 1;

    // Получаем элемент DIV и показываем его
    let logoutLink = document.getElementById("window");
    logoutLink.style.display = "block"

    // Вставляем в textarea's значения из выбранной строки
    let nameTxtArea = document.getElementById("name_text_window");
    nameTxtArea.value = base[editRow].name.firstName;
    let lastnameTxtArea = document.getElementById("lastname_text_window");
    lastnameTxtArea.value = base[editRow].name.lastName;
    let aboutTxtArea = document.getElementById("about_text_window");
    aboutTxtArea.value = base[editRow].about;
    let eyeTxtArea = document.getElementById("eye_text_window");
    eyeTxtArea.value = base[editRow].eyeColor;
}

function okEdit(){
    // Успешное редактирование - вставка текста из textarea's в структуру base
    base[editRow].name.firstName = document.getElementById("name_text_window").value;
    base[editRow].name.lastName = document.getElementById("lastname_text_window").value;
    base[editRow].about = document.getElementById("about_text_window").value;
    base[editRow].eyeColor = document.getElementById("eye_text_window").value;
    // Перезапись редактированной строки
    writeTableRow(editRow)
    // Скрываем окно редактирования
    closeWindow()
}

function closeWindow(){
    // Скрываем окно редактирования
    document.getElementById("window").style.display = "none"
}

function compare(a, b) {
    if (a > b)
        return 1;
    if (a < b)
        return -1;
    return 0;
}

function sortTable(column) {
    // Сортировка строки column (0 - Имя, 1 - Фамилия, 2 - Описание, 3 - Цвет глаз)
    if (column === 0)
        base.sort((a, b) => directionSort * compare(a.name.firstName, b.name.firstName));
    else if (column === 1)
        base.sort((a, b) => directionSort * compare(a.name.lastName, b.name.lastName));
    else if (column === 2)
        base.sort((a, b) => directionSort * compare(a.about, b.about));
    else
        base.sort((a, b) => directionSort * compare(a.eyeColor, b.eyeColor));
    directionSort *= -1;
    // Перезаписываем данные в таблице
    writeTableRows()
}

function initTable(base, rows, current_page) {
    let start = rows * --current_page;
    let bodyTable = document.getElementById("table");
    let paginatedItems = base.slice(start, start + rows);
    for (let person of paginatedItems) {
        let tr = document.createElement('tr');
        let td_name = document.createElement("td");
        let td_lastName = document.createElement("td");
        let td_about = document.createElement("td");
        let td_eyeColor = document.createElement("td");
        td_name.textContent = person.name.firstName;
        td_lastName.textContent = person.name.lastName;
        td_about.textContent = person.about;
        tr.setAttribute('onclick', "showWindow(this)");

        // Добавление css класса для отображение только двух строк
        td_about.className = "about";
        // Отображение цвета вместо слова
        td_eyeColor.style = "background-color: " + person.eyeColor;

        tr.append(td_name)
        tr.append(td_lastName)
        tr.append(td_about)
        tr.append(td_eyeColor)

        // Добавляем строку в таблицу
        bodyTable.append(tr)
    }
}

/*Определение кнопок*/
function SetupPagination (items, wrapper, rows_per_page) {
    wrapper.innerHTML = "";

    let page_count = Math.ceil(items.length / rows_per_page);
    for (let i = 1; i < page_count + 1; i++) {
        let btn = PaginationButton(i, items);
        wrapper.appendChild(btn);
    }
}

/*Логика кнопок*/
function PaginationButton (page, items) {
    let button = document.createElement('button');
    button.innerText = page;

    if (current_page === page) button.classList.add('active');

    button.addEventListener('click', function () {
        current_page = page;
        clearTable();
        initTable(items, rows, current_page);

        let current_btn = document.querySelector('.page_numbers button.active');
        current_btn.classList.remove('active');

        button.classList.add('active');
    });

    return button;
}

function clearTable() {
    // Перезаписываем данные в таблице из структуры
    let bodyTable = document.getElementById("table");
    let count = bodyTable.childElementCount;
    for (let i = 1; i < count; i++)
        bodyTable.deleteRow(1);
}

initTable(base, rows, current_page);
// Первоначальная инициализация таблицы

SetupPagination(base, pagination_element, rows);

