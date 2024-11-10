function createTable(users) {
    console.log('Users data:', users);

    const tableBody = document.getElementById('user-table-body');
    tableBody.innerHTML = ''; // Очистить таблицу перед добавлением новых строк

// Проверяем, есть ли пользователи в массиве
    if (!users || users.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Нет пользователей для отображения</td></tr>';
        return;
    }

    users.forEach(user => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.username}</td>
            <td>${user.roles ? user.roles.map(role => role.roleName).join(', ') : 'Не заданы'}</td>
            <td>
                <button type="button" class="btn bg-info text-white edit-button" data-id="${user.id}">
                    Edit
                </button>
            </td>
            <td>
                <button type="button" class="btn bg-danger text-white delete-button" data-id="${user.id}">
                    Delete
                </button>
            </td>
        `;

        tableBody.appendChild(row);
    });

// Добавляем обработчики для кнопок
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function () {
            const userId = this.getAttribute('data-id');
            openEditModal(userId); // Открытие модального окна для редактирования
        });
    });

    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', function () {
            const userId = this.getAttribute('data-id');
            openDeleteModal(userId); // Открытие модального окна для удаления
        });
    });
}

function loadUsers() {
    fetch('/admin/rest/')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(users => {
            createTable(users);
        })
        .catch(error => {
            console.error('Ошибка при получении данных:', error);
            // В случае ошибки показываем сообщение в таблице
            const tableBody = document.getElementById('user-table-body');
            tableBody.innerHTML = '<tr><td colspan="7" class="text-center">Не удалось загрузить данные</td></tr>';
        });
}

document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    loadCurrentUser();
});

// Функция для обновления списка пользователей
function updateUsers() {
    loadUsers();
}

async function loadCurrentUser() {
    try {
        const response = await fetch('/user/rest/');
        if (!response.ok) {
            throw new Error('Ошибка при получении данных пользователя');
        }
        const currentUser = await response.json();

        // Выводим информацию о текущем пользователе
        document.getElementById('user-info').textContent = `${currentUser.email} с ролями: ${currentUser.roles.map(role => role.roleName).join(', ')}`;

        createCurrentUserTable(currentUser);
    } catch (error) {
        console.error('Произошла ошибка:', error);
    }
}


function createCurrentUserTable(user) {
    const tableBody = document.getElementById('current-user-table-body');

    tableBody.innerHTML = '';

    const row = document.createElement('tr');
    row.innerHTML = `
    <td>${user.id}</td>
    <td>${user.name}</td>
    <td>${user.email}</td>
    <td>${user.username}</td>
    <td>${user.roles.map(role => role.roleName).join(', ')}</td>
`;
    tableBody.appendChild(row);
}

document.addEventListener('DOMContentLoaded', () => {
    loadCurrentUser();
});

// // Модальные окна для редактирования и удаления пользователей
// function openEditModal(userId) {
//     console.log("Edit user with ID: " + userId);
//     // Открытие модального окна для редактирования
// }
//
// function openDeleteModal(userId) {
//     console.log("Delete user with ID: " + userId);
//     // Открытие модального окна для подтверждения удаления
// }


async function deleteUser() {
    const userId = document.getElementById('deleteUserId').value;

    try {
        const response = await fetch(`/admin/rest/delete/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            $('#deleteUserModal').modal('hide');
            updateUsers(); // Обновить список пользователей после удаления
        } else {
            const errorText = await response.text();
            console.error('Ошибка при удалении пользователя:', errorText);
            alert('Ошибка при удалении пользователя: ' + errorText);
        }
    } catch (error) {
        console.error('Ошибка при удалении пользователя:', error);
        alert('Произошла ошибка. Попробуйте снова.');
    }
}


async function openDeleteModal(userId) {
    try {
        const response = await fetch(`/admin/rest/${userId}`);
        const user = await response.json();

        document.getElementById('deleteUserId').value = user.id;
        document.getElementById('deleteUserIdReadOnly').value = user.id;
        document.getElementById('deleteUserName').value = user.name;
        document.getElementById('deleteUserUsername').value = user.username;
        document.getElementById('deleteUserEmail').value = user.email;
        document.getElementById('deleteUserPassword').value = user.password;
        document.getElementById('deleteUserRole').value = user.roles[0].roleName;

        // const respons2e = await fetch(`/admin/rest/delete/${userId}`);
        deleteUser();

        $('#deleteUserModal').modal('show');
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
    }
}


document.getElementById('deleteUserForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const Id = document.getElementById('deleteUserId').value;

    try {
        const response = await fetch(`/admin/rest/delete/${Id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            $('#deleteUserModal').modal('hide');
            const targetTab = document.querySelector('#home-tab');
            const bootstrapTab = new bootstrap.Tab(targetTab);
            updateUsers();
            bootstrapTab.show();
        } else {
            throw new Error('Ошибка при обновлении пользователя');
        }
    } catch (error) {
        console.error('Ошибка при обновлении пользователя:', error);
        alert('Произошла ошибка. Попробуйте снова.');
    }
});


async function openEditModal(userId) {
    try {
        console.log(`Fetching data for userId: ${userId}`);
        const response = await fetch(`/admin/rest/${userId}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const user = await response.json();
        console.log('User data:', user);

        document.getElementById('editUserId').value = user.id;
        document.getElementById('editUserIdReadOnly').value = user.id;
        document.getElementById('editUserName').value = user.name;
        document.getElementById('editUserUsername').value = user.username;
        document.getElementById('editUserEmail').value = user.email;
        document.getElementById('editUserHiddenPassword').value = user.password;
        document.getElementById('editUserRole').value = user.roles[0].roleName;

        $('#editUserModal').modal('show');
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
        alert('Не удалось загрузить данные пользователя. Попробуйте снова.');
    }
}

document.getElementById('editUserForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const updatedUser = {
        id: document.getElementById('editUserId').value,
        name: document.getElementById('editUserName').value,
        username: document.getElementById('editUserUsername').value,
        email: document.getElementById('editUserEmail').value,
        password: document.getElementById('editUserHiddenPassword').value,
        roles: [{
            roleName: document.getElementById('editUserRole').value
        }]
    };

    try {
        console.log('Updating user:', updatedUser);
        const response = await fetch(`/admin/rest/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        });

        if (response.ok) {
            $('#editUserModal').modal('hide');
            updateUsers();
            alert('Пользователь успешно обновлен.');
        } else {
            const errorText = await response.text();
            console.error('Ошибка при обновлении пользователя:', errorText);
            alert('Ошибка при обновлении пользователя: ' + errorText);
        }
    } catch (error) {
        console.error('Ошибка при обновлении пользователя:', error);
        alert('Произошла ошибка. Попробуйте снова.');
    }
});


document.getElementById('setUserRole').addEventListener('mousedown', function (e) {
    e.preventDefault();
    var select = this;
    var scroll = select.scrollTop;
    if (e.target.tagName === 'OPTION') {
        e.target.selected = !e.target.selected;
    }
    select.scrollTop = scroll;
    if (select.tabIndex >= 0) {
        select.focus();
    }
}, false);
