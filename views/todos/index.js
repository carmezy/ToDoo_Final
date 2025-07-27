const input = document.querySelector('input');
const ul = document.querySelector('ul');
const addBtn = document.querySelector('.add-btn');
const invalidCheck = document.querySelector('.invalid-check');
const form = document.querySelector('#form');
const totalCountSpan = document.querySelector('.total-count');
const completedCountSpan = document.querySelector('.completed-count');
const incompletedCountSpan = document.querySelector('.incompleted-count');



const totalCount = () => {
    const howMany = document.querySelector('ul').children.length;
    totalCountSpan.innerHTML = howMany;
};

const completeCount = () => {
    const howMany = document.querySelectorAll('.line-through').length;
    completedCountSpan.innerHTML = howMany;
};

const incompletedCount = () => {
    const howMany = document.querySelectorAll('ul li:not(.line-through)').length;
    incompletedCountSpan.textContent = howMany;
};

const todoCount = () => {
    totalCount();
    completeCount();
    incompletedCount();
};

form.addEventListener('submit', async e => {
    e.preventDefault();

    // Check if the input is empty
    if (input.value === '') {
        input.classList.remove('focus:ring-2', 'focus:ring-violet-600');
        input.classList.add('focus:ring-2', 'focus:ring-rose-600');
        invalidCheck.classList.remove('hidden');
        return
    }

    // Remove classes and hide invalidCheck
    input.classList.remove('focus:ring-2', 'focus:ring-rose-600', 'border-2', 'border-rose-600');
    input.classList.add('focus:ring-2', 'focus:ring-violet-600');
    invalidCheck.classList.add('hidden');

    // Create list item
    const { data } = await axios.post('/api/todos', { text: input.value });
    console.log(data);

    const listItem = document.createElement('li');
    listItem.id = data.id;
    listItem.classList.add('flex', 'flex-row');
    listItem.innerHTML = `
        <div class="group grow flex flex-row justify-between">
            <button class="delete-icon w-12 md:w-14 hidden group-hover:flex group-hover:justify-center group-hover:items-center cursor-pointer bg-red-500 origin-left">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-7 md:w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <p class="p-4 break-words grow">${data.text}</p>
            <button class="edit-icon w-12 md:w-14 hidden group-hover:flex group-hover:justify-center group-hover:items-center cursor-pointer bg-blue-500 origin-left">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-7 md:w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L18.5 16H22v3.5l-9 9V17l7.5-7.5zm-5 4.5l5.5-5.5m-5 4.5l5.5-5.5" />
                </svg>
            </button>
        </div>
        <button class="check-icon w-12 md:w-14 flex justify-center items-center cursor-pointer border-l border-slate-300 dark:border-slate-400 hover:bg-green-300 transition duration-300 easy-in-out">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-7 md:w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
        </button>
    `;

    // Append listItem
    ul.append(listItem);

    // Empty input
    input.value = ''

    todoCount();
});

ul.addEventListener('click', async e => {

    // Select delete-icon
    if (e.target.closest('.delete-icon')) {
        const li = e.target.closest('.delete-icon').parentElement.parentElement;
        await axios.delete(`/api/todos/${li.id}`);
        li.remove();
        todoCount();
    }

    // Select check-icon
    if (e.target.closest('.check-icon')) {
        const checkIcon = e.target.closest('.check-icon');
        const listItem = checkIcon.parentElement;
        const isChecked = listItem.classList.contains('line-through');

        try {
            await axios.patch(`/api/todos/${listItem.id}`, { checked: !isChecked });
            if (!isChecked) {
                checkIcon.classList.add('bg-green-400');
                checkIcon.classList.remove('hover:bg-green-300');
                listItem.classList.add('line-through', 'text-slate-400', 'dark:text-slate-600');
            } else {
                checkIcon.classList.remove('bg-green-400');
                checkIcon.classList.add('hover:bg-green-300');
                listItem.classList.remove('line-through', 'text-slate-400', 'dark:text-slate-600');
            }
            todoCount();
        } catch (error) {
            console.error('Error updating todo status:', error);
        }
    }

    // Select edit-icon
    if (e.target.closest('.edit-icon')) {
        const editIcon = e.target.closest('.edit-icon');
        const listItem = editIcon.parentElement.parentElement;
        const todoTextParagraph = listItem.querySelector('p');
        const originalText = todoTextParagraph.textContent;

        const inputField = document.createElement('input');
        inputField.type = 'text';
        inputField.value = originalText;
        inputField.classList.add('p-4', 'break-words', 'grow', 'bg-slate-100', 'dark:bg-slate-700', 'rounded'); // Añade estilos al input

        todoTextParagraph.replaceWith(inputField);
        inputField.focus();

        const saveChanges = async () => {
            const newText = inputField.value.trim();
            if (newText === '' || newText === originalText) {
                inputField.replaceWith(todoTextParagraph); // Revierte si está vacío o no hay cambios
                return;
            }

            try {
                await axios.patch(`/api/todos/${listItem.id}`, { text: newText });
                todoTextParagraph.textContent = newText;
                inputField.replaceWith(todoTextParagraph);
            } catch (error) {
                console.error('Error updating todo text:', error);
                inputField.replaceWith(todoTextParagraph); // Revierte en caso de error
            }
        };

        inputField.addEventListener('blur', saveChanges);
        inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                saveChanges();
            }
        });
    }
});

(async () => {
    try {
        const { data } = await axios.get('/api/todos', {
            withCredentials: true
        });

        data.forEach(todo => {
            const listItem = document.createElement('li');
            listItem.id = todo.id;
            listItem.classList.add('flex', 'flex-row');
            listItem.innerHTML = `
                <div class="group grow flex flex-row justify-between">
                    <button class="delete-icon w-12 md:w-14 hidden group-hover:flex group-hover:justify-center group-hover:justify-center group-hover:items-center cursor-pointer bg-red-500 origin-left">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-7 md:w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <p class="p-4 break-words grow">${todo.text}</p>
                    <button class="edit-icon w-12 md:w-14 hidden group-hover:flex group-hover:justify-center group-hover:items-center cursor-pointer bg-blue-500 origin-left" id="edit-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-7 md:w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L18.5 16H22v3.5l-9 9V17l7.5-7.5zm-5 4.5l5.5-5.5m-5 4.5l5.5-5.5" />
                        </svg>
                    </button>
                </div>
                <button class="check-icon w-12 md:w-14 flex justify-center items-center cursor-pointer border-l border-slate-300 dark:border-slate-400 hover:bg-green-300 transition duration-300 easy-in-out">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 md:h-7 md:w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </button>
            `;
            if (todo.checked) {
                listItem.children[1].classList.add('bg-green-400');
                listItem.children[1].classList.remove('hover:bg-green-300');
                listItem.classList.add('line-through', 'text-slate-400', 'dark:text-slate-600');
            } else {
                listItem.children[1].classList.remove('bg-green-400');
                listItem.children[1].classList.add('hover:bg-green-300');
                listItem.classList.remove('line-through', 'text-slate-400', 'dark:text-slate-600');
            }
            ul.append(listItem);
        })
        todoCount();
    } catch (error) {
        window.location.pathname = '/login'
        console.log(error);
    }
})();